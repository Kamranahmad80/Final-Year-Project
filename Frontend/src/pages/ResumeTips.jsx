import React from 'react';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

const ResumeTips = () => {
  return (
    <div className="bg-gray-50">
      <Hero 
        title="Resume Writing Tips" 
        subtitle="Create a standout resume that gets you noticed by employers"
        isSmall={true}
      />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-[#309689] mb-5">Essential Resume Sections</h2>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#309689] flex items-center justify-center text-white font-bold text-sm mr-3 mt-0.5">1</div>
                <div>
                  <span className="font-medium text-gray-800 block mb-1">Contact Information</span>
                  <p>Include your name, phone, email, LinkedIn profile, and location (city/state is sufficient). Make sure your email address is professional.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#309689] flex items-center justify-center text-white font-bold text-sm mr-3 mt-0.5">2</div>
                <div>
                  <span className="font-medium text-gray-800 block mb-1">Professional Summary</span>
                  <p>Write a compelling overview of your skills and experience. Keep it to 3-4 sentences that highlight your strongest qualifications.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#309689] flex items-center justify-center text-white font-bold text-sm mr-3 mt-0.5">3</div>
                <div>
                  <span className="font-medium text-gray-800 block mb-1">Work Experience</span>
                  <p>List relevant positions with achievements using action verbs and quantifiable results (e.g., "Increased sales by 20%"). Use bullet points for readability.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#309689] flex items-center justify-center text-white font-bold text-sm mr-3 mt-0.5">4</div>
                <div>
                  <span className="font-medium text-gray-800 block mb-1">Education</span>
                  <p>Include your academic background and relevant certifications. List degrees in reverse chronological order.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#309689] flex items-center justify-center text-white font-bold text-sm mr-3 mt-0.5">5</div>
                <div>
                  <span className="font-medium text-gray-800 block mb-1">Skills</span>
                  <p>List relevant technical and soft skills. Group them by category if you have many.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-[#309689] mb-5">Pro Tips for a Standout Resume</h2>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#309689]/20 flex items-center justify-center text-[#309689] font-bold text-lg mr-3 mt-0.5">✓</div>
                <div>
                  <span className="font-medium text-gray-800">Use action verbs and keywords</span>
                  <p className="mt-1">Begin bullet points with action verbs (achieved, improved, led) and incorporate keywords from the job description.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#309689]/20 flex items-center justify-center text-[#309689] font-bold text-lg mr-3 mt-0.5">✓</div>
                <div>
                  <span className="font-medium text-gray-800">Customize for each application</span>
                  <p className="mt-1">Tailor your resume to highlight relevant skills and experience for each specific job application.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#309689]/20 flex items-center justify-center text-[#309689] font-bold text-lg mr-3 mt-0.5">✓</div>
                <div>
                  <span className="font-medium text-gray-800">Keep it concise</span>
                  <p className="mt-1">Aim for 1-2 pages maximum. Use bullet points and concise language to improve readability.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#309689]/20 flex items-center justify-center text-[#309689] font-bold text-lg mr-3 mt-0.5">✓</div>
                <div>
                  <span className="font-medium text-gray-800">Quantify achievements</span>
                  <p className="mt-1">Use numbers and percentages to demonstrate your impact (e.g., "Managed a team of 5", "Reduced costs by 15%").</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#309689]/20 flex items-center justify-center text-[#309689] font-bold text-lg mr-3 mt-0.5">✓</div>
                <div>
                  <span className="font-medium text-gray-800">Proofread carefully</span>
                  <p className="mt-1">Ensure there are no spelling, grammar, or formatting errors. Ask someone else to review it as well.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-[#309689]/10 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-[#309689] mb-4">Resume Formatting Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">DO:</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Use a clean, professional design</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Maintain consistent formatting</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Use clear section headings</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Include white space for readability</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Save as a PDF to preserve formatting</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">DON'T:</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Use fancy fonts or excessive colors</span>
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Include personal photos (unless required)</span>
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Make spelling or grammar errors</span>
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Use generic objectives or summaries</span>
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Include irrelevant experience</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ResumeTips;