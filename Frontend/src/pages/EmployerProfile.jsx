import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";

const EmployerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    location: "",
    category: "",
    jobType: "",
    salary: "",
    description: "",
    companyLogo: null
  });
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    companyName: "",
    companyDescription: "",
    website: "",
    industry: "",
    location: ""
  });
  const [postedJobs, setPostedJobs] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch employer profile data and posted jobs
  useEffect(() => {
    const fetchProfileAndJobs = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo || !userInfo.token) {
          setError("User not authenticated.");
          return;
        }
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        // Fetch user profile
        const profileResponse = await axios.get("/api/users/profile", config);
        setProfile(profileResponse.data);
        setProfileForm({
          name: profileResponse.data.name || "",
          email: profileResponse.data.email || "",
          companyName: profileResponse.data.companyName || "",
          companyDescription: profileResponse.data.companyDescription || "",
          website: profileResponse.data.website || "",
          industry: profileResponse.data.industry || "",
          location: profileResponse.data.location || ""
        });
        
        // Fetch jobs posted by this employer
        const jobsResponse = await axios.get("/api/jobs", { 
          params: { employer: profileResponse.data._id },
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setPostedJobs(jobsResponse.data);
      } catch (err) {
        setError(err.response?.data.message || err.message);
      }
    };

    fetchProfileAndJobs();
  }, []);

  // Handlers for job form changes
  const handleJobChange = (e) => {
    const { name, value } = e.target;
    setJobForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload for company logo
  const handleLogoChange = (e) => {
    setJobForm(prev => ({ ...prev, companyLogo: e.target.files[0] }));
  };

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const { data } = await axios.put("/api/users/profile", profileForm, config);
      setProfile(data);
      setIsEditingProfile(false);
      
      // Update localStorage user info with new profile data
      const updatedUserInfo = { ...userInfo, name: data.name };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      
    } catch (err) {
      console.error("Error updating profile:", err.response?.data.message || err.message);
    }
  };

  // Handle new job submission
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      
      let logoUrl = null;
      
      // Handle logo upload if present
      if (jobForm.companyLogo) {
        const formData = new FormData();
        formData.append('logo', jobForm.companyLogo);
        
        const uploadConfig = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo.token}`
          }
        };
        
        const uploadResponse = await axios.post("/api/upload/logo", formData, uploadConfig);
        logoUrl = uploadResponse.data.url;
      }
      
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      // Include the employer's company automatically
      const newJob = {
        title: jobForm.title,
        location: jobForm.location,
        category: jobForm.category,
        jobType: jobForm.jobType,
        salary: jobForm.salary,
        description: jobForm.description,
        companyLogo: logoUrl
      };
      
      const { data } = await axios.post("/api/jobs", newJob, config);
      
      // Update the posted jobs list
      setPostedJobs((prev) => [data, ...prev]);
      setJobForm({
        title: "",
        location: "",
        category: "",
        jobType: "",
        salary: "",
        description: "",
        companyLogo: null
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      setIsEditingJob(false);
    } catch (err) {
      console.error("Error posting job:", err.response?.data.message || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!profile) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto p-4 py-8">
        {/* Profile Header */}
        {!isEditingProfile ? (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-20 h-20 rounded-full bg-[#309689] flex items-center justify-center text-white text-2xl font-semibold">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
                  <p className="text-gray-600">{profile.companyName || "No Company Name Provided"}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="bg-[#309689] hover:bg-[#267b6c] text-white px-4 py-2 rounded-md transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
            
            {/* Company Details */}
            {(profile.companyDescription || profile.website || profile.industry || profile.location) && (
              <div className="mt-6 border-t border-gray-200 pt-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Company Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.companyDescription && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">About</h3>
                      <p className="text-gray-700">{profile.companyDescription}</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {profile.industry && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Industry: </span>
                        <span className="text-gray-700">{profile.industry}</span>
                      </div>
                    )}
                    
                    {profile.location && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Location: </span>
                        <span className="text-gray-700">{profile.location}</span>
                      </div>
                    )}
                    
                    {profile.website && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Website: </span>
                        <a 
                          href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#309689] hover:underline"
                        >
                          {profile.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#309689] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="w-full p-2 border rounded-md bg-gray-100" 
                    disabled
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={profileForm.companyName}
                    onChange={handleProfileChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#309689] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Industry</label>
                  <input
                    type="text"
                    name="industry"
                    value={profileForm.industry}
                    onChange={handleProfileChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#309689] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Website</label>
                  <input
                    type="text"
                    name="website"
                    value={profileForm.website}
                    onChange={handleProfileChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#309689] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={profileForm.location}
                    onChange={handleProfileChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#309689] focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-1">Company Description</label>
                  <textarea
                    name="companyDescription"
                    value={profileForm.companyDescription}
                    onChange={handleProfileChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#309689] focus:border-transparent"
                    rows="4"
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#309689] text-white rounded-md hover:bg-[#267b6c]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Job Posting Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Your Job Postings</h2>
            <button
              onClick={() => setIsEditingJob(!isEditingJob)}
              className="bg-[#309689] hover:bg-[#267b6c] text-white px-4 py-2 rounded-md transition-colors"
            >
              {isEditingJob ? "Cancel" : "Add Job"}
            </button>
          </div>
          
          {isEditingJob && (
            <form onSubmit={handleJobSubmit} className="space-y-4 mb-8 border-b border-gray-200 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Job Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={jobForm.title}
                    onChange={handleJobChange}
                    required
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#309689] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Location*</label>
                  <input
                    type="text"
                    name="location"
                    value={jobForm.location}
                    onChange={handleJobChange}
                    required
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#309689] focus:border-transparent"
                    placeholder="e.g., New Delhi, India"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Category*</label>
                  <input
                    type="text"
                    name="category"
                    value={jobForm.category}
                    onChange={handleJobChange}
                    required
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#309689] focus:border-transparent"
                    placeholder="e.g., IT, Marketing, Finance"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Job Type*</label>
                  <select
                    name="jobType"
                    value={jobForm.jobType}
                    onChange={handleJobChange}
                    required
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#309689] focus:border-transparent"
                  >
                    <option value="">Select Job Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Salary</label>
                  <input
                    type="text"
                    name="salary"
                    value={jobForm.salary}
                    onChange={handleJobChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#309689] focus:border-transparent"
                    placeholder="e.g., ₹5-8 LPA"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Company Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    ref={fileInputRef}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#309689] focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-1">Description*</label>
                  <textarea
                    name="description"
                    value={jobForm.description}
                    onChange={handleJobChange}
                    required
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#309689] focus:border-transparent"
                    rows="5"
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-[#309689] hover:bg-[#267b6c] text-white px-6 py-2 rounded-md transition-colors"
                >
                  Post Job
                </button>
              </div>
            </form>
          )}

          {/* Display Jobs Posted by Employer */}
          {postedJobs.length > 0 ? (
            <div className="space-y-4">
              {postedJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <p className="text-gray-600 mt-3">You haven't posted any jobs yet.</p>
              <button 
                onClick={() => setIsEditingJob(true)}
                className="mt-4 px-4 py-2 bg-[#309689] text-white rounded-md hover:bg-[#267b6c]"
              >
                Post Your First Job
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmployerProfile;
