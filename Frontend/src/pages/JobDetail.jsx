import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [relatedJobs, setRelatedJobs] = useState([]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`/api/jobs/${id}`);
        setJob(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data.message || err.message);
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

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
      {/* Header */}
      <Navbar/>
      {/* Hero Section */}
      <section className="bg-green-100 py-10">
        <div className="container mx-auto px-4">
          {/* Job Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            {Title || "Job Title"}
          </h1>
          {/* Salary & Location */}
          <div className="mt-2 text-gray-600 flex flex-wrap gap-4">
            {salary && <span>Salary Range: {salary}</span>}
            {Location && <span>{Location}</span>}
          </div>
          {/* Apply Button */}
          <button className="mt-4 bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700">
            Apply Now
          </button>
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

        </div>
      </main>

      {/* Related Jobs Section */}
      <section className="bg-white py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Similar Jobs</h2>
          <p className="text-gray-600 mb-8">We don't have related jobs to show right now.</p>
          {/* Job cards would go here if available */}
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default JobDetail;
