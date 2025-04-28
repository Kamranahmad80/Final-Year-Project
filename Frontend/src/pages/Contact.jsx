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
      <section className="bg-white text-gray-800 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: Info */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
              We're Here To Help You Succeed
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Whether you have questions about our services or need assistance, our team is ready to help you on your career journey.
            </p>
            <div className="space-y-4 text-sm p-6 bg-gray-50 rounded-lg border border-gray-100">
              <p>
                <span className="font-semibold text-[#309689]">Call for inquiry:</span> <br />
                888-389-6895
              </p>
              <p>
                <span className="font-semibold text-[#309689]">Send us mail:</span> <br />
                <a
                  href="mailto:reachonjob@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  reachonjob@gmail.com
                </a>
              </p>
              <p>
                <span className="font-semibold text-[#309689]">Opening hours:</span> <br />
                Mon - Fri: 8AM - 10PM
              </p>
              <p>
                <span className="font-semibold text-[#309689]">Address:</span> <br />
                Mingora , swat 198200
              </p>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Contact Info</h3>
            <p className="text-sm text-gray-500 mb-4">
              Fill out the form below and we'll get back to you shortly.
            </p>
            <form action="https://formsubmit.co/reachonjob@gmail.com" method="POST" className="space-y-4">
              {/* FormSubmit hidden fields */}
              <input type="hidden" name="_subject" value="New Contact Form Submission" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_next" value="https://yourdomain.com/thank-you" />
              <input type="hidden" name="_template" value="table" />
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your first name"
                  className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#309689]"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#309689]"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  rows="4"
                  name="message"
                  placeholder="Your message..."
                  className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#309689]"
                  required
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

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default ContactUs;
