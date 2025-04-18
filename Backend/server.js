import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://onjob-omega.vercel.app'],
  optionsSuccessStatus: 200,
}));

// Middleware
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);

// Add a health check route
app.get('/health', (req, res) => {
  res.status(200).send('API is running');
});

// Root route - redirect to info page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use(errorHandler);

// Start server in development, but not in production (for Vercel)
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the Express app for Vercel
export default app;
