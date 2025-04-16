import { useState, useEffect } from "react";
import api from "../config/axios";

const SearchBar = ({ onSearch }) => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/api/jobs/categories");
        setCategories(data.categories || []);
        setLoadingCategories(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch suggestions based on search input
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.trim() === "") {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      try {
        const { data } = await api.get("/api/jobs/suggestions", {
          params: { query: search },
        });
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleSearch = () => {
    const searchParams = { search, location, category };
    if (onSearch) {
      onSearch(searchParams);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion);
    setShowSuggestions(false);
    handleSearch(); // Optionally trigger search immediately
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-2 relative">
      <div className="flex flex-col md:flex-row items-center bg-white shadow-md rounded-3xl border border-gray-300 overflow-hidden">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-3 outline-none w-full"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-20 bg-white border border-gray-300 w-full mt-1 rounded shadow-md max-h-60 overflow-auto">
              {suggestions.map((sugg, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSuggestionClick(sugg)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {sugg}
                </li>
              ))}
            </ul>
          )}
        </div>

        <span className="hidden md:block border-l border-gray-300 h-8"></span>

        {/* Location Input */}
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 px-4 py-3 outline-none w-full md:w-auto"
        />

        <span className="hidden md:block border-l border-gray-300 h-8"></span>

        {/* Dynamic Categories Dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-1 px-4 py-3 outline-none bg-white cursor-pointer w-full md:w-auto"
        >
          <option value="">Select Category</option>
          {loadingCategories ? (
            <option disabled>Loading...</option>
          ) : (
            categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))
          )}
        </select>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-[#309689] text-white font-medium px-6 py-3 w-full md:w-auto hover:bg-[#267b6c] cursor-pointer transition"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
