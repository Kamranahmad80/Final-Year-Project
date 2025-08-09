import React, { useState, useEffect } from 'react';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, 
  FiBriefcase, FiBook, FiAward, 
  FiEdit2, FiSave, FiPlus, FiTrash2 
} from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ResumeUpload from '../components/ResumeUpload';

// Helper function to generate resume preview URL
const getResumePreviewUrl = (resume) => {
  if (!resume) return null;
  
  // If there's a URL in the resume object, use that
  if (resume.url) return resume.url;
  
  // If we have the binary data, create a blob URL
  if (resume.data) {
    const blob = new Blob([resume.data], { type: resume.contentType || 'application/octet-stream' });
    return URL.createObjectURL(blob);
  }
  
  return null;
};

const EmployeeProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    skills: [],
    experience: [],
    education: [],
    resume: null
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch profile data from API
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Fetch user profile data from the correct endpoint
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: { 
            'x-auth-token': token,
            'Content-Type': 'application/json'
          }
        });
        
        const userData = response.data;
        
        // Format the location string
        const location = userData.address ? 
          [
            userData.address.city,
            userData.address.state,
            userData.address.country
          ].filter(Boolean).join(', ') : '';
        
        // Format the profile data
        const formattedProfile = {
          id: userData._id || userData.id, // Include the user ID
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || {
            street: '',
            city: '',
            state: '',
            zipCode: ''
          },
          skills: userData.skills || [],
          experience: userData.experience || [],
          education: userData.education || [],
          resume: userData.resume ? {
            ...userData.resume,
            preview: getResumePreviewUrl(userData.resume)
          } : null
        };
        
        console.log('Formatted profile:', formattedProfile);
        
        setProfile(formattedProfile);
        setIsLoading(false);
        
      } catch (error) {
        console.error('Error fetching profile:', error);
        
        // If 401, token might be invalid or expired
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          navigate('/login');
          return;
        }
        
        // Initialize with empty profile if there's an error
        setProfile({
          name: '',
          email: '',
          phone: '',
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: ''
          },
          skills: [],
          experience: [],
          education: [],
          resume: null
        });
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const formData = new FormData();
      
      // Add all profile fields to form data
      if (profile.name) formData.append('name', profile.name);
      if (profile.phone) formData.append('phone', profile.phone);
      if (profile.address) formData.append('address', JSON.stringify(profile.address));
      
      // Add arrays as JSON strings
      if (profile.skills) formData.append('skills', JSON.stringify(profile.skills));
      if (profile.experience) formData.append('experience', JSON.stringify(profile.experience));
      if (profile.education) formData.append('education', JSON.stringify(profile.education));
      
      // Send request to the API endpoint
      const response = await axios.put('http://localhost:5000/api/users/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        }
      });

      // Update profile with server response
      if (response.data) {
        const updatedUser = response.data;
        setProfile(prev => ({
          ...prev,
          ...updatedUser,
          // Preserve resume data if not in response
          resume: updatedUser.resume ? {
            ...updatedUser.resume,
            preview: getResumePreviewUrl(updatedUser.resume)
          } : prev.resume
        }));
        
        // Update user info in localStorage
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        userInfo.name = updatedUser.name || userInfo.name;
        userInfo.email = updatedUser.email || userInfo.email;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        // Notify other components about the user info update
        window.dispatchEvent(new Event('auth'));
      }
      
      setIsEditing(false);
      
      // Show success message
      alert('Profile updated successfully!');
      
    } catch (error) {
      console.error('Error saving profile:', error);
      
      if (error.response && error.response.status === 401) {
        // Token is invalid or expired, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        navigate('/login');
      } else {
        // Show error message with more details if available
        const errorMessage = error.response?.data?.msg || 'Failed to update profile. Please try again.';
        alert(`Error: ${errorMessage}`);
      }
    }
  };

  const addSkill = (e) => {
    e && e.preventDefault();
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleResumeUploaded = React.useCallback((resumeData) => {
    setProfile(prev => {
      // Only update if the resume data has actually changed
      const currentResume = prev.resume || {};
      const newResume = {
        ...resumeData,
        url: resumeData.url || `/api/users/resume/${resumeData.id || ''}`
      };
      
      // Only update if the resume has actually changed
      if (JSON.stringify(currentResume) === JSON.stringify(newResume)) {
        return prev;
      }
      
      return {
        ...prev,
        resume: newResume
      };
    });
  }, []);

  const getResumePreviewUrl = (resumeData) => {
    if (!resumeData) return null;
    
    // If we already have a data URL or blob URL, use it
    if (resumeData.preview) return resumeData.preview;
    
    // If we have binary data, create a blob URL
    if (resumeData.data) {
      try {
        // Convert base64 to blob
        const byteCharacters = atob(resumeData.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: resumeData.contentType || 'application/pdf' });
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error('Error creating blob URL from resume data:', error);
        return null;
      }
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 h-32"></div>
          <div className="px-6 py-4 -mt-16 relative">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center">
                  <FiUser className="h-16 w-16 text-indigo-600" />
                </div>
                <div className="ml-6 mt-12">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      className="text-2xl font-bold text-gray-800 mb-1 border rounded px-3 py-1 w-full"
                      placeholder="Full Name"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-800">{profile.name || 'Your Name'}</h1>
                  )}
                </div>
              </div>
              <div className="mt-4">
                {isEditing ? (
                  <button
                    onClick={handleSaveProfile}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition-colors"
                  >
                    <FiSave className="mr-2" /> Save Profile
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-lg flex items-center hover:bg-blue-50 transition-colors"
                  >
                    <FiEdit2 className="mr-2" /> Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FiUser className="mr-2 text-blue-600" /> About
              </h2>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-3 h-32"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-600">
                  {profile.bio || 'No bio added yet. Add a brief introduction about yourself.'}
                </p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <FiMail className="mr-3 text-blue-600" />
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      className="border rounded px-3 py-1 text-sm w-full"
                    />
                  ) : (
                    <span>{profile.email || 'No email provided'}</span>
                  )}
                </div>
                <div className="flex items-center text-gray-600">
                  <FiPhone className="mr-3 text-blue-600" />
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                      className="border rounded px-3 py-1 text-sm w-full"
                      placeholder="Phone number"
                    />
                  ) : (
                    <span>{profile.phone || 'No phone number provided'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
                {isEditing && (
                  <FiPlus
                    onClick={() => document.getElementById('skillInput')?.focus()}
                    className="text-blue-600 cursor-pointer"
                  />
                )}
              </div>
              {isEditing ? (
                <form onSubmit={addSkill} className="mb-4">
                  <div className="flex">
                    <input
                      type="text"
                      id="skillInput"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill(e)}
                      placeholder="Add a skill"
                      className="flex-1 border rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-3 rounded-r-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </form>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-blue-400 hover:text-blue-700"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic">No skills added yet.</p>
                )}
              </div>
            </div>

            {/* Resume */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume
                </label>
                {profile.id && localStorage.getItem('token') ? (
                  <ResumeUpload 
                    userId={profile.id}
                    token={localStorage.getItem('token')}
                    isEditing={isEditing}
                    onUpload={(resume) => {
                      setProfile(prev => ({
                        ...prev,
                        resume: resume ? {
                          ...resume,
                          preview: resume.url
                        } : null
                      }));
                    }}
                  />
                ) : (
                  <div className="text-gray-500 text-sm">
                    {isLoading ? 'Loading...' : 'Authentication required'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;