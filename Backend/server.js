import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);
connectDB();

const app = express();

// Allow requests from http://localhost:5173
app.use(cors({
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
}));

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
