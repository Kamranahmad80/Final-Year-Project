import React from 'react';

const InterviewGuide = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Interview Guide</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Prepare for your next interview with our comprehensive guide
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-900">Before the Interview</h2>
            <ul className="mt-4 space-y-3 text-gray-600">
              <li>Research the company thoroughly</li>
              <li>Review the job description and requirements</li>
              <li>Prepare relevant examples of your experience</li>
              <li>Practice common interview questions</li>
              <li>Plan your professional outfit</li>
              <li>Get directions to the interview location</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-900">Common Questions</h2>
            <ul className="mt-4 space-y-3 text-gray-600">
              <li>Tell me about yourself</li>
              <li>Why are you interested in this position?</li>
              <li>What are your greatest strengths and weaknesses?</li>
              <li>Where do you see yourself in 5 years?</li>
              <li>Why should we hire you?</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-900">Body Language Tips</h2>
            <ul className="mt-4 space-y-3 text-gray-600">
              <li>Maintain good eye contact</li>
              <li>Offer a firm handshake</li>
              <li>Sit up straight and appear engaged</li>
              <li>Use appropriate hand gestures</li>
              <li>Smile and show enthusiasm</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-900">Follow-up</h2>
            <ul className="mt-4 space-y-3 text-gray-600">
              <li>Send a thank-you email within 24 hours</li>
              <li>Reference specific conversation points</li>
              <li>Reiterate your interest in the position</li>
              <li>Ask about next steps in the process</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewGuide; 