import { useState, useEffect } from "react";
import { FiSearch, FiMapPin, FiBriefcase, FiX } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock categories (replace with API call if available)
const JOB_CATEGORIES = [
  'Software Development',
  'Design',
  'Marketing',
  'Sales',
  'Business',
  'Customer Service',
  'Data Science',
  'Engineering',
  'Healthcare',
  'Finance',
  'Education'
];

const SearchBar = ({ onSearch, initialValues = {} }) => {
  const [search, setSearch] = useState(initialValues.search || "");
  const [location, setLocation] = useState(initialValues.location || "");
  const [category, setCategory] = useState(initialValues.category || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle search submission
  const handleSearch = (e) => {
    e?.preventDefault();
    const searchParams = { 
      search: search.trim(),
      location: location.trim(),
      category: category.trim()
    };
    
    if (onSearch) {
      onSearch(searchParams);
    }
  };

  // Handle key press (Enter key)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearch("");
    setLocation("");
    setCategory("");
    if (onSearch) {
      onSearch({ search: "", location: "", category: "" });
    }
  };

  // Get job suggestions (mock implementation - replace with actual API call)
  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      // In a real app, you would call your API endpoint here
      // const { data } = await api.get("/jobs/suggestions", { params: { q: query } });
      // setSuggestions(data);
      
      // Mock suggestions based on input
      const mockSuggestions = [
        `${query} Developer`,
        `Senior ${query} Engineer`,
        `${query} Specialist`,
        `Remote ${query} Jobs`,
        `${query} Manager`
      ];
      
      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast.error("Failed to load search suggestions");
    }
  };

  // Debounce search suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(search);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [search]);

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion);
    setShowSuggestions(false);
    // Optionally trigger search immediately
    if (onSearch) {
      onSearch({ 
        search: suggestion,
        location: location.trim(),
        category: category.trim()
      });
    }
  };

  // Check if search is active
  const isSearchActive = search || location || category;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSearch} className="w-full">
        <div className="flex flex-col md:flex-row items-stretch bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Search Input */}
          <div className="relative flex-1 border-b md:border-b-0 md:border-r border-gray-200">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => search && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={handleKeyDown}
              className="pl-12 pr-4 py-4 w-full text-sm md:text-base border-0 focus:ring-0 focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
            
            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent input blur
                      handleSuggestionClick(suggestion);
                    }}
                  >
                    <div className="flex items-center">
                      <FiSearch className="mr-3 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{suggestion}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location Input */}
          <div className="relative flex-1 border-b md:border-b-0 md:border-r border-gray-200">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiMapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Location (city, state, or remote)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-12 pr-4 py-4 w-full text-sm md:text-base border-0 focus:ring-0 focus:outline-none"
            />
            {location && (
              <button
                type="button"
                onClick={() => setLocation("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiBriefcase className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="pl-12 pr-10 py-4 w-full text-sm md:text-base border-0 focus:ring-0 focus:outline-none appearance-none bg-transparent cursor-pointer"
            >
              <option value="">All Categories</option>
              {JOB_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#309689] hover:bg-[#267b6c] text-white font-medium px-6 py-4 transition-colors flex items-center justify-center min-w-[120px]"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : (
              <>
                <FiSearch className="mr-2" />
                Search
              </>
            )}
          </button>

          {/* Clear Button - Only show when search is active */}
          {isSearchActive && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute -bottom-10 right-0 text-sm text-gray-500 hover:text-gray-700 flex items-center mt-2"
            >
              <FiX className="mr-1" /> Clear all filters
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
