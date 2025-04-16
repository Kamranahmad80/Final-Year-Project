import React from "react";
import { FaRegBookmark, FaBriefcase, FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  if (!job) return <div>No job data available.</div>;

  const jobId = typeof job._id === "object" && job._id.$oid ? job._id.$oid : job._id;
  const postedDate = job.postedAt ? new Date(job.postedAt).toLocaleDateString() : "Today";

  // Function to get skills array from either data structure
  const getSkills = () => {
    if (!job.skills) return [];
    if (Array.isArray(job.skills)) return job.skills;
    if (typeof job.skills === 'object') {
      return [...(job.skills.required || []), ...(job.skills.preferred || [])];
    }
    return [];
  };

  // Function to handle bookmark click
  const handleBookmark = (e) => {
    e.preventDefault();
    // Add bookmark functionality here
    console.log('Bookmarked:', job.Title);
  };

  // Get formatted salary
  const getSalary = () => {
    if (!job.salary) return "N/A";
    if (job.salaryDisplay) return job.salaryDisplay;
    return job.salary;
  };

  return (
    <Link to={`/jobs/${jobId}`} className="block group">
      <div className="bg-white rounded-lg shadow-sm p-4 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-md border border-gray-100">
        <div className="flex justify-between items-start gap-4">
          {/* Left side: Logo and basic info */}
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <img
                src={job.companyLogo || "/company-logo.png"}
                alt={`${job.Company || 'Company'} logo`}
                className="w-10 h-10 object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = "/company-logo.png";
                  e.target.onerror = null;
                }}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#309689] transition-colors duration-200">
                {job.Title || "No Title"}
              </h3>
              <p className="text-gray-600 text-sm mt-0.5">{job.Company || "No Company"}</p>
              
              {/* Job details in a compact grid */}
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                <div className="flex items-center text-gray-500 text-sm">
                  <FaMapMarkerAlt className="mr-1.5 text-[#309689] w-3 h-3" />
                  <span className="truncate">{job.Location || "N/A"}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <FaDollarSign className="mr-1.5 text-[#309689] w-3 h-3" />
                  <span className="truncate">{getSalary()}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <FaBriefcase className="mr-1.5 text-[#309689] w-3 h-3" />
                  <span className="truncate">{job.Category || "N/A"}</span>
                </div>
                {job.jobType && (
                  <div className="flex items-center text-gray-500 text-sm">
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                      {job.jobType}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side: Date and bookmark */}
          <div className="flex flex-col items-end gap-2">
            <button 
              onClick={handleBookmark}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Bookmark job"
            >
              <FaRegBookmark className="text-gray-400 hover:text-[#309689] w-4 h-4" />
            </button>
            <span className="text-xs text-gray-500">{postedDate}</span>
          </div>
        </div>

        {/* Skills tags and view details in a footer */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          <div className="flex gap-2 flex-wrap">
            {getSkills().slice(0, 3).map((skill, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
          <span className="text-sm font-medium text-[#309689] group-hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
