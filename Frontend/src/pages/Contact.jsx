import React from "react";
import Hero from "../components/Hero";
import Footer from "../components/Footer"; // Import your existing Footer component

const ContactUs = () => {
  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Contact Us"
        subtitle="Get in touch with us for any inquiries."
        showSearchBar={false}
      />

      {/* Main Contact Section */}
      <section className="bg-[#309689] text-white py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: Info */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              You Will Grow, You Will Succeed. We Promise That
            </h2>
            <p className="text-white/90 leading-relaxed mb-6">
              Pellentesque felis nisi, fringilla nec risus. Suspendisse ultrices
              in lacus tristique tincidunt. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Etiam gravida molestie nunc nec
              pharetra.
            </p>
            <div className="space-y-4 text-sm">
              <p>
                <span className="font-semibold">Call for inquiry:</span> <br />
                888-389-6895
              </p>
              <p>
                <span className="font-semibold">Send us mail:</span> <br />
                <a
                  href="mailto:kramu@us.sbglobal.net"
                  className="underline hover:text-white"
                >
                  kramu@us.sbglobal.net
                </a>
              </p>
              <p>
                <span className="font-semibold">Opening hours:</span> <br />
                Mon - Fri: 10AM - 10PM
              </p>
              <p>
                <span className="font-semibold">Address:</span> <br />
                19 North Road Piscataway, NJ 08854
              </p>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="bg-white text-gray-800 rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
            <p className="text-sm text-gray-500 mb-4">
              Nibh dui faucibus pretium lobortis nunc.
            </p>
            <form className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#309689]"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#309689]"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  rows="4"
                  placeholder="Your message..."
                  className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#309689]"
                />
              </div>

              <button
                type="submit"
                className="bg-[#309689] text-white py-2 px-4 rounded hover:bg-[#267b6c] transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Bottom Info Section */}
      <section className="bg-white text-gray-800 py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-2">Job</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Quis enim pellentesque viverra fells sit amet dapibus. Morbi in
              congue eros. Quisque hendrerit velit sed.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Company</h3>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>About Us</li>
              <li>Careers</li>
              <li>Press & Media</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Job Categories</h3>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>Design</li>
              <li>Development</li>
              <li>Marketing</li>
              <li>Finance</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Newsletter</h3>
            <p className="text-sm text-gray-600 mb-3">
              Subscribe to our newsletter for the latest updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="rounded-l p-2 w-full text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#309689]"
              />
              <button className="bg-[#309689] text-white px-4 py-2 rounded-r hover:bg-[#267b6c] transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default ContactUs;
