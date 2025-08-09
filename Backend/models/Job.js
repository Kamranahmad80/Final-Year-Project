const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    // Core
    title: { type: String, required: true },
    description: { type: String },

    // Normalized lowercase fields
    company: { type: String },
    location: { type: String },
    category: { type: String },

    // Backward-compatible original fields (do not remove to avoid breaking existing docs/UI)
    Company: { type: String },
    Location: { type: String },
    Category: { type: String },

    jobType: { type: String },
    salary: { type: String },
    salaryDisplay: { type: String },
    skills: [String],
    postedAt: { type: Date, default: Date.now },
    companyLogo: String,

    // Applications
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Optional link to the employer account that owns this job
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // Admin status
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
