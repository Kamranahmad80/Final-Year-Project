import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

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
