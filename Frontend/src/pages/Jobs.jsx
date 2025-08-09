import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Hero from "../components/Hero";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // Initialize filters from URL params
  const initialFilters = {
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    category: searchParams.get("category") || "",
    sortBy: searchParams.get("sortBy") || "latest",
    page: 1,
    limit: 10,
  };

  const [filters, setFilters] = useState(initialFilters);

  const fetchJobs = async (pageNum = 1, append = false) => {
    try {
      setError(null);
      if (pageNum === 1) setLoading(true);

      // Build query params from filters
      const queryParams = new URLSearchParams();
      
      // Only include non-empty filters
      if (filters.search) queryParams.set('search', filters.search);
      if (filters.location) queryParams.set('location', filters.location);
      if (filters.category) queryParams.set('category', filters.category);
      if (filters.sortBy) queryParams.set('sortBy', filters.sortBy);
      
      // Always include pagination
      queryParams.set('page', pageNum);
      queryParams.set('limit', 10);

      const res = await fetch(`http://localhost:5000/api/jobs?${queryParams.toString()}`);
      const data = await res.json();

      if (append) {
        setJobs((prev) => [...prev, ...data]);
      } else {
        setJobs(data);
      }

      setHasMore(data.length === 10);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Failed to fetch jobs.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreJobs = useCallback(() => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchJobs(nextPage, true);
  }, [hasMore, loadingMore, page]);

  const lastJobElementRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreJobs();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore, loadMoreJobs]
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set('search', filters.search);
    if (filters.location) params.set('location', filters.location);
    if (filters.category) params.set('category', filters.category);
    if (filters.sortBy !== 'latest') params.set('sortBy', filters.sortBy);
    
    // Update URL without causing a page reload
    setSearchParams(params, { replace: true });
    
    // Reset pagination and fetch jobs
    setPage(1);
    setHasMore(true);
    fetchJobs(1, false);
  }, [filters.search, filters.location, filters.category, filters.sortBy, setSearchParams]);

  const handleSearch = (params) => {
    setFilters(prev => ({
      ...prev,
      search: params.search || "",
      location: params.location || "",
      category: params.category || "",
      page: 1, // Reset to first page on new search
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      category: "",
      sortBy: "latest",
      page: 1,
      limit: 10,
    });
    setSearchParams({}, { replace: true }); // Clear URL params
  };

  return (
    <div>
      <Hero
        title="Explore Available Jobs"
        subtitle="Find the best opportunities based on your skills."
        showSearchBar
        onSearch={handleSearch}
      />

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Sidebar */}
            <aside className="w-full md:w-80 lg:w-96 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">All Filters</h2>
                  <button 
                    onClick={clearFilters}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Reset All
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Location Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Location
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => handleFilterChange("location", e.target.value)}
                      placeholder="City or postcode"
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Job Category
                  </h3>
                  <div className="relative">
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange("category", e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 appearance-none text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all bg-white"
                    >
                      <option value="">All Categories</option>
                      <option value="Software Development">Software Development</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="Business">Business</option>
                      <option value="Customer Service">Customer Service</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Sort By Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                    Sort By
                  </h3>
                  <div className="space-y-2">
                    {[
                      { value: 'latest', label: 'Most Recent' },
                      { value: 'oldest', label: 'Oldest' },
                      { value: 'salary_high', label: 'Salary High to Low' },
                      { value: 'salary_low', label: 'Salary Low to High' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="sortBy"
                          value={option.value}
                          checked={filters.sortBy === option.value}
                          onChange={() => handleFilterChange("sortBy", option.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={clearFilters}
                  className="w-full py-2.5 px-4 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </aside>

            {/* Main Jobs Area */}
            <main className="w-full md:w-3/4">
              {loading && <p className="text-center text-gray-500">Loading jobs...</p>}
              {error && <p className="text-center text-red-500">{error}</p>}
              {!loading && jobs.length === 0 && (
                <p className="text-center text-gray-500">No jobs found.</p>
              )}

              <div className="space-y-6">
                {jobs.map((job, index) => {
                  const isLast = index === jobs.length - 1;
                  return (
                    <div ref={isLast ? lastJobElementRef : null} key={job._id}>
                      <JobCard job={job} />
                    </div>
                  );
                })}
              </div>

              {loadingMore && (
                <p className="text-center mt-6 text-gray-500">Loading more jobs...</p>
              )}
            </main>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Jobs;
