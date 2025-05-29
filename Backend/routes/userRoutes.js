import express from "express";
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  deleteUserProfile,
  saveJob,
  removeSavedJob,
  applyForJob,
  getSavedJobs,
  getAppliedJobs,
  forgotPassword,
  resetPassword,
  checkJobSaved,
  checkJobApplied
} from "../controllers/userController.js";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();
// Register user with file upload handling
router.post("/register", upload.single("resume"), registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, upload.single("resume"), updateUserProfile);
router.delete("/profile", protect, deleteUserProfile);

// Job application routes
router.post("/jobs/save", protect, saveJob);
router.delete("/jobs/save/:jobId", protect, removeSavedJob);
router.post("/jobs/apply", protect, applyForJob);
router.get("/jobs/saved", protect, getSavedJobs);
router.get("/jobs/applied", protect, getAppliedJobs);

// Job status check routes (more efficient)
router.get("/jobs/saved/:jobId/check", protect, checkJobSaved);
router.get("/jobs/applied/:jobId/check", protect, checkJobApplied);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Resume file retrieval endpoint
router.get("/resume/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.resumeFile || !user.resumeFile.data) {
      return res.status(404).json({ message: "Resume not found" });
    }
    
    // Set the appropriate content type
    res.set('Content-Type', user.resumeFile.contentType);
    res.set('Content-Disposition', `inline; filename="${user.resumeFile.name}"`);
    
    // Send the file data
    return res.send(user.resumeFile.data);
  } catch (error) {
    console.error("Error retrieving resume:", error);
    return res.status(500).json({ message: "Server error retrieving resume" });
  }
});

// Upload company logo
router.post("/upload/logo", protect, upload.single("logo"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Return the path to the uploaded file
    const logoUrl = `/uploads/logos/${req.file.filename}`;
    res.status(200).json({ url: logoUrl });
  } catch (error) {
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
});

// Upload resume
router.post("/upload/resume", protect, upload.single("resume"), async (req, res) => {
  try {
    console.log('Resume upload request received');
    console.log('Request file:', req.file);
    
    if (!req.file) {
      console.log('No file found in request');
      return res.status(400).json({ message: 'No resume file uploaded' });
    }
    
    // Get the path to the uploaded file
    const resumePath = `uploads/resumes/${req.file.filename}`;
    console.log('Resume saved to path:', resumePath);
    
    // Update the user's resume field in the database
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found with ID:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Store the resume path in the user record
    user.resume = resumePath;
    const savedUser = await user.save();
    console.log('User updated with resume path:', savedUser.resume);
    
    // Also update the userInfo in localStorage via response
    const userInfo = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      resume: savedUser.resume
    };
    
    // Return the path to the uploaded file
    res.status(200).json({ 
      url: resumePath,
      message: 'Resume uploaded successfully',
      userInfo
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ message: 'Resume upload failed', error: error.message });
  }
});

export default router;
