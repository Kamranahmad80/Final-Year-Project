import React from 'react';
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import heroBg from '../assets/hero-bg.avif';

const Hero = ({ showSearchBar = false, title, subtitle, onSearch }) => {
  return (
    <section 
      className="relative min-h-[80vh] bg-[#1a1a1a] overflow-hidden" 
    >
      {/* Background image with strong blur effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-md"
        style={{ 
          backgroundImage: `url(${heroBg})`,
          transform: 'scale(1.1)' // Prevent blur edges from showing
        }}
      ></div>
      
      {/* Gradient overlay for better readability */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 z-10"
      ></div>
      
      {/* Content */}
      <div className="relative z-20">
        <Navbar isTransparent={true} />
        
        <div className="container mx-auto px-4 pt-24 pb-16 flex flex-col items-center justify-center min-h-[calc(80vh-4rem)] text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl drop-shadow-lg">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl drop-shadow">
            {subtitle}
          </p>
          
          {showSearchBar && (
            <div className="w-full max-w-3xl mx-auto transform transition-all duration-300 hover:scale-[1.02]">
              <SearchBar onSearch={onSearch} />
            </div>
          )}
          
          {/* Stats section with glass effect */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 text-white">
            <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="text-3xl font-bold">1000+</div>
              <div className="text-white/90 text-sm md:text-base">Active Jobs</div>
            </div>
            <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-white/90 text-sm md:text-base">Companies</div>
            </div>
            <div className="col-span-2 md:col-span-1 bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="text-3xl font-bold">50k+</div>
              <div className="text-white/90 text-sm md:text-base">Job Seekers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
