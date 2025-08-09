// Backend/Routes/admin.js
const express = require("express");
const router = express.Router();
const Job = require("../Models/job");
const User = require("../Models/User");
const { auth } = require("./auth");

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  // First verify the token and get user
  auth(req, res, (err) => {
    if (err) return next(err);
    
    // Then check if user is admin
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required',
        error: 'UNAUTHORIZED'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Admin access required',
        error: 'FORBIDDEN'
      });
    }
    
    next();
  });
};

// Get all jobs
router.get("/jobs", isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search 
      ? { title: { $regex: search, $options: 'i' } } 
      : {};

    const jobs = await Job.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Job.countDocuments(query);

    res.json({
      success: true,
      message: 'Jobs retrieved successfully',
      data: {
        jobs,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      }
    });
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch jobs',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Delete user (cannot delete admins)
router.delete("/users/:id", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `No user found with ID: ${id}`
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'Admin accounts cannot be deleted'
      });
    }

    await User.findByIdAndDelete(id);
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'INVALID_ID',
        message: 'The provided user ID is not valid'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete user',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get all users
router.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch users',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get dashboard stats
router.get("/stats", isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    
    res.json({
      success: true,
      message: 'Stats retrieved successfully',
      data: {
        totalUsers,
        totalJobs,
        activeJobs,
        // Add more stats as needed
      }
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch stats',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Delete job
router.delete("/jobs/:id", isAdmin, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting job:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete job',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Create job
router.post("/jobs", isAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      Company, // backward-compat
      location,
      Location, // backward-compat
      category,
      Category, // backward-compat
      jobType,
      salary,
      salaryDisplay,
      skills,
      status
    } = req.body;

    if (!title || !(company || Company)) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'title and company are required'
      });
    }

    const payload = {
      title,
      description,
      company: company || Company,
      Company: Company || company,
      location: location || Location,
      Location: Location || location,
      category: category || Category,
      Category: Category || category,
      jobType,
      salary,
      salaryDisplay,
      skills,
      status
    };

    const job = await Job.create(payload);
    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create job',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Update job
router.put("/jobs/:id", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      company,
      Company,
      location,
      Location,
      category,
      Category,
      jobType,
      salary,
      salaryDisplay,
      skills,
      status
    } = req.body;

    const update = {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(company !== undefined && { company }),
      ...(Company !== undefined && { Company }),
      ...(location !== undefined && { location }),
      ...(Location !== undefined && { Location }),
      ...(category !== undefined && { category }),
      ...(Category !== undefined && { Category }),
      ...(jobType !== undefined && { jobType }),
      ...(salary !== undefined && { salary }),
      ...(salaryDisplay !== undefined && { salaryDisplay }),
      ...(skills !== undefined && { skills }),
      ...(status !== undefined && { status })
    };

    const job = await Job.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: `No job found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
  } catch (err) {
    console.error('Error updating job:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'INVALID_ID',
        message: 'The provided job ID is not valid'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update job',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});
// Update user status
router.put("/users/:id/status", isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Validate status input
    if (!status || !['active', 'suspended', 'banned'].includes(status)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid status',
        message: 'Status must be one of: active, suspended, banned'
      });
    }

    // Find and update user
    const user = await User.findByIdAndUpdate(
      id,
      { 
        status,
        updatedAt: Date.now()
      },
      { 
        new: true,
        runValidators: true
      }
    ).select('-password -__v');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found',
        message: `No user found with ID: ${id}`
      });
    }

    // Log the status change
    console.log(`User ${user.email} status updated to: ${status}`);

    // Return updated user data
    res.json({
      success: true,
      message: 'User status updated successfully',
      data: {
        id: user._id,
        email: user.email,
        status: user.status,
        role: user.role,
        updatedAt: user.updatedAt
      }
    });

  } catch (err) {
    console.error('Error updating user status:', err);
    
    // Handle different types of errors
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid user ID',
        message: 'The provided user ID is not valid'
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to update user status',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;