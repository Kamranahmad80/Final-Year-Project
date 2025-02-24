import React from 'react';
import Hero from '../components/Hero'
const Jobs = () => {
  return (
    <div>
      <Hero
        title="Explore Available Jobs"
        subtitle="Find the best opportunities based on your skills."
        showSearchBar={true}
      />
      {/* Other page content */}
    </div>
  );
};

export default Jobs;
