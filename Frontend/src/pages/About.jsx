import React from 'react';
import Hero from '../components/Hero';

const About = () => {
  return (
    <>
      <Hero
        title="About Us"
        subtitle="We leverage AI-driven solutions to bridge the gap between job seekers and employers, making job searching smarter, faster, and more efficient."
        showSearchBar={false}
      />
      
      <div className="max-w-6xl mx-auto p-6 bg-blue-200">
        {/* Mission Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800">Our Mission</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We empower job seekers with AI-driven job recommendations, bridging the gap between talent and opportunity.
          </p>
        </section>

        {/* Core Values - Cards */}
        <section className="mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800 text-center">Our Core Values</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Integrity', description: 'We uphold the highest ethical standards.' },
              { title: 'Innovation', description: 'We leverage cutting-edge AI technology.' },
              { title: 'Inclusivity', description: 'Connecting diverse talents to equal opportunities.' },
              { title: 'Commitment', description: 'We support job seekers in their career journey.' },
              { title: 'Transparency', description: 'Building trust through clear communication.' },
              { title: 'Excellence', description: 'Striving for the highest quality solutions.' },
            ].map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center">
                <h3 className="text-2xl font-semibold text-gray-800">{value.title}</h3>
                <p className="mt-3 text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold text-gray-800">Our Story</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Founded in 2025, we set out to simplify job searching using AI-driven recommendations, ensuring professionals find their perfect fit.
          </p>
        </section>

        {/* Meet the Team */}
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold text-gray-800">Meet the Team</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Kamran Ahmed', role: 'Founder & CEO', imageUrl: '/images/kamran.jpg' },
              { name: 'Amir Bilal', role: 'CTO', imageUrl: '/images/amir.jpg' },
              { name: 'Rahul Singh', role: 'Head of Marketing', imageUrl: '/images/rahul.jpg' },
            ].map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center">
                <img src={member.imageUrl} alt={member.name} className="w-24 h-24 mx-auto rounded-full object-cover" />
                <h3 className="mt-4 text-xl font-bold text-gray-800">{member.name}</h3>
                <p className="mt-2 text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mt-12">
          <h2 className="text-4xl font-extrabold text-gray-800">Join Us</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you're a job seeker or an employer, we're here to help. Explore our platform and unlock new opportunities.
          </p>
          <button className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Get Started
          </button>
        </section>
      </div>
    </>
  );
};

export default About;
