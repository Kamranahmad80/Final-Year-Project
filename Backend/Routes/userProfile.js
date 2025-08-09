const express = require('express');
const router = express.Router();
const { auth } = require('./auth');
const User = require('../Models/User');
const Job = require('../Models/job');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

// Configure multer for resume uploads
const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed!'), false);
    }
  }
});

// Employer: Get all applications for jobs owned by the employer
router.get('/employer/applications', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const companyName = req.user.companyDetails?.companyName;

    // Find jobs by employerId or (fallback) by matching company name
    const jobs = await Job.find({
      $or: [
        { employerId: req.user._id },
        ...(companyName ? [{ $and: [
          { employerId: { $exists: false } },
          { $or: [ { company: companyName }, { Company: companyName } ] }
        ]}] : [])
      ]
    })
      .populate({ path: 'applicants', select: '-password -resume.data' })
      .select('-__v');

    // Optionally backfill employerId for matching jobs without it
    const toUpdate = jobs.filter(j => !j.employerId);
    for (const j of toUpdate) {
      j.employerId = req.user._id;
      await j.save();
    }

    res.json({ success: true, data: jobs });
  } catch (err) {
    console.error('Error fetching employer applications:', err);
    res.status(500).json({ success: false, message: 'Server error fetching applications' });
  }
});

// Employer: Get applicants for a specific job
router.get('/employer/jobs/:jobId/applicants', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const job = await Job.findById(req.params.jobId)
      .populate({ path: 'applicants', select: '-password -resume.data' });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Ensure the employer owns the job (by employerId or company name)
    const companyName = req.user.companyDetails?.companyName;
    const ownsJob = (job.employerId && job.employerId.toString() === req.user._id.toString())
      || (!!companyName && (job.company === companyName || job.Company === companyName));

    if (!ownsJob) {
      return res.status(403).json({ success: false, message: 'Not authorized to view applicants for this job' });
    }

    res.json({ success: true, data: { jobId: job._id, applicants: job.applicants || [] } });
  } catch (err) {
    console.error('Error fetching job applicants:', err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Invalid job ID format' });
    }
    res.status(500).json({ success: false, message: 'Server error fetching applicants' });
  }
});

// Configure multer for memory storage (we'll store the file in MongoDB)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only allow one file
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed!'));
    }
  }
});

