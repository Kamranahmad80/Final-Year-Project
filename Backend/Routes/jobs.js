const express = require('express');
const router = express.Router();
const Job = require('../Models/job');
const User = require('../Models/User');
const { auth } = require('./auth');

// GET /api/jobs?location=...&category=...&page=1&limit=10&sortBy=latest
router.get('/', async (req, res) => {
  try {
    const {
      search,
      location,
      category,
      jobType,
      experience,
      salary,
      sortBy = 'latest',
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (location) {
      query.Location = { $regex: location, $options: 'i' };
    }

    if (category) {
      query.Category = category;
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experience) {
      query.description = { $regex: experience, $options: 'i' }; // adjust if you store experience separately
    }

    if (salary) {
      query.salaryDisplay = { $regex: salary, $options: 'i' };
    }

    // Sort logic
    let sortQuery = {};
    switch (sortBy) {
      case 'oldest':
        sortQuery = { postedAt: 1 };
        break;
      case 'salary_high':
        sortQuery = { salary: -1 };
        break;
      case 'salary_low':
        sortQuery = { salary: 1 };
        break;
      default:
        sortQuery = { postedAt: -1 }; // latest
    }

    const jobs = await Job.find(query)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(jobs);
    console.log("✅ Jobs fetched successfully");
  } catch (err) {
    console.error("❌ Error fetching jobs:", err.message);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
});

// GET /api/jobs/:id - Get a single job by ID
router.get('/:id', async (req, res) => {
  console.log(`🔍 Fetching job with ID: ${req.params.id}`);
  
  try {
    console.log('🔍 Attempting to find job in database...');
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      console.log(`❌ Job ${req.params.id} not found in database`);
      return res.status(404).json({ message: 'Job not found' });
    }
    
    console.log(`✅ Found job:`, { id: job._id, title: job.title });
    res.json(job);
  } catch (err) {
    console.error("❌ Error fetching job:", {
      message: err.message,
      name: err.name,
      kind: err.kind,
      stack: err.stack
    });
    
    // Handle invalid ObjectId format
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid job ID format' });
    }
    
    res.status(500).json({ 
      message: 'Server error fetching job',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// POST /api/jobs/:id/apply - Apply to a job
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const jobId = req.params.id;

    // Validate and fetch job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Prevent duplicate applications
    const applicantId = req.user._id;
    const alreadyApplied = Array.isArray(job.applicants) && job.applicants.some(id => id.toString() === applicantId.toString());
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'You have already applied to this job' });
    }

    // Ensure applicants array exists
    if (!Array.isArray(job.applicants)) {
      job.applicants = [];
    }
    job.applicants.push(applicantId);

    // If job has no employerId, attempt to link to an employer by company name
    if (!job.employerId) {
      const companyName = job.company || job.Company;
      if (companyName) {
        const employer = await User.findOne({ role: 'employer', 'companyDetails.companyName': companyName });
        if (employer) {
          job.employerId = employer._id;
        }
      }
    }

    await job.save();

    return res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        jobId: job._id,
        applicantsCount: job.applicants.length
      }
    });
  } catch (err) {
    console.error('❌ Error applying to job:', err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Invalid job ID format' });
    }
    return res.status(500).json({ success: false, message: 'Server error submitting application' });
  }
});

module.exports = router;
