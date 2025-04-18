import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../config/axios";
import { FaEnvelope, FaCheckCircle, FaArrowLeft } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await api.post("/api/users/forgot-password", { email });
      setSuccess(true);
    } catch (error) {
      setError(
        error.response?.data?.message || 
        "An error occurred. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-50 to-blue-100 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg text-center">
          <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Password Reset Email Sent</h1>
          <p className="text-gray-600 mb-6">
            We've sent password reset instructions to <span className="font-medium">{email}</span>. 
            Please check your email inbox and follow the instructions to reset your password.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            If you don't see the email, check your spam folder or make sure the email address is correct.
          </p>
          <div className="flex flex-col space-y-3">
            <Link
              to="/login"
              className="py-2 px-4 bg-[#309689] text-white rounded-lg hover:bg-[#267b6c] transition-colors"
            >
              Return to Login
            </Link>
            <button 
              onClick={() => setSuccess(false)}
              className="py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password</h1>
          <p className="text-gray-600">Enter your email to receive reset instructions</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Forgot Password Form */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#309689] focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-[#309689] hover:bg-[#267b6c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#309689] transition-colors duration-200 ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Sending..." : "Send Reset Instructions"}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-medium text-[#309689] hover:text-[#267b6c]"
            >
              <FaArrowLeft className="mr-1" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 