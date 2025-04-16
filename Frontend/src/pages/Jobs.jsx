import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaFilter, FaBriefcase, FaMapMarkerAlt, FaDollarSign, FaClock } from "react-icons/fa";
import Hero from "../components/Hero";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import api from "../config/axios";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const navigate = useNavigate();

  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    category: searchParams.get("category") || "",
    jobType: searchParams.get("jobType") || "",
    experience: searchParams.get("experience") || "",
    salary: searchParams.get("salary") || "",
    sortBy: searchParams.get("sortBy") || "latest"
  });

  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
  const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Manager", "Executive"];
  const salaryRanges = [
    "₹0-3 LPA",
    "₹3-6 LPA",
    "₹6-10 LPA",
    "₹10-15 LPA",
    "₹15+ LPA"
  ];

  const sortOptions = [
    { value: 'latest', label: 'Latest Jobs' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'salary_high', label: 'Salary: High to Low' },
    { value: 'salary_low', label: 'Salary: Low to High' }
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching with filters:', filters);
        const { data } = await api.get("/api/jobs", { 
          params: filters 
        });
        console.log('Fetched jobs:', data);
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError(error.response?.data?.message || "Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    console.log('Changing filter:', key, value);
    setFilters(prev => {
      const newFilters = { 
        ...prev, 
        [key]: value,
        page: 1
      };
      
      // Update URL params
      setSearchParams(new URLSearchParams(
        Object.entries(newFilters).filter(([_, v]) => v)
      ));
      
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      category: "",
      jobType: "",
      experience: "",
      salary: "",
      sortBy: "latest"
    });
    setSearchParams({});
  };

  // Allow Jobs page search bar to update query parameters
  const handleSearch = (params) => {
    setFilters(prev => ({
      ...prev,
      search: params.search || "",
      location: params.location || "",
      category: params.category || ""
    }));
  };

  // Format salary for display
  const formatSalary = (salary) => {
    if (!salary) return "Not Specified";
    return salary.salaryDisplay || `₹${salary} LPA`;
  };

  const FilterSection = ({ title, icon: Icon, options, value, onChange }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3 text-gray-700 font-medium">
        <Icon className="text-[#309689]" />
        <h3>{title}</h3>
      </div>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={title}
              value={option}
              checked={value === option}
              onChange={(e) => onChange(e.target.value)}
              className="form-radio text-[#309689] focus:ring-[#309689]"
            />
            <span className="text-sm text-gray-600">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <Hero
        title="Explore Available Jobs"
        subtitle="Find the best opportunities based on your skills."
        showSearchBar={true}
        onSearch={handleSearch}
      />

      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile Filter Toggle */}
          <button
            className="md:hidden bg-[#309689] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <FaFilter />
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Filters Sidebar */}
          <aside className={`w-full md:w-1/4 bg-white p-6 rounded-lg shadow-sm self-start transition-all duration-300 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-[#309689] hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Active Filters */}
            {Object.entries(filters).some(([key, value]) => value && key !== 'sortBy') && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, value]) => {
                    if (value && key !== 'sortBy') {
                      return (
                        <span 
                          key={key}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[#309689] text-white"
                        >
                          {value}
                          <button
                            onClick={() => handleFilterChange(key, '')}
                            className="ml-1 hover:text-white/80"
                          >
                            ×
                          </button>
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

            <FilterSection
              title="Job Type"
              icon={FaBriefcase}
              options={jobTypes}
              value={filters.jobType}
              onChange={(value) => handleFilterChange('jobType', value)}
            />

            <FilterSection
              title="Experience Level"
              icon={FaClock}
              options={experienceLevels}
              value={filters.experience}
              onChange={(value) => handleFilterChange('experience', value)}
            />

            <FilterSection
              title="Salary Range"
              icon={FaDollarSign}
              options={salaryRanges}
              value={filters.salary}
              onChange={(value) => handleFilterChange('salary', value)}
            />
          </aside>

          {/* Main Content */}
          <main className="w-full md:w-3/4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <p className="text-gray-600 text-sm mb-2 md:mb-0">
                {loading ? (
                  "Loading results..."
                ) : (
                  <>Showing <strong>{jobs.length}</strong> results</>
                )}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Sort by:</span>
                <select 
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="border border-gray-300 rounded p-1.5 focus:border-[#309689] focus:ring-1 focus:ring-[#309689] outline-none min-w-[160px]"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#309689] border-t-transparent"></div>
                  <p className="mt-2 text-gray-600">Loading jobs...</p>
                </div>
              ) : jobs.length > 0 ? (
                jobs.map((job) => (
                  <JobCard 
                    key={job._id} 
                    job={{
                      ...job,
                      salary: formatSalary(job.salary)
                    }} 
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No jobs found matching your criteria.</p>
                  <button 
                    onClick={clearFilters}
                    className="mt-4 text-[#309689] hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Jobs;
