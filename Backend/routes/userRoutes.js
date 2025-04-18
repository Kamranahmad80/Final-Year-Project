import express from "express";
import { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUserProfile, } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";


const router = express.Router();
router.post("/register", upload.single("resume"), registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.delete("/profile", protect, deleteUserProfile);

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

export default router;
