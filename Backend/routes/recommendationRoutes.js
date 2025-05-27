// Backend/routes/recommendationRoutes.js
import express from "express";
import { getJobRecommendations } from "../controllers/recommendationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get personalized job recommendations based on resume
router.get("/", protect, getJobRecommendations);

export default router;
