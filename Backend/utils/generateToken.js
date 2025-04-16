import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// Load environment variables from .env file
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set.");
}

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default generateToken;
