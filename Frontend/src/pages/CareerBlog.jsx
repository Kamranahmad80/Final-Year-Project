import React from 'react';

const CareerBlog = () => {
  const blogPosts = [
    {
      title: "How to Navigate Your Career Path",
      date: "March 15, 2024",
      excerpt: "Discover strategies for planning and advancing your career journey effectively.",
      category: "Career Development"
    },
    
    {
      title: "Remote Work Best Practices",
      date: "March 12, 2024",
      excerpt: "Learn how to stay productive and maintain work-life balance while working remotely.",
      category: "Work Life"
    },
    {
      title: "Networking in the Digital Age",
      date: "March 10, 2024",
      excerpt: "Tips for building and maintaining professional relationships in today's digital world.",
      category: "Networking"
    },
    {
      title: "Skills That Will Matter in 2024",
      date: "March 8, 2024",
      excerpt: "Stay ahead of the curve by developing these in-demand professional skills.",
      category: "Skill Development"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Career Blog</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Insights and advice to help you grow in your career
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {blogPosts.map((post, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500">{post.date}</span>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">{post.title}</h2>
              <p className="mt-3 text-gray-600">{post.excerpt}</p>
              <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium">
                Read more →
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            View All Posts
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareerBlog; 