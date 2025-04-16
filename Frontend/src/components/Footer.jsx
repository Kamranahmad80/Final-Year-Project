import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#309689] text-white py-6">
      <section className="bg-[#309689] text-white py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-2">Job</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Discover a variety of job opportunities that match your skills and interests.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Company</h3>
            <ul className="text-sm space-y-1 text-white/80">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Resources</h3>
            <ul className="text-sm space-y-1 text-white/80">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/resume-tips">Resume Tips</Link></li>
              <li><Link to="/interview-guide">Interview Guide</Link></li>
              <li><Link to="/career-blog">Career Blog</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
