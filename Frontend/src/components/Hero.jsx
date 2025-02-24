import React from 'react';
import Navbar from './Navbar';
import SearchBar from './SearchBar';

const Hero = ({ showSearchBar = false, title, subtitle }) => {
  return (
    <section className=" min-h-screen bg-blue-200 bg-cene relative">
      {/* Navbar inside Hero */}
      <Navbar />
      
      {/* Hero Content */}
      <div className="relative text-center z-10 mt-20">
        <h1 className="text-4xl md:text-6xl font-bold">{title}</h1>
        <p className="mt-4 text-lg">{subtitle}</p>

        {/* Conditionally render SearchBar */}
        {showSearchBar && <SearchBar />}
      </div>
    </section>
  );
};

export default Hero;
