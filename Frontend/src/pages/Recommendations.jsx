import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RecommendationCard from "../components/RecommendationCard";
import api from "../config/axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasResume, setHasResume] = useState(true);
  const [isAIRecommendation, setIsAIRecommendation] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/api/recommendations');
        
        setRecommendations(data.recommendations || []);
        setHasResume(data.hasResume);
        setIsAIRecommendation(data.isAIRecommendation || false);
        
        if (data.message) {
          toast.info(data.message);
        }
      } catch (err) {
        if (err.response?.status === 400 && err.response.data?.hasResume === false) {
          setHasResume(false);
          setError('Please upload your resume to get personalized recommendations');
        } else {
          setError(err.response?.data?.message || 'Failed to load recommendations');
          toast.error(err.response?.data?.message || 'Failed to load recommendations');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={5000} />
      <Navbar />
      
      <section className="bg-green-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
            AI-Powered Job Recommendations
          </h1>
          <p className="text-gray-600 text-center mt-3 max-w-2xl mx-auto">
            {isAIRecommendation 
              ? "Our AI has analyzed your resume and experience to find the perfect job matches for you."
              : "Discover jobs that match your skills and experience based on your profile."}
          </p>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#309689]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <h3 className="text-xl text-red-500">{error}</h3>
              {!hasResume && (
                <div className="mt-6">
                  <p className="mb-4 text-gray-600">Upload your resume to get personalized job recommendations!</p>
                  <Link
                    to="/employee-profile"
                    className="inline-block bg-[#309689] hover:bg-[#267b70] text-white px-6 py-3 rounded-md font-medium"
                  >
                    Go to Profile
                  </Link>
                </div>
              )}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-xl text-gray-600">No recommendations found</h3>
              <p className="mt-2 text-gray-500">
                We couldn't find any job matches for your profile at this time.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/jobs"
                  className="inline-block bg-[#309689] hover:bg-[#267b70] text-white px-6 py-3 rounded-md font-medium"
                >
                  Browse All Jobs
                </Link>
                <Link
                  to="/employee-profile"
                  className="inline-block bg-white hover:bg-gray-50 text-[#309689] border border-[#309689] px-6 py-3 rounded-md font-medium"
                >
                  Update Profile
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isAIRecommendation ? "AI-Recommended Jobs" : "Recommended Jobs"}
                </h2>
                <Link
                  to="/jobs"
                  className="text-[#309689] hover:text-[#267b70] font-medium"
                >
                  Browse All Jobs →
                </Link>
              </div>
              
              {recommendations.map((job) => (
                <RecommendationCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Recommendations;
