// Backend/utils/resumeParser.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

// Convert fs.readFile to Promise-based
const readFileAsync = promisify(fs.readFile);

// Get directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extract keywords and information from a resume file
 * @param {String} resumePath - Path to the user's resume file
 * @returns {Object} Extracted keywords and information
 */
export const extractResumeKeywords = async (resumePath) => {
  try {
    // Debug the incoming path
    console.log('Original resume path:', resumePath);
    
    // If resumePath is just a filename, construct the full path
    if (!path.isAbsolute(resumePath)) {
      // Handle common patterns
      if (resumePath.startsWith('uploads/')) {
        // Path is already relative to project root
        resumePath = path.join(__dirname, '..', resumePath);
      } else {
        resumePath = path.join(__dirname, '..', 'uploads', resumePath);
      }
    }
    
    console.log('Resolved resume path:', resumePath);
    
    // Check if file exists
    if (!fs.existsSync(resumePath)) {
      console.error('Resume file not found at path:', resumePath);
      throw new Error(`Resume file not found at path: ${resumePath}`);
    }
    
    // Read the resume file
    // Note: This is a simple implementation. For production, you'd use 
    // specialized libraries for different file types (PDF, DOCX, etc.)
    console.log('Attempting to read resume file...');
    const buffer = await readFileAsync(resumePath);
    console.log('Resume file read successfully, size:', buffer.length, 'bytes');
    
    // For now, we're implementing simple text extraction
    // Later, this would be replaced with more sophisticated parsing
    // or preprocessing for your AI model
    const text = buffer.toString();
    
    // Simple keyword extraction (this would be much more sophisticated in production)
    const extractedData = {
      text: text,
      keywords: extractKeywords(text),
      skills: extractSkills(text),
      education: extractEducation(text)
    };
    
    return extractedData;
    
  } catch (error) {
    console.error('Error parsing resume:', error);
    // Return empty data if parsing fails
    return {
      text: '',
      keywords: [],
      skills: [],
      education: []
    };
  }
};

/**
 * Simple keyword extraction function
 * In production, this would be replaced by NLP or AI-based extraction
 */
const extractKeywords = (text) => {
  // Convert to lowercase and remove special characters
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  
  // Split by whitespace and filter out common words and short words
  const words = cleanText.split(/\s+/);
  
  // Filter out common words (this would be a much larger list in production)
  const commonWords = ['and', 'the', 'to', 'of', 'a', 'in', 'for', 'with', 'on', 'at'];
  
  // Count word frequency
  const wordFrequency = {};
  words.forEach(word => {
    if (word.length > 2 && !commonWords.includes(word)) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  });
  
  // Sort by frequency and take top keywords
  return Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(entry => entry[0]);
};

/**
 * Extract skills from resume text with enhanced detection and default fallbacks
 * This implementation combines pattern matching with keyword analysis
 */
