import React, { useState } from 'react';
import Footer from '../components/Footer';
import Hero from '../components/Hero';

const HelpCenter = () => {
  // State to track which content section to display
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [activeQuestion, setActiveQuestion] = useState(null);

  // Categories with their content
  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: '🚀',
      description: 'Learn the basics of using our platform and find your dream job.',
      questions: [
        {
          id: 'gs-1',
          question: 'How do I create an account?',
          answer: 'To create an account, click on the "Register" button in the top right corner of the homepage. Fill in your personal details, select whether you are an employee or employer, and submit the form. You will receive an email confirmation to verify your account.'
        },
        {
          id: 'gs-2',
          question: 'How do I search for jobs?',
          answer: 'Use the search bar on the homepage to look for jobs by title, skill, or company. You can also filter results by location, category, or job type using the advanced search options. Our AI will recommend jobs based on your profile information and past searches.'
        },
        {
          id: 'gs-3',
          question: 'How do I upload my resume?',
          answer: 'After logging in, go to your profile page and click on "Upload Resume" button. You can upload files in PDF, DOC, or DOCX format. Our system will automatically parse your resume to highlight key skills and experiences for better job matches.'
        }
      ]
    },
    {
      id: 'account-support',
      title: 'Account Support',
      icon: '👤',
      description: 'Manage your account settings and preferences.',
      questions: [
        {
          id: 'as-1',
          question: 'How do I reset my password?',
          answer: 'To reset your password, click on the "Forgot Password" link on the login page. Enter your email address, and we will send you a link to reset your password. Follow the instructions in the email to create a new password.'
        },
        {
          id: 'as-2',
          question: 'How do I update my profile information?',
          answer: 'Log in to your account and navigate to your profile page. Click on the "Edit" button to update your personal information, work experience, education, and skills. Remember to save your changes before leaving the page.'
        },
        {
          id: 'as-3',
          question: 'How do I delete my account?',
          answer: 'To delete your account, go to your profile settings and scroll to the bottom of the page. Click on "Delete Account" and confirm your decision. Please note that this action is irreversible, and all your data will be permanently deleted.'
        }
      ]
    },
    {
      id: 'job-applications',
      title: 'Job Applications',
      icon: '📝',
      description: 'Learn how to apply for jobs and track your applications.',
      questions: [
        {
          id: 'ja-1',
          question: 'How do I apply for a job?',
          answer: 'To apply for a job, click on the job listing to view the details. Then click the "Apply Now" button. Depending on the employer\'s preferences, you may need to fill out an application form, submit your resume, or be redirected to the company\'s website to complete the application.'
        },
        {
          id: 'ja-2',
          question: 'How do I track my job applications?',
          answer: 'Log in to your account and go to the "Applications" section of your profile. Here you can see all the jobs you\'ve applied for, the status of each application, and any messages from employers. Keep your contact information updated to ensure you don\'t miss any communications.'
        },
        {
          id: 'ja-3',
          question: 'Can I withdraw my application?',
          answer: 'Yes, you can withdraw your application for a job. Go to your "Applications" section, find the job you want to withdraw from, and click on the "Withdraw Application" button. Note that employers will be notified of your withdrawal.'
        }
      ]
    },
    {
      id: 'employer-help',
      title: 'For Employers',
      icon: '🏢',
      description: 'Post jobs and manage your company profile.',
      questions: [
        {
          id: 'eh-1',
          question: 'How do I post a job?',
          answer: 'After registering as an employer, click on the "Post a Job" button in the navigation menu. Fill in all the required information about the position, including title, description, requirements, and benefits. You can also specify application methods and screening questions.'
        },
        {
          id: 'eh-2',
          question: 'How do I manage applications?',
          answer: 'Log in to your employer account and go to the "Manage Jobs" section. Click on a job posting to see all applicants. You can review resumes, rate candidates, send messages, and update application statuses to keep track of your hiring process.'
        },
        {
          id: 'eh-3',
          question: 'How do I update my company profile?',
          answer: 'Go to your employer dashboard and click on "Company Profile." Here you can update your company logo, description, website, and other details. A complete and attractive company profile helps attract more qualified candidates.'
        }
      ]
    }
  ];

  // Find the active category
  const activeCategoryData = helpCategories.find(category => category.id === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      
      <Hero
        title="Help Center"
        subtitle="Find answers to common questions and get the support you need"
        showSearchBar={false}
      />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {helpCategories.map((category) => (
            <div
              key={category.id}
              className={`p-6 rounded-lg shadow-md cursor-pointer transition-all duration-200 ${
                activeCategory === category.id 
                  ? 'bg-[#309689] text-white transform scale-105' 
                  : 'bg-white hover:shadow-lg border border-gray-100'
              }`}
              onClick={() => {
                setActiveCategory(category.id);
                setActiveQuestion(null);
              }}
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-4xl mb-2">{category.icon}</span>
                <h3 className={`text-xl font-semibold ${activeCategory === category.id ? 'text-white' : 'text-gray-800'}`}>
                  {category.title}
                </h3>
                <p className={`mt-2 text-sm ${activeCategory === category.id ? 'text-white' : 'text-gray-600'}`}>
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-2">{activeCategoryData.icon}</span> 
            {activeCategoryData.title}
          </h2>
          
          <div className="mt-6 space-y-4">
            {activeCategoryData.questions.map((item) => (
              <div 
                key={item.id} 
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className={`w-full text-left p-4 font-medium flex justify-between items-center ${
                    activeQuestion === item.id ? 'bg-gray-50' : 'bg-white'
                  }`}
                  onClick={() => setActiveQuestion(activeQuestion === item.id ? null : item.id)}
                >
                  <span>{item.question}</span>
                  <span className="text-xl">{activeQuestion === item.id ? '−' : '+'}</span>
                </button>
                
                {activeQuestion === item.id && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Contact Support */}
        <div className="mt-8 bg-gradient-to-r from-[#309689] to-[#267b6c] rounded-lg shadow-md p-6 text-white">
          <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
          <p className="mb-4">Our support team is ready to assist you with any questions or concerns.</p>
          <a 
            href="/contact" 
            className="inline-block bg-white text-[#309689] font-medium px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HelpCenter;