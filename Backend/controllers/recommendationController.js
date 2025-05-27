// Backend/controllers/recommendationController.js
import Job from '../models/Job.js';
import User from '../models/User.js';
import { extractResumeKeywords, prepareResumeDataForAI } from '../utils/resumeParser.js';
import { aiModelService } from '../services/aiModelService.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get job recommendations for a user based on their resume
 * @route GET /api/recommendations
 * @access Private (requires authentication)
 */
export const getJobRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user profile with resume info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has a resume
    console.log('User resume path:', user.resume);  
    if (!user.resume) {
      console.log('No resume found for user:', userId);
      return res.status(400).json({ 
        message: 'No resume found. Please upload your resume to get personalized recommendations',
        hasResume: false
      });
    }

    // Resolve the full path to the resume file
    let resumePath = user.resume;
    if (!path.isAbsolute(resumePath)) {
      if (resumePath.startsWith('uploads/')) {
        resumePath = path.join(__dirname, '..', resumePath);
      } else {
        resumePath = path.join(__dirname, '..', 'uploads', resumePath);
      }
    }
    console.log('Resolved resume path:', resumePath);

    // Get all active jobs
    const allJobs = await Job.find({ status: 'Active' });
    console.log(`Found ${allJobs.length} active jobs for recommendation`);
    
    if (allJobs.length === 0) {
      return res.status(404).json({
        message: 'No active jobs found to match with your profile',
        hasResume: true,
        recommendations: []
      });
    }

    // First try to use AI model for resume parsing and job recommendations
    try {
      // Check if AI service is available
      const aiAvailable = await aiModelService.checkAvailability();
      
      if (aiAvailable) {
        console.log('AI model is available, attempting to use AI recommendation service');
        
        // Try to use the AI service to parse the resume directly
        try {
          // Use the AI model to analyze resume
          const aiResumeData = await aiModelService.analyzeResume(resumePath);
          console.log('AI resume analysis successful');
          
          // Prepare user data with AI-extracted resume data
          const userData = {
            userId: userId.toString(),
            skills: aiResumeData.skills || [],
            experiences: user.experiences || [], // Keep user's stored experiences
            education: aiResumeData.education || [],
            resumeText: aiResumeData.text || ''
          };
          
          // Get AI recommendations
          const aiRecommendations = await aiModelService.getRecommendations(userData, allJobs);
          
          console.log(`Returning ${aiRecommendations.length} AI-powered recommendations`);
          return res.status(200).json({
            recommendations: aiRecommendations,
            hasResume: true,
            isAIRecommendation: true,
            message: 'AI-powered job recommendations based on your profile'
          });
        } catch (aiParsingError) {
          console.error('AI resume parsing failed, falling back to local parsing:', aiParsingError.message);
          // Continue with local resume parsing if AI parsing fails
        }
      } else {
        console.log('AI model is not available, using local parsing');
      }
      
      // Local resume parsing fallback
      console.log('Attempting to extract resume data locally from:', resumePath);
      let resumeData;
      try {
        resumeData = await extractResumeKeywords(resumePath);
        console.log('Successfully extracted resume data locally');
      } catch (extractError) {
        console.error('Error extracting resume data:', extractError);
        return res.status(400).json({
          message: 'Unable to process your resume. Please upload a valid resume file.',
          hasResume: true,
          error: extractError.message
        });
      }
      
      // Prepare data for AI model with locally parsed resume
      // Use user ID from request for MongoDB ObjectId validation
      const userId = req.user ? req.user._id.toString() : '5f50c31f5b5f7a3a3c7e7c5a';
      const userData = prepareResumeDataForAI(resumeData, user.experiences, userId);
      
      // Try AI recommendations with locally parsed data
      try {
        // Make sure we have skills data - add default skills if missing
        if (!userData.resume_data || !userData.resume_data.skills || userData.resume_data.skills.length === 0) {
          console.log('No skills detected in resume, adding default skills');
          userData.resume_data = userData.resume_data || {};
          userData.resume_data.skills = [
            'javascript', 'html', 'css', 'communication', 'teamwork', 
            'problem solving', 'critical thinking', 'time management'
          ];
        }
        
        console.log(`Using ${userData.resume_data.skills.length} skills for matching: ${userData.resume_data.skills.join(', ')}`);
        
        // Make sure we have some job data to match against
        if (!allJobs || allJobs.length === 0) {
          console.warn('No jobs found in database, recommendation will return empty results');
        } else {
          console.log(`Matching against ${allJobs.length} available jobs`);
        }
        
        // Get recommendations from AI model
        console.log('Sending request to AI model service...');
        const aiRecommendations = await aiModelService.getRecommendations(userData, allJobs);
        console.log(`Successfully received ${aiRecommendations.length} AI recommendations`);
        
        // If we got no recommendations, try to use the fallback algorithm
        if (aiRecommendations.length === 0 && allJobs.length > 0) {
          console.log('AI returned zero recommendations, trying fallback algorithm');
          const fallbackRecommendations = rankJobsByRelevance(allJobs, userData.resume_data.skills, userData.resume_data.experience || []);
          
          return res.status(200).json({
            status: 'success',
            recommendations: fallbackRecommendations,
            hasResume: true,
            isAIRecommendation: false,
            message: 'Job recommendations based on your skills (fallback method)'
          });
        }
        
        // Send successful AI recommendations
        return res.status(200).json({
          status: 'success',
          recommendations: aiRecommendations,
          hasResume: true,
          isAIRecommendation: true,
          message: 'AI-powered job recommendations'
        });
      } catch (aiError) {
        console.log('AI recommendation service unavailable, using fallback method:', aiError.message);
        
        // If AI model fails completely, use fallback method
        const fallbackRecommendations = rankJobsByRelevance(allJobs, resumeData.skills, user.experiences);
        
        return res.status(200).json({
          recommendations: fallbackRecommendations,
          hasResume: true,
          isAIRecommendation: false,
          message: 'Standard matching algorithm used (AI recommendations unavailable)'
        });
      }
    } catch (error) {
      console.error('Error in recommendation flow:', error);
      
      // Ultimate fallback - use simple matching if everything else fails
      try {
        // Extract keywords using local method as last resort
        const resumeData = await extractResumeKeywords(resumePath);
        const fallbackRecommendations = rankJobsByRelevance(allJobs, resumeData.skills, user.experiences);
        
        return res.status(200).json({
          recommendations: fallbackRecommendations,
          hasResume: true,
          isAIRecommendation: false,
          message: 'Standard matching algorithm used due to technical issues'
        });
      } catch (finalError) {
        // If even the fallback fails, return error
        return res.status(500).json({ 
          message: 'Unable to generate job recommendations at this time', 
          error: finalError.message,
          hasResume: true
        });
      }
    }
    
  } catch (error) {
    console.error('Error in job recommendations:', error);
    res.status(500).json({ message: 'Failed to get job recommendations', error: error.message });
  }
};

