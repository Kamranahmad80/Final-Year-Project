import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Company: { type: String, required: true },
  Location: { type: String, required: true },
  Category: { type: String, required: true },
  jobType: { 
    type: String, 
    required: true,
    enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"]
  },
  workplaceType: {
    type: String,
    required: true,
    enum: ["On-site", "Hybrid", "Remote"]
  },
  experience: {
    type: String,
    required: true,
    enum: ["Entry Level", "Mid Level", "Senior Level", "Manager", "Executive"]
  },
  experienceYears: {
    min: { type: Number, required: true }, // Minimum years of experience
    max: { type: Number, required: true }  // Maximum years of experience
  },
  salary: { 
    type: Number,  // Store salary in LPA as a number
    required: true
  },
  salaryDisplay: { 
    type: String,  // Store the formatted salary string (e.g., "₹10-15 LPA")
    required: true
  },
  benefits: [{
    type: String,
    enum: [
      "Health Insurance",
      "Life Insurance",
      "Dental Insurance",
      "Vision Insurance",
      "401(k)/Retirement",
      "Paid Time Off",
      "Flexible Hours",
      "Work From Home",
      "Professional Development",
      "Performance Bonus",
      "Stock Options",
      "Gym Membership",
      "Mental Health Benefits",
      "Parental Leave",
      "Education Reimbursement"
    ]
  }],
  skills: {
    required: [{ type: String }],  // Must-have skills
    preferred: [{ type: String }]  // Nice-to-have skills
  },
  qualifications: {
    education: {
      type: String,
      enum: ["High School", "Bachelor's", "Master's", "Ph.D.", "Other"],
      required: true
    },
    additionalCertifications: [{ type: String }]  // Required certifications
  },
  job_description: {
    overview: { type: String, required: true },
    responsibilities: [{ type: String }],  // Key responsibilities
    requirements: [{ type: String }]       // Key requirements
  },
  applicationDeadline: { type: Date },
  numberOfOpenings: { type: Number, default: 1 },
  applicationProcess: {
    type: String,
    enum: ["Direct", "External"],
    default: "Direct"
  },
  applicationUrl: { type: String },  // For external applications
  company: {
    description: { type: String },   // About the company
    website: { type: String },
    industry: { type: String },
    companySize: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]
    },
    fundingStage: {
      type: String,
      enum: ["Bootstrapped", "Seed", "Series A", "Series B+", "Public", "Not Specified"]
    }
  },
  postedAt: { type: Date, default: Date.now },
  employer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  companyLogo: { type: String },
  status: {
    type: String,
    enum: ["Active", "Filled", "Expired", "Draft"],
    default: "Active"
  },
  tags: [{ type: String }],  // Additional tags for better searchability
  applicationStatistics: {
    views: { type: Number, default: 0 },
    applications: { type: Number, default: 0 },
    lastViewedAt: { type: Date }
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt fields
});

// Add text index for better search functionality
jobSchema.index({
  Title: 'text',
  'job_description.overview': 'text',
  'job_description.responsibilities': 'text',
  'job_description.requirements': 'text',
  Company: 'text',
  Location: 'text',
  Category: 'text',
  tags: 'text'
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
