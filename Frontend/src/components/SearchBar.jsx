import { useState } from "react";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  return (
    <div className="w-full max-w-3xl mx-auto p-2">
      {/* Search Bar Container */}
      <div className="flex flex-col md:flex-row items-center bg-white shadow-md rounded-3xl border border-gray-300 overflow-hidden">
        
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-3 outline-none w-full md:w-auto"
        />

        {/* Vertical Divider for Large Screens */}
        <span className="hidden md:block border-l border-gray-300 h-8"></span>

        {/* Location Input */}
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 px-4 py-3 outline-none w-full md:w-auto"
        />

        {/* Vertical Divider for Large Screens */}
        <span className="hidden md:block border-l border-gray-300 h-8"></span>

        {/* Category Dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-1 px-4 py-3 outline-none bg-white cursor-pointer w-full md:w-auto"
        >
          <option value="">Categories</option>
          <option value="tech">Technology</option>
          <option value="health">Healthcare</option>
          <option value="finance">Finance</option>
          <option value="education">Education</option>
        </select>

        {/* Search Button */}
        <button className="bg-[#309689] text-white font-medium px-6 py-3 w-full md:w-auto hover:bg-[#267b6c] cursor-pointer transition">
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
