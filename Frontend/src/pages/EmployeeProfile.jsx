import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../config/axios";

// Simple Modal Component for Resume Preview
const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white p-4 rounded-lg relative max-w-2xl w-full max-h-[90vh] overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const EmployeeProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }
      try {
        const { data } = await api.get("/api/users/profile");
        if (!Array.isArray(data.experiences)) {
          data.experiences = [];
        }
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError(err.message || "Failed to fetch user data");
      }
    };
    fetchUserData();
  }, []);

  // Fetch saved and applied jobs when the jobs tab is active
  useEffect(() => {
    if (activeTab === "saved" || activeTab === "applied") {
      fetchJobs();
    }
  }, [activeTab]);

  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      if (activeTab === "saved") {
        const { data } = await api.get("/api/users/jobs/saved");
        setSavedJobs(data);
      } else if (activeTab === "applied") {
        const { data } = await api.get("/api/users/jobs/applied");
        setAppliedJobs(data);
      }
    } catch (error) {
      console.error(`Failed to fetch ${activeTab} jobs:`, error);
    } finally {
      setLoadingJobs(false);
    }
  };

  if (error) return <div className="px-4 py-8 text-center text-red-500">{error}</div>;
  if (!user) return <div className="px-4 py-8 text-center">Loading user data...</div>;

  // Helper: Convert file to base64 string
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Handle profile picture upload
  const handlePhotoClick = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64Image = await toBase64(file);
        setUser((prevUser) => ({ ...prevUser, photo: base64Image }));
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    }
  };

  // Handle resume upload
  const handleResumeUpload = () => {
    resumeInputRef.current && resumeInputRef.current.click();
  };

  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64Resume = await toBase64(file);
        setUser((prevUser) => ({ ...prevUser, resume: base64Resume }));
      } catch (error) {
        console.error("Error converting resume to base64:", error);
      }
    }
  };

  // Toggle edit mode
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Logout function: clear localStorage and navigate to login page
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  // Handle text field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  // Experience handlers
  const handleAddExperience = () => {
    setUser((prevUser) => ({
      ...prevUser,
      experiences: [...(prevUser.experiences || []), { title: "", company: "", description: "", startDate: "", endDate: "", location: "" }],
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    setUser((prevUser) => {
      const updatedExperiences = [...(prevUser.experiences || [])];
      updatedExperiences[index] = { ...updatedExperiences[index], [field]: value };
      return { ...prevUser, experiences: updatedExperiences };
    });
  };

  const handleRemoveExperience = (index) => {
    setUser((prevUser) => {
      const updatedExperiences = [...(prevUser.experiences || [])];
      updatedExperiences.splice(index, 1);
      return { ...prevUser, experiences: updatedExperiences };
    });
  };

  // Save profile changes to backend
  const handleSave = async () => {
    try {
      const { data: updatedUser } = await api.put("/api/users/profile", user);
      if (!Array.isArray(updatedUser.experiences)) updatedUser.experiences = [];
      setUser(updatedUser);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save user data:", error);
    }
  };

  // Delete profile
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      try {
        await api.delete("/api/users/profile");
        alert("Profile deleted successfully.");
        navigate("/login");
      } catch (error) {
        console.error("Failed to delete user profile:", error);
      }
    }
  };

  // Handle removing a saved job
  const handleRemoveSavedJob = async (jobId) => {
    try {
      await api.delete(`/api/users/jobs/save/${jobId}`);
      setSavedJobs(savedJobs.filter(job => job._id !== jobId));
    } catch (error) {
      console.error("Failed to remove saved job:", error);
    }
  };

  // Tab name to display name mapping
  const tabLabels = {
    personal: "Personal Info",
    experience: "Work Experience",
    skills: "Skills & Qualifications",
    resume: "Resume",
    saved: "Saved Jobs",
    applied: "Applied Jobs"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-5 sm:py-8">
        {/* Header: Welcome with Nick Name and Action Buttons */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 md:mb-6 gap-3 md:gap-4">
        <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Welcome, {user.nick_name || user.name || "Employee"}
          </h1>
            <p className="text-gray-500 text-sm sm:text-base">Manage your professional profile</p>
        </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {isEditing ? (
              <button onClick={handleSave} className="bg-[#309689] hover:bg-[#267b6c] text-white font-medium px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-md">
                Save Changes
              </button>
            ) : (
              <button onClick={handleEditClick} className="bg-[#309689] hover:bg-[#267b6c] text-white font-medium px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-md">
                Edit Profile
              </button>
            )}
          <button
            onClick={handleLogout}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-md"
          >
            Logout
          </button>
          {isEditing && (
            <button
              onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-md"
            >
              Delete Profile
            </button>
          )}
        </div>
      </header>

        {/* Profile Card with Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Profile Header with Picture */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-[#309689]/10 to-[#309689]/5 border-b">
            <div className="flex items-center">
              <div className="relative w-16 sm:w-20 h-16 sm:h-20 mr-3 sm:mr-4">
            <img
              src={user.photo || "https://via.placeholder.com/100?text=Profile"}
              alt="Profile"
                  className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded-full cursor-pointer border-2 border-[#309689]"
              onClick={handlePhotoClick}
            />
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs">Change</span>
                  </div>
                )}
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handlePhotoChange} />
          </div>
          <div className="flex flex-col justify-center">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{user.name || "Employee Name"}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          </div>
        </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto scrollbar-hide">
              {Object.entries(tabLabels).map(([tab, label]) => (
            <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm whitespace-nowrap ${
                    activeTab === tab
                      ? "border-b-2 border-[#309689] text-[#309689]"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {label}
            </button>
              ))}
            </nav>
        </div>

          {/* Tab Content Sections */}
          <div className="p-4 sm:p-6">
            {/* Personal Information */}
            {activeTab === "personal" && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
                    <label className="block text-gray-600 text-xs sm:text-sm mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={user.name || ""}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter Full Name"
                      className={`w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm ${
                !isEditing ? "bg-gray-100 text-gray-500" : ""
              }`}
            />
          </div>
          <div>
                    <label className="block text-gray-600 text-xs sm:text-sm mb-1">Nick Name</label>
            <input
              type="text"
              name="nick_name"
              value={user.nick_name || ""}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter Nick Name"
                      className={`w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm ${
                !isEditing ? "bg-gray-100 text-gray-500" : ""
              }`}
            />
          </div>
          <div>
                    <label className="block text-gray-600 text-xs sm:text-sm mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={user.country || ""}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter Country"
                      className={`w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm ${
                !isEditing ? "bg-gray-100 text-gray-500" : ""
              }`}
            />
          </div>
          <div>
                    <label className="block text-gray-600 text-xs sm:text-sm mb-1">Language</label>
            <input
              type="text"
              name="language"
              value={user.language || ""}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter Language"
                      className={`w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm ${
                !isEditing ? "bg-gray-100 text-gray-500" : ""
              }`}
            />
          </div>
        </div>
              </div>
            )}

            {/* Work Experience */}
            {activeTab === "experience" && (
              <div>
          <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Work Experience</h3>
            {isEditing && (
              <button
                onClick={handleAddExperience}
                      className="text-[#309689] hover:text-[#267b6c] flex items-center text-sm"
              >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Experience
              </button>
            )}
          </div>
                
                {user.experiences && user.experiences.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {user.experiences.map((exp, index) => (
                      <div key={index} className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                            <label className="block text-gray-600 text-xs sm:text-sm mb-1">Job Title</label>
                    <input
                      type="text"
                      value={exp.title || ""}
                      onChange={(e) => handleExperienceChange(index, "title", e.target.value)}
                      disabled={!isEditing}
                              className={`w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm ${
                        !isEditing ? "bg-gray-100 text-gray-500" : ""
                      }`}
                    />
                  </div>
                  <div>
                            <label className="block text-gray-600 text-xs sm:text-sm mb-1">Company</label>
                    <input
                      type="text"
                      value={exp.company || ""}
                      onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                      disabled={!isEditing}
                              className={`w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm ${
                        !isEditing ? "bg-gray-100 text-gray-500" : ""
                      }`}
                    />
                  </div>
                  <div>
                            <label className="block text-gray-600 text-xs sm:text-sm mb-1">Start Date</label>
                    <input
                      type="date"
                      value={exp.startDate || ""}
                      onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                      disabled={!isEditing}
                              className={`w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm ${
                        !isEditing ? "bg-gray-100 text-gray-500" : ""
                      }`}
                    />
                  </div>
                  <div>
                            <label className="block text-gray-600 text-xs sm:text-sm mb-1">End Date</label>
                    <input
                      type="date"
                      value={exp.endDate || ""}
                      onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                      disabled={!isEditing}
                              className={`w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm ${
                        !isEditing ? "bg-gray-100 text-gray-500" : ""
                      }`}
                    />
                  </div>
                  <div className="md:col-span-2">
                            <label className="block text-gray-600 text-xs sm:text-sm mb-1">Description</label>
                    <textarea
                      value={exp.description || ""}
                      onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                      disabled={!isEditing}
                      rows="3"
                              className={`w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm ${
                        !isEditing ? "bg-gray-100 text-gray-500" : ""
                      }`}
                    />
                  </div>
                </div>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveExperience(index)}
                            className="mt-2 text-red-500 hover:text-red-600 text-xs sm:text-sm flex items-center"
                  >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                    Remove Experience
                  </button>
                )}
              </div>
            ))}
          </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    <p>No work experience added yet.</p>
                    {isEditing && (
                      <button
                        onClick={handleAddExperience}
                        className="mt-2 text-[#309689] hover:text-[#267b6c] font-medium text-sm"
                      >
                        Add your first experience
                      </button>
                    )}
                  </div>
                )}
        </div>
            )}

        {/* Skills Section */}
            {activeTab === "skills" && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Skills & Qualifications</h3>
                <div className="space-y-3 sm:space-y-4">
            <div>
                    <label className="block text-gray-600 text-xs sm:text-sm mb-1">Technical Skills</label>
              <input
                type="text"
                name="technicalSkills"
                value={user.technicalSkills || ""}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g., JavaScript, React, Node.js (comma separated)"
                      className={`w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm ${
                  !isEditing ? "bg-gray-100 text-gray-500" : ""
                }`}
              />
            </div>
            <div>
                    <label className="block text-gray-600 text-xs sm:text-sm mb-1">Soft Skills</label>
              <input
                type="text"
                name="softSkills"
                value={user.softSkills || ""}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g., Communication, Leadership, Teamwork (comma separated)"
                      className={`w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm ${
                  !isEditing ? "bg-gray-100 text-gray-500" : ""
                }`}
              />
            </div>
            <div>
                    <label className="block text-gray-600 text-xs sm:text-sm mb-1">Languages</label>
              <input
                type="text"
                name="languages"
                value={user.languages || ""}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g., English (Fluent), Spanish (Intermediate)"
                      className={`w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm ${
                  !isEditing ? "bg-gray-100 text-gray-500" : ""
                }`}
              />
            </div>
          </div>
        </div>
            )}

            {/* Resume Section */}
            {activeTab === "resume" && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Resume</h3>
                <div className="p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-center">
                    <div className="mb-4">
                      {user.resume ? (
                        <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 text-[#309689]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="mt-2 text-gray-700 text-sm">Resume uploaded successfully</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="mt-2 text-gray-500 text-sm">No resume uploaded yet</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                      <button
                        onClick={handleResumeUpload}
                        disabled={!isEditing}
                        className={`bg-[#309689] hover:bg-[#267b6c] text-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-md ${
                          !isEditing ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {user.resume ? "Update Resume" : "Upload Resume"}
                      </button>
                      <input type="file" accept=".pdf,.doc,.docx" ref={resumeInputRef} style={{ display: "none" }} onChange={handleResumeChange} />
                      {user.resume && (
                        <button 
                          onClick={() => setShowResumeModal(true)} 
                          className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-[#309689] text-[#309689] rounded-md hover:bg-[#309689]/10"
                        >
                          View Resume
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Jobs */}
            {activeTab === "saved" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Saved Jobs</h3>
                {loadingJobs ? (
                  <div className="text-center py-8">Loading saved jobs...</div>
                ) : savedJobs.length > 0 ? (
                  <div className="space-y-4">
                    {savedJobs.map((job) => (
                      <div key={job._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-4 flex flex-col sm:flex-row justify-between">
                          <div className="flex-grow">
                            <Link to={`/jobs/${job._id}`} className="text-lg font-medium text-blue-700 hover:text-blue-800">
                              {job.Title}
                            </Link>
                            <div className="mt-1 text-sm text-gray-600">
                              {job.Company && <span className="block">{job.Company}</span>}
                              {job.Location && <span className="block">{job.Location}</span>}
                              {job.salary && <span className="block">Salary: {job.salary}</span>}
                            </div>
                            <div className="mt-2">
                              {job.Category && (
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                                  {job.Category}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-3 sm:mt-0">
                            <Link to={`/jobs/${job._id}`} className="px-3 py-1 bg-[#309689] text-white rounded text-sm">
                              View
                            </Link>
                            <button 
                              onClick={() => handleRemoveSavedJob(job._id)} 
                              className="px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded text-sm hover:bg-gray-200"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>You haven't saved any jobs yet.</p>
                    <Link to="/jobs" className="mt-2 inline-block text-[#309689] hover:text-[#267b6c]">
                      Browse Jobs
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Applied Jobs */}
            {activeTab === "applied" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Applied Jobs</h3>
                {loadingJobs ? (
                  <div className="text-center py-8">Loading applied jobs...</div>
                ) : appliedJobs.length > 0 ? (
                  <div className="space-y-4">
                    {appliedJobs.map((job) => (
                      <div key={job._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-4">
                          <Link to={`/jobs/${job._id}`} className="text-lg font-medium text-blue-700 hover:text-blue-800">
                            {job.Title}
                          </Link>
                          <div className="mt-1 text-sm text-gray-600">
                            {job.Company && <span className="block">{job.Company}</span>}
                            {job.Location && <span className="block">{job.Location}</span>}
                          </div>
                          <div className="mt-2 flex justify-between">
                            <div>
                              {job.Category && (
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                                  {job.Category}
                                </span>
                              )}
                            </div>
                            <Link to={`/jobs/${job._id}`} className="px-3 py-1 bg-[#309689] text-white rounded text-sm">
                              View Job
                            </Link>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Application Status: Submitted
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>You haven't applied to any jobs yet.</p>
                    <Link to="/jobs" className="mt-2 inline-block text-[#309689] hover:text-[#267b6c]">
                      Browse Jobs
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Resume Popup Modal */}
      {showResumeModal && user.resume && (
        <Modal onClose={() => setShowResumeModal(false)}>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Resume</h2>
            <iframe src={user.resume} width="100%" height="500px" title="Resume Preview" className="border"></iframe>
          </div>
        </Modal>
      )}
      
      <Footer />
    </div>
  );
};

export default EmployeeProfile;
