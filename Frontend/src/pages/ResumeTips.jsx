import React from 'react';

const ResumeTips = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Resume Writing Tips</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Create a standout resume that gets you noticed by employers
          </p>
        </div>

        <div className="mt-12 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-900">Essential Resume Sections</h2>
            <ul className="mt-4 space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="font-medium">Contact Information:</span>
                <span className="ml-2">Include your name, phone, email, and location</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium">Professional Summary:</span>
                <span className="ml-2">Write a compelling overview of your skills and experience</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium">Work Experience:</span>
                <span className="ml-2">List relevant positions with achievements and responsibilities</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium">Education:</span>
                <span className="ml-2">Include your academic background and certifications</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-900">Pro Tips</h2>
            <ul className="mt-4 space-y-4 text-gray-600">
              <li>Use action verbs to describe your achievements</li>
              <li>Customize your resume for each job application</li>
              <li>Keep it concise and relevant</li>
              <li>Proofread carefully for errors</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeTips; 