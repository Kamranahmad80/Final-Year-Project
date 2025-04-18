import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../config/axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to check if the job is applied by the user
  const checkAppliedStatus = async () => {
    try {
      // Try the optimized endpoint first
      const { data } = await api.get(`/api/users/jobs/applied/${id}/check`);
      setIsApplied(data.isApplied);
    } catch (err) {
      // Fall back to the original approach
      try {
        const appliedResponse = await api.get('/api/users/jobs/applied');
        setIsApplied(appliedResponse.data.some(job => job._id === id));
      } catch (fallbackErr) {
        // Silently fail and assume not applied
      }
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    if (token) {
      setIsAuthenticated(true);
      setUserRole(userInfo.role || "");
    }

    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/api/jobs/${id}`);
        setJob(data);
        setLoading(false);

        // If user is authenticated, check job status
        if (token && userInfo.role === "employee") {
          checkAppliedStatus();
        }
      } catch (err) {
        setError(err.response?.data.message || err.message);
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApplyJob = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to apply for this job");
      navigate("/login");
      return;
    }

    if (userRole !== "employee") {
      toast.error("Only employees can apply for jobs");
      return;
    }

    setIsSubmitting(true); // Start loading state
    toast.info("Submitting your application...");

    try {
      // Use a longer timeout for this specific request
      const response = await api.post('/api/users/jobs/apply', 
        { jobId: id }, 
        { timeout: 30000 } // Increase timeout to 30 seconds
      );
      
      setIsApplied(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        toast.error("Server is taking too long to respond. Please try again later.");
      } else {
        toast.error(error.response?.data?.message || "Failed to apply for the job");
      }
    } finally {
      setIsSubmitting(false); // End loading state
    }
  };

  if (loading) {
    return <p className="text-center mt-8">Loading...</p>;
  }
  if (error) {
    return <p className="text-center mt-8 text-red-500">Error: {error}</p>;
  }
  if (!job) {
    return <p className="text-center mt-8">No job found</p>;
  }

  // Destructure your job fields for convenience
  const {
    Title,
    Company,
    Location,
    salary,
    Category,
    job_description,
  } = job;

  // Helper function to render job description based on its type
  const renderJobDescription = () => {
    if (!job_description) return <p>No description provided.</p>;
    
    // If job_description is a string, render it directly
    if (typeof job_description === 'string') {
      return <p className="text-gray-600 leading-relaxed">{job_description}</p>;
    }
    
    // If job_description is an object with specific sections
    if (typeof job_description === 'object') {
      return (
        <div className="space-y-6">
          {job_description.overview && (
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Overview</h3>
              <p className="text-gray-600">{job_description.overview}</p>
            </div>
          )}
          
          {job_description.responsibilities && (
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Responsibilities</h3>
              {typeof job_description.responsibilities === 'string' ? (
                <p className="text-gray-600">{job_description.responsibilities}</p>
              ) : (
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  {Array.isArray(job_description.responsibilities) && 
                   job_description.responsibilities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          
          {job_description.requirements && (
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Requirements</h3>
              {typeof job_description.requirements === 'string' ? (
                <p className="text-gray-600">{job_description.requirements}</p>
              ) : (
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  {Array.isArray(job_description.requirements) && 
                   job_description.requirements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      );
    }
    
    // Fallback for unexpected data types
    return <p className="text-gray-600">Description format not supported.</p>;
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Header */}
      <Navbar/>
      {/* Hero Section */}
      <section className="bg-green-100 py-10">
        <div className="container mx-auto px-4">
          {/* Job Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            {Title || "Job Title"}
          </h1>
          {/* Company & Location */}
          <div className="mt-2 text-gray-600 flex flex-wrap gap-4">
            {Company && <span className="font-medium">{Company}</span>}
            {Location && <span>{Location}</span>}
          </div>
          {/* Salary */}
          <div className="mt-2">
            {salary && <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">{salary}</span>}
          </div>
          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-3">
            <button 
              onClick={handleApplyJob}
              disabled={isApplied || isSubmitting}
              className={`bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition duration-200 ${(isApplied || isSubmitting) ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isApplied ? "Applied ✓" : isSubmitting ? "Submitting..." : "Apply Now"}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-10">
          {/* Left Column: Job Info */}
          <div className="lg:col-span-3 space-y-8">
            {/* Job Description */}
            <section className="bg-white rounded shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Job Description
              </h2>
              <div className="text-gray-600 leading-relaxed">
                {renderJobDescription()}
              </div>
            </section>

            {/* Category as Tags */}
            <section className="bg-white rounded shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Tags / Category
              </h2>
              <div className="flex flex-wrap gap-2">
                {Category ? (
                  <span className="inline-block bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-sm">
                    {Category}
                  </span>
                ) : (
                  <span className="text-gray-500">No category specified.</span>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Application Hints */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded shadow p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">How to Apply</h3>
              <p className="text-gray-600 mb-4">
                Click the "Apply Now" button to submit your application for this position.
              </p>
              {isAuthenticated ? (
                isApplied ? (
                  <div className="text-green-600 font-medium">
                    You have already applied for this job.
                  </div>
                ) : (
                  <button 
                    onClick={handleApplyJob}
                    disabled={isSubmitting}
                    className={`w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? "Submitting..." : "Apply Now"}
                  </button>
                )
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">
                    You need to be logged in to apply for this job.
                  </p>
                  <button 
                    onClick={() => navigate("/login")}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                  >
                    Login to Apply
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobDetail;
