import { Link } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const Signup = () => {
  const handleGoogleSignup = (response) => {
    console.log("Google signup successful:", response);
    // You can send the response to your backend for further processing
  };

  return (
    <GoogleOAuthProvider clientId="362028126265-2d0v7ddnmg97r3hoanvj89qusdp9kjdn.apps.googleusercontent.com">
      <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Create an Account</h2>

          {/* Signup Form */}
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Full Name</label>
              <input 
                type="text" 
                placeholder="Enter your name" 
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Email Address</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Password</label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Confirm Password</label>
              <input 
                type="password" 
                placeholder="Confirm your password" 
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200"
            >
              Sign Up
            </button>
          </form>

          {/* Sign Up with Google */}
          <div className="text-center my-4 text-gray-500">or</div>
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={() => console.log("Google Signup Failed")}
            />
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-4">
            Already have an account? 
            <Link to="/login" className="text-blue-600 font-semibold hover:underline"> Login here</Link>
          </p>
        </div>
      </section>
    </GoogleOAuthProvider>
  );
};

export default Signup;
