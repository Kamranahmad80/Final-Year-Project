const express = require('express');
const router = express.Router();
const { auth } = require('./auth');
const User = require('../Models/User');
const Job = require('../Models/job');
const axios = require('axios');
const fs = require('fs');
const pdf = require('pdf-parse');

// 📌 GET /api/recommend - Get recommended jobs based on resume
router.get('/', auth, async (req, res) => {
  console.log('Recommendation request received for user:', req.user.id);
  
  try {
    // Get user with resume path
    const user = await User.findById(req.user.id).select('resume');
    console.log('User found:', user ? 'Yes' : 'No');
    console.log('User resume path:', user?.resume);

    if (!user) {
      console.error('User not found in database');
      return res.status(404).json({ 
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND' 
      });
    }

    if (!user.resume || !user.resume.data) {
      console.error('No resume uploaded for user');
      return res.status(400).json({ 
        success: false,
        message: 'Please upload your resume first to get job recommendations',
        error: 'RESUME_NOT_FOUND',
        code: 'UPLOAD_RESUME_FIRST'
      });
    }

    try {
      console.log(`Processing resume: ${user.resume.originalName} (${user.resume.size} bytes)`);
      
      // Log resume metadata
      console.log('Resume metadata:', {
        originalName: user.resume.originalName,
        size: user.resume.size,
        contentType: user.resume.contentType,
        dataType: typeof user.resume.data,
        dataLength: user.resume.data?.length || 0
      });

      // Convert binary data to text
      let resumeText = '';
      try {
        // First try to detect if it's a PDF by checking the first few bytes
        const isPdf = user.resume.data.length > 4 && 
          user.resume.data[0] === 0x25 && // %
          user.resume.data[1] === 0x50 && // P
          user.resume.data[2] === 0x44 && // D
          user.resume.data[3] === 0x46;   // F

        if (isPdf) {
          console.log('PDF detected, extracting text...');
          try {
            // Parse PDF and extract text
            const pdfData = await pdf(user.resume.data);
            resumeText = pdfData.text;
            console.log('Successfully extracted text from PDF, length:', resumeText.length);
            
            // Clean up the extracted text
            if (resumeText) {
              // Remove excessive whitespace and line breaks
              resumeText = resumeText.replace(/\s+/g, ' ').trim();
              console.log('Cleaned PDF text length:', resumeText.length);
              
              // If text is still suspiciously short, try alternative extraction
              if (resumeText.length < 100) {
                console.warn('Extracted PDF text is very short, trying alternative extraction');
                // Try to extract text from buffer directly as fallback
                resumeText = user.resume.data.toString('utf8');
                resumeText = resumeText.replace(/[^\x00-\x7F]/g, ' ').replace(/\s+/g, ' ').trim();
                console.log('Alternative extraction length:', resumeText.length);
              }
            }
          } catch (pdfError) {
            console.error('Error parsing PDF:', pdfError);
            // Fallback to simple text extraction
            resumeText = user.resume.data.toString('utf8');
            resumeText = resumeText.replace(/[^\x00-\x7F]/g, ' ').replace(/\s+/g, ' ').trim();
            console.log('Fallback text extraction length:', resumeText.length);
          }
        } else {
          // Not a PDF, try to convert to text directly
          console.log('Non-PDF resume detected, converting to text...');
          resumeText = user.resume.data.toString('utf8');
          resumeText = resumeText.replace(/[^\x00-\x7F]/g, ' ').replace(/\s+/g, ' ').trim();
          console.log('Converted resume to text, length:', resumeText.length);
        }
      } catch (error) {
        console.error('Error processing resume data:', error);
        throw new Error('Failed to process resume: ' + error.message);
      }
      
      console.log('Resume text length:', resumeText?.length || 0);

      if (!resumeText || resumeText.trim().length === 0) {
        throw new Error('Resume file is empty or could not be processed');
      }

      let categories = [];
      
      try {
        // 🔁 Try to send resume to Flask AI API
        const flaskUrl = 'http://127.0.0.1:5001/recommend';
        console.log(`Attempting to connect to Flask AI API at ${flaskUrl}...`);
        
        const requestData = {
          resume: resumeText.substring(0, 10000) // Limit the size to prevent timeouts
        };
        
        console.log('Sending request to Flask API with data length:', requestData.resume.length);
        console.log('First 200 chars of resume text:', requestData.resume.substring(0, 200));
        
        const flaskRes = await axios({
          method: 'POST',
          url: flaskUrl,
          data: requestData,
          timeout: 30000, // 30 seconds timeout
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          maxContentLength: 1000000, // 1MB max response size
          maxRedirects: 0, // Disable redirects
          responseType: 'json',
          validateStatus: (status) => status < 500 // Don't throw on 4xx errors
        });

        console.log('Received response from Flask API. Status:', flaskRes.status);
        console.log('Response data:', JSON.stringify(flaskRes.data, null, 2));
        
        // Log the full response for debugging
        console.log('Full response status:', flaskRes.status);
        console.log('Response headers:', JSON.stringify(flaskRes.headers, null, 2));
        
        if (flaskRes.status !== 200) {
          throw new Error(`Flask API returned status ${flaskRes.status}: ${JSON.stringify(flaskRes.data || {})}`);
        }
        
        if (!flaskRes.data) {
          throw new Error('No data received from Flask API');
        }
        
        // Handle different response formats
        if (flaskRes.data.predicted_categories) {
          // Handle array of categories
          categories = Array.isArray(flaskRes.data.predicted_categories) 
            ? flaskRes.data.predicted_categories 
            : [flaskRes.data.predicted_categories];
        } 
        // Handle direct category in response (e.g., { category: 'Full Stack Developer', score: 5.572 })
        else if (flaskRes.data.category) {
          categories = [flaskRes.data.category];
        }
        // Handle error response
        else if (flaskRes.data.error) {
          throw new Error(flaskRes.data.error);
        } else {
          // If no categories found but response is successful, try to extract from the response
          const responseStr = JSON.stringify(flaskRes.data);
          if (responseStr.includes('Full Stack Developer')) {
            categories = ['Full Stack Developer'];
          } else {
            categories = [];
          }
        }
        
        console.log('Predicted categories from AI:', categories);
      } catch (error) {
        console.warn('Could not connect to Flask AI API, using fallback categories. Error:', error.message);
        
        // Enhanced fallback: Try to extract categories from the resume text
        const categoryKeywords = {
          'Software Development': ['software', 'developer', 'programming', 'programmer', 'coding', 'code'],
          'Web Development': ['web', 'frontend', 'backend', 'fullstack', 'full stack', 'javascript', 'react', 'angular', 'vue', 'node'],
          'Data Science': ['data science', 'data analysis', 'data scientist', 'machine learning', 'ml', 'ai', 'artificial intelligence'],
          'Mobile Development': ['mobile', 'android', 'ios', 'react native', 'flutter', 'swift', 'kotlin'],
          'DevOps': ['devops', 'docker', 'kubernetes', 'ci/cd', 'continuous integration', 'continuous deployment'],
          'Cloud Computing': ['aws', 'azure', 'google cloud', 'gcp', 'cloud', 'amazon web services'],
          'Database': ['database', 'sql', 'mongodb', 'mysql', 'postgresql', 'oracle'],
          'Cybersecurity': ['cyber security', 'security', 'penetration testing', 'ethical hacking'],
          'UI/UX Design': ['ui', 'ux', 'user interface', 'user experience', 'figma', 'sketch', 'adobe xd']
        };
        
        // Convert resume to lowercase for case-insensitive matching
        const resumeLower = resumeText.toLowerCase();
        
        // Find matching categories based on keywords
        categories = Object.entries(categoryKeywords)
          .filter(([_, keywords]) => 
            keywords.some(keyword => resumeLower.includes(keyword))
          )
          .map(([category]) => category);
        
        console.log('Matched categories from keywords:', categories);
        
        // If no categories found, use a default
        if (categories.length === 0) {
          console.log('No specific categories found, defaulting to General IT');
          categories = ['General IT'];
        }
        
        console.log('Using fallback categories:', categories);
      }

      if (!Array.isArray(categories) || categories.length === 0) {
        console.warn('No categories could be determined from the resume');
        return res.json({ 
          success: true, 
          message: 'No specific job categories could be determined from your resume',
          categories: [],
          jobs: []
        });
      }

      // 🔍 Fetch jobs from MongoDB for each category
      console.log('Fetching jobs for categories:', categories);
      let jobs = [];
      if (categories.length > 0) {
        console.log('Searching for jobs with categories:', categories);
        
        // Create case-insensitive regex patterns for each category
        const categoryPatterns = categories.map(cat => new RegExp(cat, 'i'));
        
        // Search for jobs where category matches any of the predicted categories
        jobs = await Job.find({
          $or: [
            { category: { $in: categoryPatterns } },
            { title: { $in: categoryPatterns } },
            { description: { $in: categoryPatterns } }
          ]
        }).limit(10);
        
        console.log(`Found ${jobs.length} jobs matching categories:`, categories);
        
        // If no jobs found with exact matches, try a more flexible search
        if (jobs.length === 0) {
          console.log('No exact matches, trying flexible search...');
          const searchTerms = categories.join(' ');
          jobs = await Job.find({
            $text: { $search: searchTerms }
          }).limit(10);
          
          console.log(`Found ${jobs.length} jobs with flexible search`);
        }
      }
      return res.json({ 
        success: true, 
        message: 'Recommendations fetched successfully',
        categories,
        jobs
      });
      
    } catch (error) {
      console.error('❌ Error processing recommendation:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      
      // Handle specific errors
      if (error.code === 'ENOENT') {
        return res.status(404).json({
          success: false,
          message: 'Resume file not found on server',
          error: 'RESUME_FILE_NOT_FOUND'
        });
      }
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Flask API error response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        return res.status(502).json({
          success: false,
          message: 'Error from AI service: ' + (error.response.data?.message || error.message),
          error: 'AI_SERVICE_ERROR',
          details: process.env.NODE_ENV === 'development' ? error.response.data : undefined
        });
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response from Flask API:', error.request);
        return res.status(503).json({
          success: false,
          message: 'AI service is not responding',
          error: 'AI_SERVICE_UNAVAILABLE'
        });
      }
      
      // Something happened in setting up the request that triggered an Error
      throw error;
    }
  } catch (err) {
    console.error('❌ Unexpected error in recommendation route:', {
      message: err.message,
      stack: err.stack
    });
    
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_SERVER_ERROR',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;
