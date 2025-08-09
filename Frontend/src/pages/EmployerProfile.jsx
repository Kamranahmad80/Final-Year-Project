
import React, { useState, useEffect } from 'react';
import { FiBriefcase, FiMail, FiPhone, FiMapPin, FiUsers, FiGlobe, FiEdit2, FiSave, FiPlus, FiTrash2, FiUpload } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployerProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    companyDetails: {
      companyName: '',
      website: '',
      industry: '',
      companySize: '',
      foundedYear: '',
      about: '',
      logo: '',
      coverPhoto: ''
    },
    jobPostings: [],
    teamMembers: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    type: 'Full-time',
    location: '',
    salary: '',
    description: '',
    requirements: [],
    responsibilities: []
  });
  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    position: '',
    email: '',
    phone: ''
  });
  const [showJobForm, setShowJobForm] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [newRequirement, setNewRequirement] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');
  const navigate = useNavigate();

  // Job types for the dropdown
  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Temporary',
    'Internship',
    'Freelance'
  ];

  // Company sizes for the dropdown
  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1001-5000 employees',
    '5001+ employees'
  ];

  useEffect(() => {
    // Fetch user profile data from API
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: { 
            'x-auth-token': token,
            'Content-Type': 'application/json'
          }
        });
        
        // Set the profile with the user data
        const userData = response.data;
        setProfile({
          ...userData,
          companyDetails: userData.companyDetails || {}
        });
      } catch (error) {
        console.error('Error fetching employer profile:', error);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Check if the field is in companyDetails
    if (name in (profile.companyDetails || {})) {
      setProfile(prev => ({
        ...prev,
        companyDetails: {
          ...prev.companyDetails,
          [name]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleJobChange = (e) => {
    const { name, value } = e.target;
    setNewJob(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeamMemberChange = (e) => {
    const { name, value } = e.target;
    setNewTeamMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addJobPosting = () => {
    const jobToAdd = {
      ...newJob,
      id: Date.now(),
      postedDate: new Date(),
      status: 'Active'
    };
    
    setProfile(prev => ({
      ...prev,
      jobPostings: [...(prev.jobPostings || []), jobToAdd]
    }));
    
    // Reset form
    setNewJob({
      title: '',
      type: 'Full-time',
      location: '',
      salary: '',
      description: '',
      requirements: [],
      responsibilities: []
    });
    setShowJobForm(false);
  };

  const addTeamMember = () => {
    setProfile(prev => ({
      ...prev,
      teamMembers: [...(prev.teamMembers || []), { ...newTeamMember, id: Date.now() }]
    }));
    
    // Reset form
    setNewTeamMember({
      name: '',
      position: '',
      email: '',
      phone: ''
    });
    setShowTeamForm(false);
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setNewJob(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setNewJob(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, newResponsibility.trim()]
      }));
      setNewResponsibility('');
    }
  };

  const removeRequirement = (index) => {
    const updatedRequirements = [...newJob.requirements];
    updatedRequirements.splice(index, 1);
    setNewJob(prev => ({
      ...prev,
      requirements: updatedRequirements
    }));
  };

  const removeResponsibility = (index) => {
    const updatedResponsibilities = [...newJob.responsibilities];
    updatedResponsibilities.splice(index, 1);
    setNewJob(prev => ({
      ...prev,
      responsibilities: updatedResponsibilities
    }));
  };

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/update', profile, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });
      setIsEditing(false);
      // Show success message
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleFileChange = (e, field) => {
    setProfile(prev => ({
      ...prev,
      [field]: e.target.files[0]
    }));
  };

  const uploadFile = async (file, field) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/upload/' + field, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update the profile with the new file URL
      setProfile(prev => ({
        ...prev,
        [field]: response.data.url
      }));
      
      // Show success message
    } catch (error) {
      console.error(`Error uploading ${field}:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Cover Photo */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <label className="bg-white bg-opacity-90 text-blue-600 px-4 py-2 rounded-lg flex items-center cursor-pointer hover:bg-opacity-100 transition-all">
                  <FiUpload className="mr-2" />
                  Change Cover Photo
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      handleFileChange(e, 'coverPhoto');
                      uploadFile(e.target.files[0], 'coverPhoto');
                    }}
                  />
                </label>
              </div>
            )}
            {profile.coverPhoto && (
              <img 
                src={typeof profile.coverPhoto === 'string' ? profile.coverPhoto : URL.createObjectURL(profile.coverPhoto)} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          <div className="px-8 py-6 -mt-16 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
              <div className="flex items-end">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center overflow-hidden">
                    {profile.logo ? (
                      <img 
                        src={typeof profile.logo === 'string' ? profile.logo : URL.createObjectURL(profile.logo)} 
                        alt={profile.companyName || 'Company Logo'} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FiBriefcase className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100">
                      <FiEdit2 className="text-blue-600" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          handleFileChange(e, 'logo');
                          uploadFile(e.target.files[0], 'logo');
                        }}
                      />
                    </label>
                  )}
                </div>
                
                <div className="ml-6 mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="companyName"
                      value={profile.companyName}
                      onChange={handleInputChange}
                      className="text-2xl font-bold text-gray-800 mb-1 border rounded px-3 py-1 w-full"
                      placeholder="Company Name"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-800">{profile.companyName || 'Company Name'}</h1>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <select
                          name="industry"
                          value={profile.industry}
                          onChange={handleInputChange}
                          className="border rounded px-2 py-1 text-sm flex-1"
                        >
                          <option value="">Select Industry</option>
                          <option value="Technology">Technology</option>
                          <option value="Finance">Finance</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Education">Education</option>
                          <option value="Retail">Retail</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Other">Other</option>
                        </select>
                        <input
                          type="text"
                          name="location"
                          value={profile.address?.city || ''}
                          onChange={(e) => {
                            setProfile(prev => ({
                              ...prev,
                              address: {
                                ...prev.address,
                                city: e.target.value
                              }
                            }));
                          }}
                          className="border rounded px-2 py-1 text-sm flex-1"
                          placeholder="Location"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {profile.industry && <span>{profile.industry}</span>}
                        {profile.industry && profile.address?.city && <span>•</span>}
                        <span>{profile.address?.city || 'Location not specified'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0">
                {isEditing ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={saveProfile}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                    >
                      <FiSave className="mr-1" /> Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                  >
                    <FiEdit2 className="mr-1" /> Edit Profile
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
              <h2 className="text-xl font-semibold text-gray-800 mb-4">About Us</h2>
              {isEditing ? (
                <textarea
                  name="about"
                  value={profile.about}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-3 h-40"
                  placeholder="Tell us about your company..."
                />
              ) : (
                <p className="text-gray-600">
                  {profile.about || 'No company description added yet.'}
                </p>
              )}
            </div>

            {/* Job Postings */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Job Postings</h2>
                <button
                  onClick={() => setShowJobForm(true)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm flex items-center hover:bg-blue-700 transition-colors"
                >
                  <FiPlus className="mr-1" /> Post a Job
                </button>
              </div>

              {showJobForm && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h3 className="font-medium mb-3">Post a New Job</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="title"
                      value={newJob.title}
                      onChange={handleJobChange}
                      placeholder="Job Title"
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <select
                        name="type"
                        value={newJob.type}
                        onChange={handleJobChange}
                        className="border rounded px-3 py-2 text-sm"
                      >
                        {jobTypes.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        ))}
                      </select>
                      
                      <input
                        type="text"
                        name="location"
                        value={newJob.location}
                        onChange={handleJobChange}
                        placeholder="Location"
                        className="border rounded px-3 py-2 text-sm"
                      />
                    </div>
                    
                    <input
                      type="text"
                      name="salary"
                      value={newJob.salary}
                      onChange={handleJobChange}
                      placeholder="Salary Range (e.g., $50,000 - $70,000)"
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Job Description</label>
                      <textarea
                        name="description"
                        value={newJob.description}
                        onChange={handleJobChange}
                        className="w-full border rounded px-3 py-2 text-sm h-24"
                        placeholder="Detailed job description..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Requirements</label>
                      <div className="flex mb-2">
                        <input
                          type="text"
                          value={newRequirement}
                          onChange={(e) => setNewRequirement(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                          placeholder="Add a requirement"
                          className="flex-1 border rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          onClick={addRequirement}
                          className="bg-blue-600 text-white px-3 rounded-r-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {newJob.requirements.map((req, index) => (
                          <div key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs flex items-center">
                            {req}
                            <button
                              onClick={() => removeRequirement(index)}
                              className="ml-1 text-blue-400 hover:text-blue-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Responsibilities</label>
                      <div className="flex mb-2">
                        <input
                          type="text"
                          value={newResponsibility}
                          onChange={(e) => setNewResponsibility(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addResponsibility()}
                          placeholder="Add a responsibility"
                          className="flex-1 border rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          onClick={addResponsibility}
                          className="bg-blue-600 text-white px-3 rounded-r-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {newJob.responsibilities.map((resp, index) => (
                          <div key={index} className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs flex items-center">
                            {resp}
                            <button
                              onClick={() => removeResponsibility(index)}
                              className="ml-1 text-green-400 hover:text-green-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => setShowJobForm(false)}
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addJobPosting}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Post Job
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {profile.jobPostings && profile.jobPostings.length > 0 ? (
                <div className="space-y-4">
                  {profile.jobPostings.map((job, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
                            <span>{job.type}</span>
                            <span>•</span>
                            <span>{job.location}</span>
                            <span>•</span>
                            <span>Posted on {new Date(job.postedDate).toLocaleDateString()}</span>
                          </div>
                          <div className="mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              job.status === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {job.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <FiEdit2 size={16} />
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiBriefcase className="mx-auto h-10 w-10 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No job postings yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by posting your first job.</p>
                  <div className="mt-4">
                    <button
                      onClick={() => setShowJobForm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                      Post a Job
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Information */}
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
                      placeholder="contact@company.com"
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
                      placeholder="+1 (555) 123-4567"
                    />
                  ) : (
                    <span>{profile.phone || 'No phone number provided'}</span>
                  )}
                </div>
                <div className="flex items-center text-gray-600">
                  <FiGlobe className="mr-3 text-blue-600" />
                  {isEditing ? (
                    <input
                      type="url"
                      name="website"
                      value={profile.website}
                      onChange={handleInputChange}
                      className="border rounded px-3 py-1 text-sm w-full"
                      placeholder="https://company.com"
                    />
                  ) : (
                    <a 
                      href={profile.website?.startsWith('http') ? profile.website : `https://${profile.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profile.website || 'No website provided'}
                    </a>
                  )}
                </div>
                <div className="flex items-start text-gray-600">
                  <FiMapPin className="mr-3 text-blue-600 mt-1" />
                  {isEditing ? (
                    <textarea
                      name="location"
                      value={profile.location}
                      onChange={handleInputChange}
                      className="border rounded px-3 py-1 text-sm w-full"
                      placeholder="Company Address"
                      rows="2"
                    />
                  ) : (
                    <span className="whitespace-pre-line">{profile.location || 'No address provided'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Team Members</h2>
                <button
                  onClick={() => setShowTeamForm(true)}
                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                >
                  <FiPlus className="mr-1" /> Add Member
                </button>
              </div>

              {showTeamForm && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h3 className="font-medium mb-3">Add Team Member</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="name"
                      value={newTeamMember.name}
                      onChange={handleTeamMemberChange}
                      placeholder="Full Name"
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      name="position"
                      value={newTeamMember.position}
                      onChange={handleTeamMemberChange}
                      placeholder="Position"
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                    <input
                      type="email"
                      name="email"
                      value={newTeamMember.email}
                      onChange={handleTeamMemberChange}
                      placeholder="Email"
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={newTeamMember.phone}
                      onChange={handleTeamMemberChange}
                      placeholder="Phone"
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={() => setShowTeamForm(false)}
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addTeamMember}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Add Member
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {profile.teamMembers && profile.teamMembers.length > 0 ? (
                <div className="space-y-3">
                  {profile.teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center p-2 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                        <p className="text-xs text-gray-500 truncate">{member.position}</p>
                      </div>
                      <div className="flex space-x-1">
                        <a 
                          href={`mailto:${member.email}`} 
                          className="text-gray-400 hover:text-blue-600"
                          title="Email"
                        >
                          <FiMail size={16} />
                        </a>
                        <button className="text-gray-400 hover:text-red-600 ml-1">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <FiUsers className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-500">No team members added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;