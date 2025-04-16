import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Simple Modal Component for Resume Preview
const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg relative max-w-2xl w-full">
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
        const response = await fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || `Error: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data.experiences)) {
          data.experiences = [];
        }
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError(err.message);
      }
    };
    fetchUserData();
  }, []);

  if (error) return <div>{error}</div>;
  if (!user) return <div>Loading user data...</div>;

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
      experiences: [...(prevUser.experiences || []), { title: "", description: "", startDate: "", endDate: "", location: "" }],
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
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
      const updatedUser = await response.json();
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
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");
        const response = await fetch("http://localhost:5000/api/users/profile", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error: ${response.status}`);
        }
        alert("Profile deleted successfully.");
        navigate("/login");
      } catch (error) {
        console.error("Failed to delete user profile:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-4">
      {/* Header: Welcome with Nick Name and Logout Button */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user.nick_name || user.name || "Employee"}
          </h1>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleLogout}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-md"
          >
            Logout
          </button>
          {isEditing && (
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md"
            >
              Delete Profile
            </button>
          )}
        </div>
      </header>

      {/* Profile Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        {/* Top Section: Profile Picture and Full Name */}
        <div className="flex items-center mb-6">
          <div className="relative w-20 h-20 mr-4">
            <img
              src={user.photo || "https://via.placeholder.com/100?text=Profile"}
              alt="Profile"
              className="w-20 h-20 object-cover rounded-full cursor-pointer"
              onClick={handlePhotoClick}
            />
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handlePhotoChange} />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-gray-800">{user.name || "Employee Name"}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
          <div className="ml-auto">
            {isEditing ? (
              <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-md">
                Save
              </button>
            ) : (
              <button onClick={handleEditClick} className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md">
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Upload Resume Section */}
        <div className="mb-6">
          <label className="block text-gray-600 text-sm mb-2">Upload Resume</label>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleResumeUpload}
              disabled={!isEditing}
              className={`bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md ${!isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Upload Resume
            </button>
            <input type="file" accept=".pdf,.doc,.docx" ref={resumeInputRef} style={{ display: "none" }} onChange={handleResumeChange} />
            {user.resume && (
              <button onClick={() => setShowResumeModal(true)} className="text-sm text-blue-600 hover:underline">
                View Resume
              </button>
            )}
          </div>
        </div>

        {/* Editable Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-600 text-sm mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={user.name || ""}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter Full Name"
              className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                !isEditing ? "bg-gray-100 text-gray-500" : ""
              }`}
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Nick Name</label>
            <input
              type="text"
              name="nick_name"
              value={user.nick_name || ""}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter Nick Name"
              className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                !isEditing ? "bg-gray-100 text-gray-500" : ""
              }`}
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={user.country || ""}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter Country"
              className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                !isEditing ? "bg-gray-100 text-gray-500" : ""
              }`}
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Language</label>
            <input
              type="text"
              name="language"
              value={user.language || ""}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter Language"
              className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                !isEditing ? "bg-gray-100 text-gray-500" : ""
              }`}
            />
          </div>
        </div>

        {/* Experience Section */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
            {isEditing && (
              <button
                onClick={handleAddExperience}
                className="text-blue-500 hover:text-blue-600"
              >
                + Add Experience
              </button>
            )}
          </div>
          <div className="space-y-4">
            {user.experiences && user.experiences.map((exp, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Job Title</label>
                    <input
                      type="text"
                      value={exp.title || ""}
                      onChange={(e) => handleExperienceChange(index, "title", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                        !isEditing ? "bg-gray-100 text-gray-500" : ""
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Company</label>
                    <input
                      type="text"
                      value={exp.company || ""}
                      onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                        !isEditing ? "bg-gray-100 text-gray-500" : ""
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Start Date</label>
                    <input
                      type="date"
                      value={exp.startDate || ""}
                      onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                        !isEditing ? "bg-gray-100 text-gray-500" : ""
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">End Date</label>
                    <input
                      type="date"
                      value={exp.endDate || ""}
                      onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                        !isEditing ? "bg-gray-100 text-gray-500" : ""
                      }`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-600 text-sm mb-1">Description</label>
                    <textarea
                      value={exp.description || ""}
                      onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                      disabled={!isEditing}
                      rows="3"
                      className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                        !isEditing ? "bg-gray-100 text-gray-500" : ""
                      }`}
                    />
                  </div>
                </div>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveExperience(index)}
                    className="mt-2 text-red-500 hover:text-red-600 text-sm"
                  >
                    Remove Experience
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 text-sm mb-1">Technical Skills</label>
              <input
                type="text"
                name="technicalSkills"
                value={user.technicalSkills || ""}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g., JavaScript, React, Node.js (comma separated)"
                className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                  !isEditing ? "bg-gray-100 text-gray-500" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">Soft Skills</label>
              <input
                type="text"
                name="softSkills"
                value={user.softSkills || ""}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g., Communication, Leadership, Teamwork (comma separated)"
                className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                  !isEditing ? "bg-gray-100 text-gray-500" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">Languages</label>
              <input
                type="text"
                name="languages"
                value={user.languages || ""}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g., English (Fluent), Spanish (Intermediate)"
                className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                  !isEditing ? "bg-gray-100 text-gray-500" : ""
                }`}
              />
            </div>
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
    </div>
  );
};

export default EmployeeProfile;
