import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";

export const registerUser = async (req, res) => {
  // Extract fields; resume file is handled by Multer (available as req.file)
  const { name, email, password, role } = req.body;
  // For employees, if resume is uploaded, store its path
  const resume = req.file ? req.file.path : null;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password, // Remember to hash in production
      role: role || "employee",
      // For employees, store resume; for employers, this field remains undefined
      resume: role === "employee" ? resume : undefined,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        resume: user.resume,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Login user & get token
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    // For production, compare hashed passwords using bcrypt
    if (user && user.password === password) {
      const token = generateToken(user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile (Read)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile (Update)
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.nick_name = req.body.nick_name || user.nick_name;
      user.companyName = req.body.companyName || user.companyName;
      user.country = req.body.country || user.country;
      user.language = req.body.language || user.language;
      user.experience = req.body.experience || user.experience;
      user.resume = req.body.resume || user.resume;
      user.photo = req.body.photo || user.photo;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        nick_name: updatedUser.nick_name,
        companyName: updatedUser.companyName,
        country: updatedUser.country,
        language: updatedUser.language,
        experience: updatedUser.experience,
        resume: updatedUser.resume,
        photo: updatedUser.photo,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user profile (Delete)
export const deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      await user.remove();
      res.json({ message: "User profile deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Save a job
export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check if job is already saved
    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: "Job already saved" });
    }
    
    // Add job to savedJobs
    user.savedJobs.push(jobId);
    await user.save();
    
    res.status(200).json({ message: "Job saved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a saved job
export const removeSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Remove job from savedJobs
    user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    await user.save();
    
    res.status(200).json({ message: "Job removed from saved jobs" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check if job application already exists
    if (user.appliedJobs.includes(jobId)) {
      return res.status(400).json({ message: "Already applied to this job" });
    }
    
    // Add job to appliedJobs
    user.appliedJobs.push(jobId);
    await user.save();
    
    res.status(200).json({ message: "Application submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get saved jobs
export const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedJobs');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user.savedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get applied jobs
export const getAppliedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('appliedJobs');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user.appliedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Request password reset
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist" });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Set token and expiry
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    
    // Here you would normally send an email with the reset token
    // For now, we'll just return the token in the response
    res.status(200).json({ 
      message: "Password reset instructions sent to your email",
      resetToken // Remove this in production, only for testing
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset password using token
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    // Find user with the given reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: "Password reset token is invalid or has expired" });
    }
    
    // Update password and clear reset token fields
    user.password = password; // In production, hash this password
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    
    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if a job is saved by the user
export const checkJobSaved = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const isSaved = user.savedJobs.includes(jobId);
    res.status(200).json({ isSaved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if a job is applied by the user
export const checkJobApplied = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const isApplied = user.appliedJobs.includes(jobId);
    res.status(200).json({ isApplied });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
