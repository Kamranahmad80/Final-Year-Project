import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";

const EmployerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    location: "",
    category: "",
    jobType: "",
    salary: "",
    description: "",
  });
  const [postedJobs, setPostedJobs] = useState([]);
  const navigate = useNavigate();

  // Fetch employer profile data and posted jobs
  useEffect(() => {
    const fetchProfileAndJobs = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo || !userInfo.token) {
          setError("User not authenticated.");
          return;
        }
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        // Fetch user profile
        const profileResponse = await axios.get("/api/users/profile", config);
        setProfile(profileResponse.data);
        // Fetch jobs posted by this employer
        const jobsResponse = await axios.get("/api/jobs", { 
          params: { employer: profileResponse.data._id } 
        });
        setPostedJobs(jobsResponse.data);
      } catch (err) {
        setError(err.response?.data.message || err.message);
      }
    };

    fetchProfileAndJobs();
  }, []);

  // Handlers for job form changes
  const handleJobChange = (e) => {
    const { name, value } = e.target;
    setJobForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle new job submission
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      // Include the employer's company automatically if needed
      const newJob = {
        title: jobForm.title,
        location: jobForm.location,
        category: jobForm.category,
        jobType: jobForm.jobType,
        salary: jobForm.salary,
        description: jobForm.description,
      };
      const { data } = await axios.post("/api/jobs", newJob, config);
      // Update the posted jobs list
      setPostedJobs((prev) => [data, ...prev]);
      setJobForm({
        title: "",
        location: "",
        category: "",
        jobType: "",
        salary: "",
        description: "",
      });
      setIsEditingJob(false);
    } catch (err) {
      console.error("Error posting job:", err.response?.data.message || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!profile) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto p-4">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-gray-600">{profile.companyName || "No Company Name Provided"}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Job Posting Section */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Your Job Postings</h2>
          <button
            onClick={() => setIsEditingJob(!isEditingJob)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mb-4"
          >
            {isEditingJob ? "Cancel" : "Add Job"}
          </button>
          {isEditingJob && (
            <form onSubmit={handleJobSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={jobForm.title}
                  onChange={handleJobChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={jobForm.location}
                  onChange={handleJobChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Category</label>
                <input
                  type="text"
                  name="category"
                  value={jobForm.category}
                  onChange={handleJobChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Job Type</label>
                <input
                  type="text"
                  name="jobType"
                  value={jobForm.jobType}
                  onChange={handleJobChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Salary</label>
                <input
                  type="text"
                  name="salary"
                  value={jobForm.salary}
                  onChange={handleJobChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={jobForm.description}
                  onChange={handleJobChange}
                  required
                  className="w-full p-2 border rounded-md"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Post Job
              </button>
            </form>
          )}

          {/* Display Jobs Posted by Employer */}
          {postedJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {postedJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No job postings yet.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmployerProfile;
