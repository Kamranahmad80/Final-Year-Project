import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import api from "../config/axios";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  // This callback is triggered by the Hero's search bar
  const handleSearch = (searchParams) => {
    const query = new URLSearchParams(searchParams).toString();
    navigate(`/jobs?${query}`);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/api/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div>
      <Hero 
        title="Find Your Dream Job Today!" 
        subtitle="AI-powered job recommendations tailored for you."
        showSearchBar={true}
        onSearch={handleSearch}
      />
      
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Recent Jobs Available
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {jobs && jobs.length > 0 ? (
              jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))
            ) : (
              <p className="text-center">No jobs available.</p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
