import React from 'react';

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Help Center</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Find answers to common questions and get the support you need
          </p>
        </div>
        
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900">Getting Started</h2>
            <p className="mt-2 text-gray-600">Learn the basics of using our platform and find your dream job.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900">Account Support</h2>
            <p className="mt-2 text-gray-600">Manage your account settings and preferences.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900">FAQs</h2>
            <p className="mt-2 text-gray-600">Find answers to frequently asked questions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;