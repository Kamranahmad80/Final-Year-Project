import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#309689] text-white">
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Job</h3>
            <p className="text-sm text-white/80 leading-relaxed mb-4">
              Discover a variety of job opportunities that match your skills and interests.
            </p>
            {/* Optional: Add social media links here */}
          </div>

          {/* Navigation */}
          <nav>
            <h3 className="font-semibold text-lg mb-2">Company</h3>
            <ul className="text-sm space-y-1 text-white/80">
              <li><Link to="/about" className="hover:underline">About Us</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
            </ul>
          </nav>

          {/* Resources */}
          <nav>
            <h3 className="font-semibold text-lg mb-2">Resources</h3>
            <ul className="text-sm space-y-1 text-white/80">
              <li><Link to="/help" className="hover:underline">Help Center</Link></li>
            </ul>
          </nav>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-white/60">
          <p>© {currentYear} Job Platform. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/terms" className="hover:underline">Terms of Service</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
