const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Common fields
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['employee', 'employer'], 
    required: true 
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  date: {
    type: Date,
    default: Date.now
  },

  // Employee-specific fields
  skills: [{
    type: String
  }],
  resume: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
    set: function(resume) {
      // If it's already an object, return as is
      if (typeof resume === 'object' && resume !== null) {
        return resume;
      }
      // If it's a string path, convert to object with path
      if (typeof resume === 'string') {
        return {
          path: resume,
          uploadDate: new Date()
        };
      }
      return resume;
    }
  },
  experience: [{
    title: String,
    company: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    description: String
  }],
  education: [{
    school: String,
    degree: String,
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date,
    grade: String,
    description: String
  }],

  // Employer-specific fields
  companyDetails: {
    companyName: String,
    website: String,
    industry: String,
    companySize: String,
    foundedYear: Number,
    about: String,
    logo: String,
    coverPhoto: String
  },
  jobPostings: [{
    title: String,
    type: String,
    location: String,
    salary: String,
    description: String,
    requirements: [String],
    responsibilities: [String],
    postedDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Closed'],
      default: 'Active'
    }
  }],
  teamMembers: [{
    name: String,
    position: String,
    email: String,
    phone: String
  }]
});

// Create a model from the schema
const User = mongoose.model('User', UserSchema);

module.exports = User;