const extractSkills = (text) => {
  // Common technical skills to look for - expanded list
  const skillsToFind = [
    // Programming languages
    'javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift',
    'kotlin', 'scala', 'perl', 'r', 'matlab', 'typescript', 'dart', 'bash', 'powershell',
    
    // Web development
    'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind', 'material-ui', 'jquery',
    'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt', 'gatsby', 'webpack', 'babel',
    'responsive design', 'progressive web apps', 'spa', 'ssr', 'pwa',
    
    // Backend
    'nodejs', 'express', 'django', 'flask', 'spring', 'laravel', 'asp.net', 'rails',
    'fastapi', 'graphql', 'rest', 'api', 'microservices', 'websockets', 'grpc',
    
    // Databases
    'sql', 'nosql', 'mongodb', 'mysql', 'postgresql', 'oracle', 'sqlite', 'redis',
    'elasticsearch', 'cassandra', 'dynamodb', 'firebase', 'neo4j', 'couchdb',
    
    // DevOps & Cloud
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab-ci',
    'github actions', 'terraform', 'ansible', 'ci/cd', 'linux', 'unix', 'nginx',
    'apache', 'serverless', 'lambda', 'cloud functions',
    
    // Testing
    'testing', 'unit testing', 'integration testing', 'jest', 'mocha', 'cypress',
    'selenium', 'puppeteer', 'junit', 'pytest', 'tdd', 'bdd', 'qa',
    
    // Data
    'data analysis', 'machine learning', 'artificial intelligence', 'nlp',
    'computer vision', 'big data', 'hadoop', 'spark', 'tableau', 'power bi',
    'data visualization', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'scikit-learn',
    
    // General skills
    'problem solving', 'critical thinking', 'teamwork', 'communication',
    'leadership', 'time management', 'project management', 'agile', 'scrum',
    'kanban', 'product management', 'git', 'github', 'bitbucket', 'jira',
    'confluence', 'slack',
    
    // Design
    'ui/ux', 'design thinking', 'figma', 'sketch', 'adobe xd', 'photoshop',
    'illustrator', 'indesign', 'after effects', 'premiere pro',
    
    // Marketing & Content
    'seo', 'sem', 'content marketing', 'social media marketing', 'email marketing',
    'copywriting', 'content writing', 'technical writing', 'blog writing',
    
    // Mobile
    'android', 'ios', 'react native', 'flutter', 'xamarin', 'ionic', 'swift',
    'objective-c', 'mobile development'
  ];
  
  // Default skills to include if we don't find any
  const defaultSkills = [
    'javascript', 'html', 'css', 'communication', 'problem solving',
    'teamwork', 'time management', 'critical thinking'
  ];
  
  // More sophisticated approach: look for skills in context
  const lowerText = text.toLowerCase();
  
  // Use regex to find skill sections
  const skillSectionRegex = /skills?:|technical skills?:|core competenc(y|ies):|proficienc(y|ies):|qualifications?:/i;
  const hasSkillSection = skillSectionRegex.test(text);
  
  // First, try to find exact matches
  let foundSkills = skillsToFind.filter(skill => lowerText.includes(skill));
  
  // If we find very few skills, try to extract skills from bullet points
  if (foundSkills.length < 3) {
    // Look for bullet points or numbered lists which often contain skills
    const bulletPointRegex = /(•|\*|\-|\d+\.)\s*([^\n]+)/g;
    const bulletPoints = [...lowerText.matchAll(bulletPointRegex)].map(match => match[2].trim());
    
    // Check each bullet point for skills
    bulletPoints.forEach(point => {
      skillsToFind.forEach(skill => {
        if (point.includes(skill) && !foundSkills.includes(skill)) {
          foundSkills.push(skill);
        }
      });
    });
  }
  
  // If we still don't have enough skills, add some common defaults
  if (foundSkills.length < 5) {
    console.log('Adding default skills as not enough were found in the resume');
    
    // Add some default skills that weren't already found
    defaultSkills.forEach(skill => {
      if (!foundSkills.includes(skill)) {
        foundSkills.push(skill);
      }
    });
  }
  
  console.log(`Extracted ${foundSkills.length} skills from resume`);
  return foundSkills;
};

/**
 * Extract education information
 * Simple implementation - would use NLP in production
 */
const extractEducation = (text) => {
  // Common education keywords
  const educationKeywords = [
    'bachelor', 'master', 'phd', 'doctorate', 'degree',
    'bs', 'ba', 'ms', 'ma', 'mba', 'bsc', 'btech', 'mtech',
    'university', 'college', 'institute', 'school'
  ];
  
  // Potential degrees
  const degrees = [
    'computer science', 'information technology', 'data science',
    'business administration', 'marketing', 'finance', 'economics',
    'engineering', 'electrical engineering', 'mechanical engineering',
    'psychology', 'biology', 'chemistry', 'physics', 'mathematics'
  ];
  
  const lowerText = text.toLowerCase();
  
  // Find education keywords in text
  const foundEducation = educationKeywords.filter(keyword => 
    lowerText.includes(keyword)
  );
  
  // Find potential degrees
  const foundDegrees = degrees.filter(degree => 
    lowerText.includes(degree)
  );
  
  return {
    keywords: foundEducation,
    degrees: foundDegrees
  };
};

/**
 * Prepare resume data for AI model
 * This formats the extracted data in a structure suitable for the AI recommendation model
 */
export const prepareResumeDataForAI = (extractedData, userExperiences, userId = null) => {
  // Format specifically to match what the AI model API expects (RecommendationRequest schema)
  // The userId must be a valid MongoDB ObjectId format
  return {
    // Use a proper ObjectId format - the AI model validates this
    userId: userId || '5f50c31f5b5f7a3a3c7e7c5a', // Use a default valid ObjectId as a fallback
    
    // Define resume_data structure for API
    resume_data: {
      // Skills from resume
      skills: extractedData.skills || [],
      
      // Format experiences for the AI model - important: match the expected format
      experience: (userExperiences || []).map(exp => ({
        start_year: exp.startDate ? exp.startDate.substring(0, 4) : '2020',
        end_year: exp.endDate ? (exp.endDate === 'present' ? 'present' : exp.endDate.substring(0, 4)) : 'present',
        company: exp.company || '',
        role: exp.title || '',
        description: exp.description || ''
      })),
      
      // Education information as array
      education: Array.isArray(extractedData.education) 
        ? extractedData.education.map(edu => ({
            degree: edu.degree || '',
            institution: edu.institution || '',
            start_year: '2020', // Default values since we may not have this
            end_year: 'present'
          }))
        : []
    },
    
    // Include original data for fallback algorithm if needed
    originalData: {
      keywords: extractedData.keywords || [],
      rawText: extractedData.text || ''
    }
  };
};
