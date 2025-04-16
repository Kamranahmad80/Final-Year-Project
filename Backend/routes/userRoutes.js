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

export default router;
