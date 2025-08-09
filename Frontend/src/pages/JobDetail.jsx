import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBriefcase, FaMapMarkerAlt, FaDollarSign, FaCalendarAlt, FaBuilding, FaArrowLeft } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// API configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper: decode JWT to extract user id
const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return payload.id || payload._id || null;
  } catch (e) {
    return null;
  }
};

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isApplied, setIsApplied] = useState(false);
  const [isAuthenticated] = useState(!!localStorage.getItem('token'));

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format salary helper
  const formatSalary = (salary) => {
    if (!salary) return 'Negotiable';
    if (typeof salary === 'string') return salary;
    return `$${salary.toLocaleString()}/year`;
  };

  // Fetch job details
  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/jobs/${id}`);
      const jobData = response.data;
      setJob(jobData);

      // Determine if already applied
      const currentUserId = getUserIdFromToken();
      const applicants = jobData?.applicants || [];
      const applied = Array.isArray(applicants) && applicants.some(a => {
        if (!a) return false;
        if (typeof a === 'string') return a === currentUserId;
        if (typeof a === 'object') return a._id === currentUserId || a.id === currentUserId;
        return false;
      });
      setIsApplied(!!applied);
    } catch (err) {
      console.error('Error fetching job:', err);
      setError('Failed to load job details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle job application
  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    try {
      await api.post(`/jobs/${id}/apply`);
      setIsApplied(true);
      toast.success('Application submitted successfully!');
    } catch (err) {
      console.error('Error applying to job:', err);
      const msg = err.response?.data?.message || 'Failed to submit application';
      if (msg.toLowerCase().includes('already applied')) {
        setIsApplied(true);
        toast.info('You have already applied to this job');
      } else {
        toast.error(msg);
      }
    }
  };

  // Fetch job data on component mount
  useEffect(() => {
    fetchJob();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
            >
              <FaArrowLeft className="inline mr-2" /> Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Job not found state
  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/jobs')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Browse All Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        {/* Job Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Back to Jobs
            </button>
            
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-shrink-0">
                <img
                  src={job.companyLogo || '/company-logo.png'}
                  alt={job.Company || 'Company logo'}
                  className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-lg border border-gray-200 p-1"
                  onError={(e) => {
                    e.target.src = '/company-logo.png';
                    e.target.onerror = null;
                  }}
                />
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {job.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  {job.Company && (
                    <div className="flex items-center">
                      <FaBuilding className="mr-1.5 text-gray-400" />
                      <span>{job.Company}</span>
                    </div>
                  )}
                  
                  {job.Location && (
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-1.5 text-gray-400" />
                      <span>{job.Location}</span>
                    </div>
                  )}
                  
                  {job.jobType && (
                    <div className="flex items-center">
                      <FaBriefcase className="mr-1.5 text-gray-400" />
                      <span className="capitalize">{job.jobType}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center text-lg font-medium text-blue-600 mb-6">
                  <FaDollarSign className="mr-1.5" />
                  <span>{formatSalary(job.salary)}</span>
                </div>
                
                <button
                  onClick={handleApply}
                  disabled={isApplied}
                  className={`px-6 py-3 rounded-lg font-medium w-full md:w-auto transition-colors ${
                    isApplied
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                  }`}
                >
                  {isApplied ? '✓ Applied' : 'Apply Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Job Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Description */}
              <section className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Job Description</h2>
                <div className="prose max-w-none text-gray-700">
                  {job.description ? (
                    <p className="whitespace-pre-line">{job.description}</p>
                  ) : (
                    <p className="text-gray-500">No description provided.</p>
                  )}
                </div>
              </section>
              
              {/* Requirements */}
              {job.requirements && (
                <section className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {Array.isArray(job.requirements) ? (
                      job.requirements.map((req, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-700">{job.requirements}</li>
                    )}
                  </ul>
                </section>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job Overview */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-gray-800 mb-4">Job Overview</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Posted Date</div>
                    <div className="font-medium flex items-center">
                      <FaCalendarAlt className="mr-2 text-gray-400" />
                      {formatDate(job.postedAt)}
                    </div>
                  </div>
                  
                  {job.jobType && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Job Type</div>
                      <div className="font-medium flex items-center">
                        <FaBriefcase className="mr-2 text-gray-400" />
                        {job.jobType}
                      </div>
                    </div>
                  )}
                  
                  {job.Location && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Location</div>
                      <div className="font-medium flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-gray-400" />
                        {job.Location}
                      </div>
                    </div>
                  )}
                  
                  {job.salary && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Salary</div>
                      <div className="font-medium flex items-center">
                        <FaDollarSign className="mr-2 text-gray-400" />
                        {formatSalary(job.salary)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Company Info */}
              {job.Company && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Company</h3>
                  <div className="flex items-center">
                    <img
                      src={job.companyLogo || '/company-logo.png'}
                      alt={`${job.Company} logo`}
                      className="w-12 h-12 rounded-lg border border-gray-200 p-1 mr-4"
                      onError={(e) => {
                        e.target.src = '/company-logo.png';
                        e.target.onerror = null;
                      }}
                    />
                    <div>
                      <div className="font-medium text-gray-900">{job.Company}</div>
                      <div className="text-sm text-gray-500">{job.Location || ''}</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Skills */}
              {job.skills?.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
};

export default JobDetail;