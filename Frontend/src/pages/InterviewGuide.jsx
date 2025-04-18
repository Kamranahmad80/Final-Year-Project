import React from 'react';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

const InterviewGuide = () => {
  return (
    <div className="bg-gray-50">
      <Hero 
        title="Interview Guide" 
        subtitle="Prepare for your next interview with our comprehensive guide"
        isSmall={true}
      />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-[#309689]/10 rounded-full flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#309689]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
        </div>
            <h2 className="text-2xl font-semibold text-[#309689] mb-4">Before the Interview</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <span className="text-[#309689] mr-2">•</span>
                <span>Research the company thoroughly</span>
              </li>
              <li className="flex items-center">
                <span className="text-[#309689] mr-2">•</span>
                <span>Review the job description carefully</span>
              </li>
              <li className="flex items-center">
                <span className="text-[#309689] mr-2">•</span>
                <span>Prepare relevant examples of your experience</span>
              </li>
              <li className="flex items-center">
                <span className="text-[#309689] mr-2">•</span>
                <span>Practice common interview questions</span>
              </li>
              <li className="flex items-center">
                <span className="text-[#309689] mr-2">•</span>
                <span>Plan your professional outfit in advance</span>
              </li>
              <li className="flex items-center">
                <span className="text-[#309689] mr-2">•</span>
                <span>Get directions to the interview location</span>
              </li>
              <li className="flex items-center">
                <span className="text-[#309689] mr-2">•</span>
                <span>Prepare questions to ask the interviewer</span>
              </li>
              <li className="flex items-center">
                <span className="text-[#309689] mr-2">•</span>
                <span>Get enough rest the night before</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-[#309689]/10 rounded-full flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#309689]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-[#309689] mb-4">Common Questions</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#309689] mr-2 mt-1">•</span>
                <div>
                  <span className="font-medium text-gray-800">Tell me about yourself</span>
                  <p className="text-sm mt-0.5">Focus on your professional background, relevant skills, and career goals.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#309689] mr-2 mt-1">•</span>
                <div>
                  <span className="font-medium text-gray-800">Why are you interested in this position?</span>
                  <p className="text-sm mt-0.5">Connect your skills and career goals to the job and company mission.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#309689] mr-2 mt-1">•</span>
                <div>
                  <span className="font-medium text-gray-800">What are your strengths and weaknesses?</span>
                  <p className="text-sm mt-0.5">Be honest and frame weaknesses as areas you're working to improve.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#309689] mr-2 mt-1">•</span>
                <div>
                  <span className="font-medium text-gray-800">Where do you see yourself in 5 years?</span>
                  <p className="text-sm mt-0.5">Show ambition that aligns with the role and company growth.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#309689] mr-2 mt-1">•</span>
                <div>
                  <span className="font-medium text-gray-800">Why should we hire you?</span>
                  <p className="text-sm mt-0.5">Highlight your unique combination of skills and experience.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-[#309689]/10 rounded-full flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#309689]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-[#309689] mb-4">Body Language Tips</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#309689] mr-2 mt-1">•</span>
                <div>
                  <span className="font-medium text-gray-800">Eye contact</span>
                  <p className="text-sm mt-0.5">Maintain natural eye contact to show confidence and engagement.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#309689] mr-2 mt-1">•</span>
                <div>
                  <span className="font-medium text-gray-800">Handshake</span>
                  <p className="text-sm mt-0.5">Offer a firm handshake at the beginning and end of the interview.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#309689] mr-2 mt-1">•</span>
                <div>
                  <span className="font-medium text-gray-800">Posture</span>
                  <p className="text-sm mt-0.5">Sit up straight and lean slightly forward to show interest.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#309689] mr-2 mt-1">•</span>
                <div>
                  <span className="font-medium text-gray-800">Hand gestures</span>
                  <p className="text-sm mt-0.5">Use appropriate hand gestures to emphasize points, but avoid fidgeting.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#309689] mr-2 mt-1">•</span>
                <div>
                  <span className="font-medium text-gray-800">Facial expressions</span>
                  <p className="text-sm mt-0.5">Smile naturally and show enthusiasm throughout the conversation.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-[#309689]/10 rounded-full flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#309689]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-[#309689] mb-4">STAR Method for Answers</h2>
            <p className="text-gray-600 mb-4">Use the STAR method to structure your answers to behavioral questions:</p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="font-bold text-[#309689] mr-2">S</span>
                <div>
                  <span className="font-medium text-gray-800">Situation</span>
                  <p className="mt-1">Describe the context or background of the situation you were in.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-[#309689] mr-2">T</span>
                <div>
                  <span className="font-medium text-gray-800">Task</span>
                  <p className="mt-1">Explain the task or challenge you were responsible for handling.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-[#309689] mr-2">A</span>
                <div>
                  <span className="font-medium text-gray-800">Action</span>
                  <p className="mt-1">Describe the specific actions you took to address the situation.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-[#309689] mr-2">R</span>
                <div>
                  <span className="font-medium text-gray-800">Result</span>
                  <p className="mt-1">Share the outcomes of your actions and what you learned.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-[#309689]/10 rounded-full flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#309689]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-[#309689] mb-4">Follow-up Best Practices</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#309689] mr-2 mt-1">•</span>
                <div>
                  <span className="font-medium text-gray-800">Send a thank-you email within 24 hours</span>
                  <p className="mt-1">Express gratitude for the opportunity to interview and reaffirm your interest.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#309689] mr-2 mt-1">•</span>
                <div>
                  <span className="font-medium text-gray-800">Personalize your message</span>
                  <p className="mt-1">Reference specific conversation points from the interview to show attentiveness.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#309689] mr-2 mt-1">•</span>
                <div>
                  <span className="font-medium text-gray-800">Address any missed points</span>
                  <p className="mt-1">If you forgot to mention an important qualification, briefly include it now.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#309689] mr-2 mt-1">•</span>
                <div>
                  <span className="font-medium text-gray-800">Ask about next steps</span>
                  <p className="mt-1">Politely inquire about the timeline for the hiring decision process.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#309689] mr-2 mt-1">•</span>
                <div>
                  <span className="font-medium text-gray-800">Follow up if needed</span>
                  <p className="mt-1">If you don't hear back by the indicated time, send a polite follow-up.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default InterviewGuide; 