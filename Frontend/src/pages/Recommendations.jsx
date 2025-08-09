import { useState } from "react";
import Hero from "../components/Hero";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";

const Recommendations = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [jobs, setJobs] = useState([]);

  const handleGetRecommendations = async () => {
    const token = localStorage.getItem("token");
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

    if (!token) {
      alert("Please login first to get recommendations.");
      return;
    }

    setLoading(true);
    setCategories([]);
    setJobs([]);

    try {
      const res = await fetch("http://localhost:5000/api/recommend", {
        method: "GET",
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle specific error cases
        if (data.code === 'UPLOAD_RESUME_FIRST' || data.code === 'REUPLOAD_RESUME') {
          const shouldUpload = window.confirm(
            data.message + " Would you like to upload one now?"
          );
          if (shouldUpload) {
            window.location.href = "/employee-profile";
          }
          return;
        }
        throw new Error(data.message || "Failed to fetch recommendations");
      }

      // If we get here, we have successful recommendations
      setCategories(data.categories || []);
      setJobs(data.jobs || []);
      
      if ((!data.categories || data.categories.length === 0) && (!data.jobs || data.jobs.length === 0)) {
        alert("No recommendations found based on your resume. Try updating your resume with more details.");
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      alert(`Error: ${err.message || "Failed to get recommendations. Please try again later."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Hero
        title="Get AI Job Recommendations"
        subtitle="Receive smart job matches based on your uploaded resume."
      />

      <section className="max-w-4xl mx-auto px-4 py-8 text-center">
        <button
          onClick={handleGetRecommendations}
          className="bg-[#309689] text-white px-6 py-3 rounded hover:bg-[#267b70]"
          disabled={loading}
        >
          {loading ? "Finding Matches..." : "Get My Recommendations"}
        </button>


        {Array.isArray(jobs) && jobs.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-4">Recommended Jobs</h3>
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Recommendations;
