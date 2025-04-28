import Job from "../models/Job.js";

export const getJobCategories = async (req, res) => {
  try {
    const categories = await Job.distinct("Category"); // Fetch unique categories
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET /api/jobs - Retrieve all job postings
export const getJobs = async (req, res) => {
  try {
    const { 
      search, 
      location, 
      category, 
      jobType, 
      experience, 
      salary,
      sortBy = 'latest',
      page = 1,
      limit = 10,
      employer
    } = req.query;
    
    let query = {};

    // Search in title and description
    if (search) {
      query.$or = [
        { Title: { $regex: search, $options: "i" } },
        { job_description: { $regex: search, $options: "i" } }
      ];
    }

    // Filter by location
    if (location) {
      query.Location = { $regex: location, $options: "i" };
    }

    // Filter by category
    if (category) {
      query.Category = { $regex: category, $options: "i" };
    }

    // Filter by job type
    if (jobType) {
      query.jobType = { $regex: jobType, $options: "i" };
    }

    // Filter by experience level
    if (experience) {
      query.experience = { $regex: experience, $options: "i" };
    }

    // Filter by employer (for employer profile)
    if (employer) {
      query.employer = employer;
    }

    // Filter by salary range
    if (salary) {
      // Parse salary range (e.g., "₹0-3 LPA" -> { min: 0, max: 3 })
      const range = salary.match(/(?:₹)?(\d+)-(\d+)/); // Allow optional "₹" symbol
      if (range) {
        const [, min, max] = range;
        query.salary = {
          $gte: parseInt(min),
          $lte: parseInt(max)
        };
      } else if (salary.includes('+')) {
        // Handle "15+ LPA" case
        const minMatch = salary.match(/(?:₹)?(\d+)\+/);
        if (minMatch) {
          const min = parseInt(minMatch[1]);
          query.salary = { $gte: min };
        }
        query.salary = { $gte: min };
      }
    }

    // Determine sort order
    let sortOptions = {};
    switch (sortBy) {
      case 'latest':
        sortOptions = { postedAt: -1 };
        break;
      case 'oldest':
        sortOptions = { postedAt: 1 };
        break;
      case 'salary_high':
        sortOptions = { salary: -1 };
        break;
      case 'salary_low':
        sortOptions = { salary: 1 };
        break;
    // Log the query using a proper logging mechanism
    logger.info('Query:', query);
        sortOptions = { postedAt: -1 };
    }

    // Use a proper logging mechanism for production
    if (process.env.NODE_ENV !== 'production') {
      console.log('Sort Options:', sortOptions);
    }
    console.log('Sort Options:', sortOptions);

    // Parse pagination parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const jobs = await Job.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .exec();
      
    console.log("Jobs retrieved:", jobs.length);
    res.json(jobs);
  } catch (error) {
    console.error("Error in getJobs:", error);
    res.status(500).json({ message: error.message });
  }
};
// GET /api/jobs/:id - Retrieve a single job posting by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new job
export const createJob = async (req, res) => {
  // Extract fields from req.body
  const { title, location, category, jobType, salary, description } = req.body;
  try {
    // Use employer from the protected token (req.user)
    const job = new Job({
      Title: title,
      Company: req.user.companyName, // or set separately if needed
      Location: location,
      Category: category,
      jobType,
      salary,
      job_description: description,
      employer: req.user._id,  // NEW: attach employer ID
    });
    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job) {
      job.title = req.body.title || job.title;
      job.company = req.body.company || job.company;
      job.location = req.body.location || job.location;
      job.category = req.body.category || job.category;
      job.jobType = req.body.jobType || job.jobType;
      job.salary = req.body.salary || job.salary;
      job.description = req.body.description || job.description;
      const updatedJob = await job.save();
      res.json(updatedJob);
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job) {
      // Check if the user is authorized to delete the job
      if (job.employer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized to delete this job" });
      }
      await job.remove();
      res.json({ message: "Job removed" });
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