/**
 * Fallback method to rank jobs by relevance to user profile
 * This simple algorithm ranks jobs based on skill match percentage
 */
const rankJobsByRelevance = (jobs, userSkills, userExperiences) => {
  if (!userSkills || userSkills.length === 0) {
    // If no skills are found, return jobs in default order
    return jobs.slice(0, 10).map(job => job.toObject()); // Limit to 10 jobs
  }
  
  // Convert user skills to lowercase for case-insensitive matching
  const normalizedUserSkills = userSkills.map(skill => skill.toLowerCase());
  
  // Create a set of experience-related keywords from user's experiences
  const experienceKeywords = new Set();
  if (userExperiences && userExperiences.length > 0) {
    userExperiences.forEach(exp => {
      if (exp.title) {
        exp.title.toLowerCase().split(/\s+/).forEach(word => {
          if (word.length > 3) experienceKeywords.add(word);
        });
      }
      if (exp.description) {
        exp.description.toLowerCase().split(/\s+/).forEach(word => {
          if (word.length > 3) experienceKeywords.add(word);
        });
      }
    });
  }
  
  // For each job, calculate a match score
  const jobsWithScores = jobs.map(job => {
    let score = 0;
    let matchedSkills = [];
    
    // Check job required skills against user skills
    if (job.skills && job.skills.required) {
      job.skills.required.forEach(requiredSkill => {
        const normalizedSkill = requiredSkill.toLowerCase();
        
        // Check for direct skill match (highest weight)
        if (normalizedUserSkills.includes(normalizedSkill)) {
          score += 10;
          matchedSkills.push(requiredSkill);
        }
        
        // Check for partial skill match
        normalizedUserSkills.forEach(userSkill => {
          if (normalizedSkill.includes(userSkill) || userSkill.includes(normalizedSkill)) {
            score += 5;
          }
        });
      });
    }
    
    // Check job title against experience titles
    if (job.Title) {
      const titleWords = job.Title.toLowerCase().split(/\s+/);
      titleWords.forEach(word => {
        if (experienceKeywords.has(word)) {
          score += 8;
        }
      });
    }
    
    // Check job category against user experience
    if (job.Category) {
      const categoryWords = job.Category.toLowerCase().split(/\s+/);
      categoryWords.forEach(word => {
        if (experienceKeywords.has(word)) {
          score += 5;
        }
      });
    }
    
    // Check experience level match
    if (job.experience && userExperiences) {
      // Simplified logic - can be expanded based on more detailed experience matching
      const userExperienceYears = userExperiences.length > 0 ? userExperiences.length : 0;
      
      // Map experience levels to approximate years
      const experienceLevels = {
        'Entry Level': { min: 0, max: 2 },
        'Mid Level': { min: 2, max: 5 },
        'Senior Level': { min: 5, max: 10 },
        'Manager': { min: 5, max: 15 },
        'Executive': { min: 10, max: 30 }
      };
      
      const jobExperienceRange = experienceLevels[job.experience] || { min: 0, max: 30 };
      
      if (userExperienceYears >= jobExperienceRange.min && userExperienceYears <= jobExperienceRange.max) {
        score += 7;
      }
    }
    
    return {
      job,
      score,
      matchedSkills
    };
  });
  
  // Sort by score (highest first)
  jobsWithScores.sort((a, b) => b.score - a.score);
  
  // Return jobs with their match info
  return jobsWithScores.map(item => ({
    ...item.job.toObject(),
    matchScore: item.score,
    matchedSkills: item.matchedSkills
  }));
};
