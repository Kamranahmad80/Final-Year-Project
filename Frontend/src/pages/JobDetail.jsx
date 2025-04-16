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
              <p className="text-gray-600 leading-relaxed">
                {job_description || "No description provided."}
              </p>
            </section>

            {/* Optional: Additional Sections */}
            {/* If you want Key Responsibilities or Skills, place them here */}
            {/* 
            <section className="bg-white rounded shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Key Responsibilities
              </h2>
              <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2">
                <li>...</li>
                <li>...</li>
              </ul>
            </section>
            */}

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

      {/* Related Jobs (Static Example) */}
      <section className="bg-white py-10">
        <JobCard/>      

      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default JobDetail;
