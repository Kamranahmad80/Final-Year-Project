const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Authentication Middleware
const auth = async (req, res, next) => {
  try {
    // Get token from header: support both x-auth-token and Authorization: Bearer <token>
    let token = req.header('x-auth-token');
    const authHeader = req.header('authorization') || req.header('Authorization');
    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    console.log('Auth Middleware - Received token (masked):', token ? `${token.slice(0, 10)}...` : 'none');

    // Check if no token
    if (!token) {
      console.log('Auth Middleware - No token provided');
      return res.status(401).json({ 
        success: false,
        message: 'No authentication token provided',
        error: 'NO_TOKEN'
      });
    }

    // Verify token
    try {
      console.log('Auth Middleware - Verifying token...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'onjob2025');
      console.log('Auth Middleware - Decoded token:', JSON.stringify(decoded, null, 2));

      // Extract user id from the token payload
      const userId = decoded.id || decoded._id;
      console.log('Auth Middleware - Extracted userId:', userId);

      // If no userId found, token structure is invalid
      if (!userId) {
        console.log('Auth Middleware - No userId found in token');
        return res.status(401).json({ 
          success: false,
          message: 'Invalid token structure',
          error: 'INVALID_TOKEN_STRUCTURE'
        });
      }

      // Fetch user from DB
      console.log('Auth Middleware - Fetching user from DB...');
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        console.log('Auth Middleware - User not found in database');
        return res.status(401).json({ 
          success: false,
          message: 'User not found',
          error: 'USER_NOT_FOUND'
        });
      }

      console.log('Auth Middleware - User authenticated successfully:', user.email);
      req.user = user;
      next();
    } catch (err) {
      console.error('Auth Middleware - Token verification error:', err);
      
      let errorMessage = 'Invalid token';
      let errorType = 'INVALID_TOKEN';
      
      if (err.name === 'TokenExpiredError') {
        errorMessage = 'Token has expired';
        errorType = 'TOKEN_EXPIRED';
      } else if (err.name === 'JsonWebTokenError') {
        errorMessage = 'Invalid token';
        errorType = 'INVALID_TOKEN';
      }
      
      return res.status(401).json({
        success: false,
        message: errorMessage,
        error: errorType,
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// ✅ Register Route
router.post('/register', async (req, res) => {
  try {
    // Handle both JSON and form-data
    let { name, email, password, role } = req.body;
    
    // If content-type is multipart/form-data, the body might be a string that needs parsing
    if (req.is('multipart/form-data') && typeof name === 'string') {
      try {
        // Try to parse string fields if they're stringified
        const parsedBody = {};
        Object.keys(req.body).forEach(key => {
          try {
            parsedBody[key] = JSON.parse(req.body[key]);
          } catch (e) {
            parsedBody[key] = req.body[key];
          }
        });
        ({ name, email, password, role } = parsedBody);
      } catch (e) {
        console.error('Error parsing form data:', e);
      }
    }

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate role
    if (!['employee', 'employer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be either "employee" or "employer"' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(), // Ensure email is lowercase
      password: hashedPassword,
      role: role.toLowerCase()
    });

    await user.save();
    
    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    res.status(201).json({ 
      message: 'User registered successfully ✅',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    // Handle specific Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ✅ Login Route
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', {
      body: req.body,
      headers: req.headers
    });
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    console.log('Login attempt for email:', email);

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }
    
    console.log('User found:', {
      id: user._id,
      email: user.email,
      hasPassword: !!user.password
    });

    // Check password
    console.log('Checking password for user:', user._id);
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Invalid password for user:', user._id);
        return res.status(401).json({ 
          success: false,
          message: 'Invalid email or password' 
        });
      }
    } catch (err) {
      console.error('Error comparing passwords:', err);
      return res.status(500).json({
        success: false,
        message: 'Error during authentication',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }

    // Create JWT token with consistent structure
    console.log('Creating JWT token for user:', user._id);
    const payload = { 
      id: user._id,
      role: user.role
    };
    
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'onjob2025',
      { expiresIn: '2d' }
    );

    console.log('JWT token created successfully');
    
    // Set the token in the response header
    res.setHeader('x-auth-token', token);
    
    // Create user object without sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    
    // Ensure resume is properly formatted
    if (typeof userResponse.resume === 'string') {
      userResponse.resume = {
        path: userResponse.resume,
        uploadDate: new Date()
      };
    }
    
    // Send consistent response format
    res.status(200).json({
      success: true,
      message: 'Login successful ✅',
      token: token,
      user: userResponse
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin middleware
const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: 'Authentication required',
      error: 'UNAUTHORIZED'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Admin access required',
      error: 'FORBIDDEN'
    });
  }
  
  next();
};

module.exports = {
  router,
  auth,
  admin
};
