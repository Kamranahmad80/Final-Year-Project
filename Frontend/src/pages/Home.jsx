import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
      
      {/* AI Recommendations Promo Section */}
      <section className="py-12 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:shrink-0 bg-[#309689] text-white p-6 flex items-center justify-center">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className="text-xl font-bold mt-2">AI-Powered</h3>
                </div>
              </div>
              <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-[#309689] font-semibold">New Feature</div>
                <h2 className="mt-1 text-2xl font-bold text-gray-800">Personalized Job Recommendations</h2>
                <p className="mt-2 text-gray-600">
                  Our AI analyzes your resume and experience to find the perfect job matches for you. Upload your resume and get personalized recommendations tailored to your skills and experience.
                </p>
                <div className="mt-4">
                  <Link 
                    to="/recommendations" 
                    className="inline-block bg-[#309689] hover:bg-[#267b70] text-white px-6 py-2 rounded-md font-medium transition-colors"
                  >
                    Get Recommendations
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Recent Jobs Section */}
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