// Get current user's profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -resume.data');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Convert to plain object and add id field
    const userData = user.toObject();
    userData.id = user._id.toString();
    
    // Add resume URL if resume exists
    if (userData.resume) {
      userData.resume.url = `/api/users/resume/${user._id}`;
      userData.resume.id = user._id.toString();
    }
    
    // Include role in response
    userData.role = user.role;
    
    res.json(userData);
  } catch (err) {
    console.error('Error in /me route:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// Upload resume
router.post('/upload-resume', [auth, resumeUpload.single('resume')], async (req, res) => {
  console.log('=== UPLOAD RESUME REQUEST ===');
  console.log('Headers:', {
    'content-type': req.headers['content-type'],
    'content-length': req.headers['content-length'],
    'x-auth-token': req.headers['x-auth-token'] ? 'Token present' : 'No token',
    'user-agent': req.headers['user-agent']
  });
  
  console.log('Request body keys:', Object.keys(req.body));
  console.log('Request file info:', {
    file: req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      encoding: req.file.encoding,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bufferLength: req.file.buffer?.length
    } : 'No file',
    files: req.files ? Object.keys(req.files) : 'No files'
  });
  
  console.log('Authenticated user:', {
    id: req.user?.id,
    role: req.user?.role
  });

  try {
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ 
        success: false,
        msg: 'No file uploaded',
        receivedFiles: req.files,
        body: req.body
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      console.error('User not found:', req.user.id);
      return res.status(404).json({ 
        success: false,
        msg: 'User not found' 
      });
    }

    console.log('Updating user resume data...');
    
    try {
      // Update user's resume data
      user.resume = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        originalName: req.file.originalname,
        size: req.file.size,
        uploadDate: Date.now()
      };

      console.log('Saving user with resume data...');
      await user.save();
      console.log('User resume saved successfully');
    } catch (saveError) {
      console.error('Error saving resume:', saveError);
      return res.status(500).json({
        success: false,
        msg: 'Failed to save resume',
        error: saveError.message
      });
    }

    // Prepare response data without the binary data
    const responseData = {
      success: true,
      msg: 'Resume uploaded successfully',
      resume: {
        id: user._id,
        originalName: user.resume.originalName,
        size: user.resume.size,
        uploadDate: user.resume.uploadDate,
        url: `/api/users/resume/${user._id}`,
        contentType: user.resume.contentType
      }
    };

    console.log('Sending success response:', JSON.stringify(responseData, null, 2));
    
    res.json(responseData);
  } catch (err) {
    console.error('Error in resume upload route:', {
      message: err.message,
      stack: err.stack,
      user: req.user?.id,
      file: req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : 'No file in error handler'
    });
    
    res.status(500).json({ 
      success: false,
      msg: 'Server error during resume upload',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// Update user profile
router.put('/update', [auth, upload.single('resume')], async (req, res) => {
  console.log('Update profile request received', {
    body: req.body,
    file: req.file ? 'File received' : 'No file',
    filePath: req.file?.path
  });

  const {
    name,
    phone,
    address,
    skills,
    experience,
    education,
    resumeData
  } = req.body;

  // Build profile object
  const profileFields = {};
  if (name) profileFields.name = name;
  if (phone) profileFields.phone = phone;
  
  // Handle address - could be string or object
  if (address) {
    try {
      profileFields.address = typeof address === 'string' ? JSON.parse(address) : address;
    } catch (e) {
      console.error('Error parsing address:', e);
      return res.status(400).json({ msg: 'Invalid address format' });
    }
  }
  
  // Handle skills - could be string or array
  if (skills) {
    try {
      profileFields.skills = Array.isArray(skills) 
        ? skills 
        : typeof skills === 'string' 
          ? JSON.parse(skills)
          : skills.split(',').map(skill => skill.trim());
    } catch (e) {
      console.error('Error parsing skills:', e);
      return res.status(400).json({ msg: 'Invalid skills format' });
    }
  }
  
  // Handle resume file upload
  if (req.file) {
    console.log('Processing uploaded file:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bufferLength: req.file.buffer?.length
    });
    
    // New file uploaded - store as binary data in MongoDB
    profileFields.resume = {
      data: req.file.buffer, // The binary file data
      contentType: req.file.mimetype,
      originalName: req.file.originalname,
      size: req.file.size,
      uploadDate: new Date()
    };
    console.log(`Storing resume in database: ${req.file.originalname} (${req.file.size} bytes)`);
  } else if (resumeData) {
    console.log('Processing resumeData:', resumeData);
    try {
      // If resumeData is a string, try to parse it as JSON
      const resumeInfo = typeof resumeData === 'string' ? JSON.parse(resumeData) : resumeData;
      
      // If resumeData is provided but no file, preserve existing resume data
      const user = await User.findById(req.user.id).select('resume');
      if (user?.resume && user.resume.data) {
        // Only preserve if we have actual resume data
        profileFields.resume = {
          data: user.resume.data,
          contentType: user.resume.contentType,
          originalName: user.resume.originalName || 'resume.pdf',
          size: user.resume.size || 0,
          uploadDate: user.resume.uploadDate || new Date()
        };
        console.log(`Preserving existing resume: ${profileFields.resume.originalName}`);
      }
    } catch (e) {
      console.error('Error handling resume data:', e);
      // Clear the resume field to prevent invalid data
      profileFields.resume = undefined;
    }
  } else {
    // Explicitly set resume to undefined if not provided
    profileFields.resume = undefined;
  }
  
  try {
    // Handle experience if provided
    if (experience) {
      try {
        profileFields.experience = Array.isArray(experience) 
          ? experience 
          : JSON.parse(experience);
      } catch (e) {
        console.error('Error parsing experience:', e);
        return res.status(400).json({ 
          success: false,
          msg: 'Invalid experience format',
          error: e.message 
        });
      }
    }
    
    // Handle education if provided
    if (education) {
      try {
        profileFields.education = Array.isArray(education)
          ? education
          : JSON.parse(education);
      } catch (e) {
        console.error('Error parsing education:', e);
        return res.status(400).json({ 
          success: false,
          msg: 'Invalid education format',
          error: e.message 
        });
      }
    }

    let user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update user
    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password -resume.data'); // Don't send the binary data in the response

    // Format the response to include the resume URL if it exists
    const responseData = user.toObject();
    
    if (responseData.resume) {
      // Add a URL to access the resume
      responseData.resume.url = `/api/users/resume/${user._id}`;
      
      // Remove the binary data if it's still there
      if (responseData.resume.data) {
        delete responseData.resume.data;
      }
    }

    console.log('Sending response:', {
      userId: user._id,
      hasResume: !!user.resume,
      resumeFields: user.resume ? Object.keys(user.resume) : null
    });

    res.json(responseData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get user's resume
router.get('/resume/:userId', auth, async (req, res) => {
  try {
    console.log('Resume download request received:', {
      userId: req.params.userId,
      authUser: req.user.id,
      headers: req.headers
    });

    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      console.log('Invalid user ID format:', req.params.userId);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user ID format',
        error: 'INVALID_USER_ID'
      });
    }

    // Only allow users to access their own resume
    if (req.user.id !== req.params.userId) {
      console.log('Unauthorized access attempt:', {
        authenticatedUser: req.user.id,
        requestedUser: req.params.userId
      });
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to access this resource',
        error: 'UNAUTHORIZED_ACCESS'
      });
    }

    const user = await User.findById(req.params.userId).select('resume');
    
    if (!user) {
      console.log('User not found:', req.params.userId);
      return res.status(404).json({ 
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }
    
    if (!user.resume || !user.resume.data) {
      console.log('Resume not found for user:', req.params.userId);
      return res.status(404).json({ 
        success: false,
        message: 'Resume not found',
        error: 'RESUME_NOT_FOUND'
      });
    }

    console.log('Sending resume data for user:', req.params.userId);
    
    // Set the appropriate content type and headers
    res.set({
      'Content-Type': user.resume.contentType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${user.resume.originalName || 'resume'}"`,
      'Content-Length': user.resume.size,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    // Send the binary data
    res.send(user.resume.data);
  } catch (err) {
    console.error('Error in resume download:', {
      error: err.message,
      stack: err.stack,
      userId: req.params.userId
    });
    
    res.status(500).json({ 
      success: false,
      message: 'Server error while processing your request',
      error: 'SERVER_ERROR',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// @route   POST api/users/upload-resume
// @desc    Upload or update user's resume
// @access  Private
router.post('/upload-resume', [auth, resumeUpload.single('resume')], async (req, res) => {
  console.log('Upload resume request received', {
    file: req.file ? {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : 'No file',
    user: req.user.id
  });

  try {
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ 
        success: false,
        msg: 'No file uploaded. Please select a file to upload.',
        error: 'NO_FILE'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      console.error('User not found:', req.user.id);
      return res.status(404).json({ 
        success: false,
        msg: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Delete existing resume if it exists
    if (user.resume) {
      console.log('Deleting existing resume for user:', user._id);
      user.resume = undefined;
    }

    // Add new resume
    user.resume = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
      originalName: req.file.originalname,
      size: req.file.size,
      uploadDate: new Date()
    };

    console.log('Saving user with new resume...');
    await user.save();
    console.log('Resume saved successfully for user:', user._id);

    const response = {
      success: true,
      msg: 'Resume uploaded successfully',
      resume: {
        id: user._id,
        originalName: user.resume.originalName,
        size: user.resume.size,
        uploadDate: user.resume.uploadDate,
        url: `/api/users/resume/${user._id}`,
        contentType: user.resume.contentType
      }
    };

    console.log('Sending success response');
    return res.json(response);
  } catch (err) {
    console.error('Error in resume upload:', {
      error: err.message,
      stack: err.stack,
      user: req.user?.id,
      file: req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : 'No file in error handler'
    });

    let errorMsg = 'Server error during resume upload';
    let statusCode = 500;
    
    if (err.message.includes('File too large')) {
      errorMsg = 'File size should be less than 5MB';
      statusCode = 400;
    } else if (err.message.includes('Unexpected field')) {
      errorMsg = 'Invalid file upload. Please make sure to upload a valid file.';
      statusCode = 400;
    }

    return res.status(statusCode).json({
      success: false,
      msg: errorMsg,
      error: err.code || 'UPLOAD_ERROR',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// @route   GET api/users/resume/:userId
// @desc    Get user's resume
// @access  Private
router.get('/resume/:userId', auth, async (req, res) => {
  try {
    // Only allow users to access their own resume
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const user = await User.findById(req.params.userId);
    
    if (!user || !user.resume || !user.resume.data) {
      return res.status(404).json({ msg: 'Resume not found' });
    }

    res.set({
      'Content-Type': user.resume.contentType,
      'Content-Disposition': `inline; filename="${user.resume.originalName}"`,
      'Content-Length': user.resume.size
    });

    res.send(user.resume.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/users/resume
// @desc    Delete user's resume
// @access  Private
router.delete('/resume', auth, async (req, res) => {
  console.log('Delete resume request received for user:', req.user.id);
  
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error('User not found:', req.user.id);
      return res.status(404).json({ 
        success: false,
        msg: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    if (!user.resume) {
      console.log('No resume found for user:', req.user.id);
      return res.status(404).json({
        success: false,
        msg: 'No resume found to delete',
        error: 'RESUME_NOT_FOUND'
      });
    }

    console.log('Deleting resume for user:', req.user.id);
    user.resume = undefined;
    await user.save();
    console.log('Resume deleted successfully for user:', req.user.id);

    res.json({ 
      success: true,
      msg: 'Resume removed successfully' 
    });
  } catch (err) {
    console.error('Error deleting resume:', {
      error: err.message,
      stack: err.stack,
      userId: req.user?.id
    });
    
    res.status(500).json({
      success: false,
      msg: 'Server error while deleting resume',
      error: 'DELETE_ERROR',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;
