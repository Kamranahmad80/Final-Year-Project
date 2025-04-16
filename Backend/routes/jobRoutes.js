// backend/routes/jobRoutes.js
import express from "express";
import { getJobs, getJobById, createJob, updateJob, deleteJob, getJobSuggestions,getJobCategories } from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getJobs);
router.get("/categories", getJobCategories);
router.get("/suggestions", getJobSuggestions); // New endpoint
router.get("/:id", getJobById);
router.post("/", protect, createJob);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

export default router;
