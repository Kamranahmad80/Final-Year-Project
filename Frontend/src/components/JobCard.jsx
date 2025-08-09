import { FaBriefcase, FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  
  if (!job) return <div>No job data available.</div>;

  const jobId = 
    (typeof job._id === "object" && job._id.$oid)
      ? job._id.$oid
      : job?._id || '';

  const postedDate = job.postedAt
    ? new Date(job.postedAt).toLocaleDateString()
    : "Today";

  const handleCardClick = (e) => {
    e.preventDefault();
    if (jobId) {
      navigate(`/jobs/${jobId}`);
    }
  };

  const getSalary = () => {
    if (!job.salary) return "N/A";
    if (job.salaryDisplay) return job.salaryDisplay;
    return job.salary;
  };

  const getSkills = () => {
    if (!job.skills) return [];
    if (Array.isArray(job.skills)) return job.skills;
    if (typeof job.skills === "object") {
      return [...(job.skills.required || []), ...(job.skills.preferred || [])];
    }
    return [];
  };

  // Don't render if no job ID is available
  if (!jobId) {
    console.warn("Job card skipped: No valid job ID");
    return null;
  }

  return (
    <div 
      onClick={handleCardClick}
      className="w-[90%] mx-auto bg-white rounded-lg shadow-sm p-4 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-md border border-gray-100 cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick(e)}
    >
      <div className="flex justify-between items-start gap-4">
        {/* Left side */}
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <img
              src={job.companyLogo || "/company-logo.png"}
              alt={`${job.Company || "Company"} logo`}
              className="w-10 h-10 object-contain rounded-lg"
              onError={(e) => {
                e.target.src = "/company-logo.png";
                e.target.onerror = null;
              }}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 hover:text-[#309689] transition-colors duration-200">
              {job.title || "No Title"}
            </h3>
            <p className="text-gray-600 text-sm mt-0.5">
              {job.Company || "No Company"}
            </p>

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

        {/* Right side */}
        <div className="flex flex-col items-end">
          {job.matchScore !== undefined && (
            <div className="flex items-center mb-1">
              <div className="h-2 w-16 bg-gray-200 rounded-full mr-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{ width: `${Math.round(job.matchScore * 100)}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium text-gray-700">
                {Math.round(job.matchScore * 100)}% Match
              </span>
            </div>
          )}
          <span className="text-xs text-gray-500">{postedDate}</span>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          {getSkills()
            .slice(0, 3)
            .map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs"
              >
                {skill}
              </span>
            ))}
        </div>
        <span className="text-sm font-medium text-[#309689] hover:underline">
          View Details →
        </span>
      </div>
    </div>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    _id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ $oid: PropTypes.string }),
    ]),
    title: PropTypes.string,
    Company: PropTypes.string,
    companyLogo: PropTypes.string,
    Location: PropTypes.string,
    Category: PropTypes.string,
    jobType: PropTypes.string,
    salary: PropTypes.string,
    salaryDisplay: PropTypes.string,
    postedAt: PropTypes.string,
    matchScore: PropTypes.number,
    skills: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.shape({
        required: PropTypes.arrayOf(PropTypes.string),
        preferred: PropTypes.arrayOf(PropTypes.string),
      }),
    ]),
  }),
};

export default JobCard;
