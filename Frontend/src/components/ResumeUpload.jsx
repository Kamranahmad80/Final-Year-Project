import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUpload, FiFile, FiTrash2, FiDownload } from 'react-icons/fi';

const ResumeUpload = ({ userId, token, onUpload, isEditing = false }) => {
  const [resume, setResume] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = React.useRef(null);

  // Track initial load with a ref
  const initialLoad = React.useRef(true);
  
  // Load resume data when component mounts or when userId/token changes
  useEffect(() => {
    // Skip the effect if this is not the initial load and we already have resume data
    if (!initialLoad.current && resume) return;
    
    const fetchResume = async () => {
      if (!userId || !token) return;
      
      try {
        const response = await axios.get(`http://localhost:5000/api/users/me`, {
          headers: { 'x-auth-token': token }
        });
        
        if (response.data.resume) {
          const newResume = {
            ...response.data.resume,
            id: response.data._id || userId
          };
          
          setResume(newResume);
          
          // Only notify parent if the resume data has changed
          if (onUpload && JSON.stringify(newResume) !== JSON.stringify(resume)) {
            onUpload(newResume);
          }
        } else if (onUpload && resume !== null) {
          onUpload(null);
        }
      } catch (err) {
        console.error('Error fetching resume:', err);
        setError('Failed to load resume');
      } finally {
        initialLoad.current = false;
      }
    };

    fetchResume();
  }, [userId, token]); // Removed onUpload from dependencies to prevent loop

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid PDF, DOC, or DOCX file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setError('');
    setResume({
      file,
      originalName: file.name,
      size: file.size
    });
  };

  // Debugging effect to log props and state changes
  useEffect(() => {
    console.log('ResumeUpload props updated:', {
      userId,
      hasToken: !!token,
      isEditing,
      resume: resume ? {
        hasFile: !!resume.file,
        originalName: resume.originalName,
        size: resume.size
      } : 'No resume'
    });
  }, [userId, token, isEditing, resume]);

  const handleUpload = async () => {
    console.log('=== UPLOAD RESUME HANDLER ===');
    console.log('Current state:', {
      isEditing,
      hasFile: !!resume?.file,
      userId,
      hasToken: !!token,
      fileInfo: resume?.file ? {
        name: resume.file.name,
        size: resume.file.size,
        type: resume.file.type,
        lastModified: resume.file.lastModified
      } : 'No file'
    });

    if (!isEditing) {
      const errorMsg = 'Upload prevented: Not in edit mode';
      console.log(errorMsg);
      setError(errorMsg);
      return;
    }
    
    if (!resume?.file) {
      const errorMsg = 'No file selected for upload';
      console.log(errorMsg);
      setError(errorMsg);
      return;
    }
    
    if (!userId || !token) {
      const errorMsg = 'Missing userId or token';
      console.log(errorMsg, { 
        userId: userId || 'undefined',
        hasToken: !!token 
      });
      setError('Please log in to upload a resume');
      return;
    }

    // Create FormData and append file
    const formData = new FormData();
    try {
      formData.append('resume', resume.file);
      
      // Verify the file was appended correctly
      if (!formData.has('resume')) {
        throw new Error('Failed to append file to FormData');
      }
      
      console.log('FormData prepared for upload:', {
        hasResume: formData.has('resume'),
        fileInfo: {
          name: resume.file.name,
          size: resume.file.size,
          type: resume.file.type
        },
        formDataKeys: Array.from(formData.keys())
      });
      
    } catch (formError) {
      console.error('Error preparing FormData:', formError);
      setError('Failed to prepare file for upload');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      console.log('Sending upload request to server...');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
          'Accept': 'application/json'
        },
        timeout: 30000, // 30 seconds
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      };

      console.log('Request config:', JSON.stringify({
        url: 'http://localhost:5000/api/users/upload-resume',
        headers: config.headers,
        hasData: !!formData,
        withCredentials: config.withCredentials
      }, null, 2));

      const response = await axios.post(
        'http://localhost:5000/api/users/upload-resume',
        formData,
        config
      );

      console.log('Upload response received:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data ? {
          ...response.data,
          // Don't log the entire resume data if it's large
          resume: response.data.resume ? {
            ...response.data.resume,
            data: response.data.resume.data ? '[BINARY DATA]' : 'No data'
          } : 'No resume in response'
        } : 'No data in response'
      });

      if (!response.data || !response.data.resume) {
        throw new Error('Invalid response format from server');
      }

      // Update local state with the uploaded file info
      const updatedResume = {
        ...response.data.resume,
        id: userId,
        url: response.data.resume.url || `/api/users/resume/${userId}`
      };
      
      console.log('Updated resume state:', updatedResume);
      setResume(updatedResume);
      
      if (onUpload) {
        onUpload(updatedResume);
      }

      // Show success message
      console.log('Resume uploaded successfully');

    } catch (err) {
      // Log detailed error information
      const errorDetails = {
        name: err.name,
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        responseData: err.response?.data,
        request: {
          method: err.config?.method,
          url: err.config?.url,
          headers: err.config?.headers,
          data: err.config?.data
        },
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      };
      
      console.error('Upload error details:', errorDetails);
      
      // Determine user-friendly error message
      let errorMessage = 'Failed to upload resume';
      
      if (err.response) {
        // Server responded with an error status code
        if (err.response.status === 401) {
          errorMessage = 'Session expired. Please log in again.';
        } else if (err.response.status === 413) {
          errorMessage = 'File is too large. Maximum size is 5MB.';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = `Server error: ${err.response.status} ${err.response.statusText}`;
        }
      } else if (err.request) {
        // Request was made but no response received
        if (err.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out. Please try again.';
        } else {
          errorMessage = 'No response from server. Please check your connection.';
        }
      } else if (err.message) {
        // Other errors
        errorMessage = err.message;
      }
      
      setError(`Upload failed: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!userId || !token || !resume) return;

    try {
      // If it's a local file that hasn't been uploaded yet
      if (resume.file) {
        const url = URL.createObjectURL(resume.file);
        window.open(url, '_blank');
        return;
      }
      
      // For server-stored resume
      const response = await fetch(`http://localhost:5000/api/users/resume/${resume.id || userId}`, {
        method: 'GET',
        headers: {
          'x-auth-token': token,
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to download resume');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', resume.originalName || 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error opening resume:', err);
      setError('Failed to open resume');
    }
  };

  const handleRemove = async () => {
    if (!isEditing || !userId || !token) return;

    if (!window.confirm('Are you sure you want to remove your resume?')) {
      return;
    }

    try {
      await axios.delete('http://localhost:5000/api/users/resume', {
        headers: { 'x-auth-token': token }
      });

      setResume(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      if (onUpload) {
        onUpload(null);
      }
    } catch (err) {
      console.error('Remove error:', err);
      setError('Failed to remove resume');
    }
  };

  return (
    <div className="space-y-4">
      {error && !resume?.file && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {resume ? (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FiFile className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                  {resume.originalName || 'Resume'}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleDownload}
                  className="p-1.5 text-blue-600 hover:text-blue-700"
                  title="Download Resume"
                  disabled={isUploading}
                >
                  <FiDownload size={18} />
                </button>
                {isEditing && (
                  <button
                    onClick={handleRemove}
                    className="p-1.5 text-red-600 hover:text-red-700"
                    disabled={isUploading}
                    title="Remove Resume"
                  >
                    <FiTrash2 size={18} />
                  </button>
                )}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {resume.size && `${(resume.size / 1024).toFixed(1)} KB`}
              {resume.uploadDate && ` • Uploaded: ${new Date(resume.uploadDate).toLocaleDateString()}`}
            </div>
          </div>
          
          {isEditing && resume.file && (
            <div className="flex space-x-2">
              <button
                onClick={handleUpload}
                className={`flex-1 py-2 px-4 rounded-md text-white ${
                  isUploading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload Resume'}
              </button>
              <button
                onClick={() => setResume(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={isUploading}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ) : (
        <div 
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${
            isEditing 
              ? 'border-gray-300 hover:border-gray-400 cursor-pointer' 
              : 'border-gray-200'
          }`}
          onClick={() => isEditing && fileInputRef.current?.click()}
        >
          <div className="space-y-1 text-center">
            <FiUpload className={`mx-auto h-12 w-12 ${
              isEditing ? 'text-gray-400' : 'text-gray-300'
            }`} />
            <div className="flex text-sm text-gray-600 justify-center">
              {isEditing ? (
                <>
                  <span className="relative bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                    Upload a file
                  </span>
                  <p className="pl-1">or drag and drop</p>
                </>
              ) : (
                <p className="text-gray-500">No resume uploaded yet</p>
              )}
            </div>
            <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 5MB</p>
          </div>
          
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx"
            disabled={!isEditing}
          />
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
