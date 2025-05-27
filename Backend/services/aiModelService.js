// Backend/services/aiModelService.js
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// AI model endpoint configuration
const AI_MODEL_URL = process.env.AI_MODEL_URL || 'http://localhost:8000';
const AI_MODEL_API_KEY = process.env.AI_MODEL_API_KEY || '';
const AI_TIMEOUT_MS = process.env.AI_TIMEOUT_MS || 30000; // 30 seconds default timeout

/**
 * Service to interact with the external AI model
 */
export const aiModelService = {
  /**
   * Get job recommendations from AI model
   * @param {Object} userData - User profile data including resume analysis
   * @param {Array} jobs - Available jobs to rank
   * @returns {Array} - Ranked jobs with match scores
   */
  getRecommendations: async (userData, jobs) => {
    try {
      // Validate input data
      if (!userData || !Array.isArray(jobs) || jobs.length === 0) {
        console.warn('Invalid input data for AI recommendations');
        throw new Error('Invalid input data for AI recommendations');
      }

      // Check if AI service is available before making the request
      const isAvailable = await aiModelService.checkAvailability();
      if (!isAvailable) {
        console.warn('AI recommendation service is not available');
        throw new Error('AI recommendation service is not available');
      }
      
      // Use the prepared data directly since it's now in the correct format
      // Just ensure the user_id field is in the right format for the API
      const userProfile = {
        user_id: userData.userId || userData._id?.toString() || '5f50c31f5b5f7a3a3c7e7c5a',
        resume_data: userData.resume_data || {
          skills: [],
          experience: [],
          education: []
        }
      };
      
      // Ensure required data types
      if (!Array.isArray(userProfile.resume_data.skills)) {
        userProfile.resume_data.skills = [];
      }
      if (!Array.isArray(userProfile.resume_data.experience)) {
        userProfile.resume_data.experience = [];
      }
      if (!Array.isArray(userProfile.resume_data.education)) {
        userProfile.resume_data.education = [];
      }

      console.log('Calling AI recommendation service at:', `${AI_MODEL_URL}/api/recommend-jobs`);
      console.log('User profile data sample:', {
        user_id: userProfile.user_id,
        skills_count: userProfile.resume_data.skills.length,
        experience_count: userProfile.resume_data.experience.length
      });
      
      // Log the exact payload for debugging
      console.log('===== SENDING PAYLOAD TO AI MODEL =====');
      console.log(JSON.stringify(userProfile, null, 2));
      console.log('=====================================');

      try {
        // Make API call to AI model with proper error handling
        const response = await axios.post(
          `${AI_MODEL_URL}/api/recommend-jobs`,
          userProfile,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': AI_MODEL_API_KEY
            },
            timeout: parseInt(AI_TIMEOUT_MS)
          }
        );

        // Process and return the AI model response
        if (response.data && response.data.success && response.data.data && response.data.data.recommendations) {
          const aiRecommendations = response.data.data.recommendations;
          
          console.log(`Received ${aiRecommendations.length} recommendations from AI model`);
          
          // Map the AI recommendations to match expected format
          const processedRecommendations = aiRecommendations.map(rec => {
            // Find the original job
            const originalJob = jobs.find(job => job._id.toString() === rec.id);
            
            if (!originalJob) {
              console.warn(`Job with ID ${rec.id} not found in database`);
              return null; // Skip if job not found
            }
            
            // Return job with AI scoring
            return {
              ...originalJob.toObject(),
              matchScore: rec.match_score || 0,
              matchedSkills: rec.match_factors?.skill_match ? 
                            (typeof rec.match_factors.skill_match === 'object' ? 
                             Object.keys(rec.match_factors.skill_match) : 
                             []) : 
                            [],
              matchReason: rec.match_reason || 'AI-based recommendation',
              confidenceScore: rec.confidence_score || rec.match_score || 0,
              aiRecommended: true
            };
          }).filter(Boolean); // Remove any null entries
          
          return processedRecommendations;
        } else {
          console.error('Invalid AI model response format:', response.data);
          throw new Error('Invalid response from AI model');
        }
      } catch (innerError) {
        // Handle specific API errors
        console.error('AI Model API Error:', innerError.message);
        if (innerError.response) {
          console.error('API Response Error Details:', {
            status: innerError.response.status,
            statusText: innerError.response.statusText,
            data: innerError.response.data
          });
          
          // Special handling for validation errors (422)
          if (innerError.response.status === 422) {
            console.error('Validation error - check data format sent to API');
          }
        }
        throw innerError; // Re-throw to be caught by outer try-catch
      }
    } catch (error) {
      console.error('AI Model Service Error:', error.message);
      if (error.response) {
        console.error('AI Service Response Error:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      throw new Error(`Failed to get recommendations from AI model: ${error.message}`);
    }
  },
  
  /**
   * Check if the AI service is available
   * @returns {Boolean} - True if available, false otherwise
   */
  checkAvailability: async () => {
    try {
      const response = await axios.get(`${AI_MODEL_URL}/`, {
        timeout: 5000, // Short timeout for health check
        headers: {
          'X-API-Key': AI_MODEL_API_KEY
        }
      });
      
      return response.status === 200 && response.data && response.data.status === 'active';
    } catch (error) {
      console.error('AI service health check failed:', error.message);
      return false;
    }
  },
  
  /**
   * Submit resume for analysis to the AI model
   * @param {String} resumeFilePath - Path to resume file 
   * @returns {Object} - Parse results with skills and experience
   */
  analyzeResume: async (resumeFilePath) => {
    try {
      // First check if service is available
      const isAvailable = await aiModelService.checkAvailability();
      if (!isAvailable) {
        throw new Error('AI resume analysis service is not available');
      }
      
      // Create form data with resume file
      const FormData = require('form-data');
      const fs = require('fs');
      const path = require('path');
      
      // Validate file exists
      if (!fs.existsSync(resumeFilePath)) {
        throw new Error(`Resume file not found at: ${resumeFilePath}`);
      }
      
      const formData = new FormData();
      formData.append('file', fs.createReadStream(resumeFilePath), {
        filename: path.basename(resumeFilePath)
      });
      
      // Make API call to analyze resume
      const response = await axios.post(
        `${AI_MODEL_URL}/api/analyze-resume`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'X-API-Key': AI_MODEL_API_KEY
          },
          timeout: parseInt(AI_TIMEOUT_MS)
        }
      );
      
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error('Invalid response from AI resume analysis');
      }
    } catch (error) {
      console.error('AI Resume Analysis Error:', error.message);
      throw new Error(`Failed to analyze resume with AI service: ${error.message}`);
    }
  }
};
