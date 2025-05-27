import React from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaThumbsUp } from 'react-icons/fa';

const RecommendationCard = ({ job }) => {
  // Format match score as percentage
  const matchPercentage = Math.round(job.matchScore * 10);
  
  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Match score indicator */}
        <div className="bg-green-50 p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 min-w-[100px]">
          <div className={`text-2xl font-bold ${matchPercentage >= 80 ? 'text-green-600' : 
                                               matchPercentage >= 60 ? 'text-green-500' : 
                                               matchPercentage >= 40 ? 'text-yellow-500' : 'text-gray-500'}`}>
            {matchPercentage}%
          </div>
          <div className="text-xs text-gray-500 text-center">Match</div>
        </div>
        
        {/* Job details */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                <Link to={`/jobs/${job._id}`} className="hover:text-[#309689]">
                  {job.Title}
                </Link>
              </h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="flex items-center text-gray-600 text-sm">
                  <FaBuilding className="mr-1 text-gray-400" /> {job.Company}
                </span>
                <span className="flex items-center text-gray-600 text-sm">
                  <FaMapMarkerAlt className="mr-1 text-gray-400" /> {job.Location}
                </span>
              </div>
            </div>
            
            {job.companyLogo && (
              <img 
                src={job.companyLogo} 
                alt={`${job.Company} logo`} 
                className="w-12 h-12 object-contain rounded" 
              />
            )}
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
              {job.jobType}
            </span>
            <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs">
              {job.workplaceType}
            </span>
            <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs">
              {job.experience}
            </span>
          </div>
          
          <div className="mt-3 text-sm text-gray-500">
            <div className="flex items-center gap-2 mb-1">
              <FaMoneyBillWave className="text-green-500" />
              <span>{job.salaryDisplay}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-blue-500" />
              <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          {/* Why this matches section */}
          {(job.matchedSkills && job.matchedSkills.length > 0) && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1 text-sm text-gray-700 font-medium mb-1">
                <FaThumbsUp className="text-[#309689]" />
                <span>Why this matches you:</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {job.matchedSkills.map((skill, index) => (
                  <span key={index} className="bg-green-50 text-green-700 px-2 py-0.5 text-xs rounded">
                    {skill}
                  </span>
                ))}
              </div>
              {job.matchReason && (
                <p className="text-xs text-gray-600 mt-1">{job.matchReason}</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 p-3 border-t border-gray-100 flex justify-end">
        <Link 
          to={`/jobs/${job._id}`}
          className="bg-[#309689] hover:bg-[#267b70] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default RecommendationCard;
