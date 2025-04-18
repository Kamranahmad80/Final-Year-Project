import React, { useState } from 'react';
import Footer from '../components/Footer';
import Hero from '../components/Hero';

const CareerBlog = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'career-development', name: 'Career Development' },
    { id: 'interviews', name: 'Interview Tips' },
    { id: 'remote-work', name: 'Remote Work' },
    { id: 'skill-development', name: 'Skill Development' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "How to Navigate Your Career Path in 2024",
      date: "March 15, 2024",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      excerpt: "Discover strategies for planning and advancing your career journey effectively in today's rapidly changing job market.",
      category: "career-development",
      author: "Sarah Johnson",
      authorRole: "Career Coach",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "10 Remote Work Best Practices for Productivity",
      date: "March 12, 2024",
      image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
      excerpt: "Learn how to stay productive and maintain work-life balance while working remotely, with practical tips from experienced remote workers.",
      category: "remote-work",
      author: "Michael Chen",
      authorRole: "Remote Work Consultant",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Networking in the Digital Age: Building Relationships Online",
      date: "March 10, 2024",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
      excerpt: "Tips for building and maintaining professional relationships in today's digital world, from LinkedIn strategies to virtual networking events.",
      category: "career-development",
      author: "Emily Parker",
      authorRole: "Networking Specialist",
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "Top 5 Skills That Will Matter Most in 2024",
      date: "March 8, 2024",
      image: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      excerpt: "Stay ahead of the curve by developing these in-demand professional skills that employers are actively seeking in today's competitive job market.",
      category: "skill-development",
      author: "David Wilson",
      authorRole: "Talent Acquisition Manager",
      readTime: "8 min read"
    },
    {
      id: 5,
      title: "Mastering the Art of Job Interviews: Preparation Guide",
      date: "March 5, 2024",
      image: "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      excerpt: "Comprehensive guide to preparing for job interviews, from researching the company to practicing your responses and following up effectively.",
      category: "interviews",
      author: "Jessica Martinez",
      authorRole: "HR Director",
      readTime: "10 min read"
    },
    {
      id: 6,
      title: "How to Create a Personal Brand That Stands Out",
      date: "March 1, 2024",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      excerpt: "Learn how to develop and communicate your personal brand to make a lasting impression on employers and stand out in a crowded job market.",
      category: "career-development",
      author: "Robert Zhang",
      authorRole: "Personal Branding Expert",
      readTime: "7 min read"
    }
  ];

  // Filter posts based on active category
  const filteredPosts = activeCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      
      <Hero
        title="Career Blog"
        subtitle="Insights and advice to help you grow in your professional journey"
        showSearchBar={false}
      />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id 
                  ? 'bg-[#309689] text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Featured Post (first post) */}
        {filteredPosts.length > 0 && (
          <div className="mb-12">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="md:flex">
                <div className="md:flex-shrink-0 md:w-1/2">
                  <img 
                    className="h-64 w-full object-cover md:h-full" 
                    src={filteredPosts[0].image} 
                    alt={filteredPosts[0].title} 
                  />
                </div>
                <div className="p-8 md:w-1/2">
                  <div className="uppercase tracking-wide text-sm text-[#309689] font-semibold">
                    {categories.find(c => c.id === filteredPosts[0].category)?.name}
                  </div>
                  <h2 className="mt-2 text-2xl font-bold text-gray-800 leading-tight">
                    {filteredPosts[0].title}
                  </h2>
                  <p className="mt-4 text-gray-600">{filteredPosts[0].excerpt}</p>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <span className="inline-block h-10 w-10 rounded-full bg-[#309689] text-white text-center leading-10 font-bold">
                        {filteredPosts[0].author.split(' ')[0][0]}{filteredPosts[0].author.split(' ')[1][0]}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{filteredPosts[0].author}</p>
                      <div className="flex text-sm text-gray-500">
                        <span>{filteredPosts[0].date}</span>
                        <span className="mx-1">&middot;</span>
                        <span>{filteredPosts[0].readTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#309689] hover:bg-[#267b6c] transition-colors">
                      Read Article
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Blog Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.slice(1).map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img className="h-full w-full object-cover" src={post.image} alt={post.title} />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-[#309689] bg-opacity-90 text-white">
                    {categories.find(c => c.id === post.category)?.name}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="inline-block h-8 w-8 rounded-full bg-[#309689] text-white text-center text-xs leading-8 font-bold">
                      {post.author.split(' ')[0][0]}{post.author.split(' ')[1][0]}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">{post.readTime}</span>
                  </div>
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>
                <button className="mt-4 text-[#309689] hover:text-[#267b6c] font-medium text-sm flex items-center">
                  Read more 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl text-gray-600">No articles found in this category.</h3>
            <button 
              onClick={() => setActiveCategory('all')} 
              className="mt-4 text-[#309689] hover:text-[#267b6c] font-medium"
            >
              View all posts
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CareerBlog; 