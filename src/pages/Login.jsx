import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = (response) => {
    console.log('Google login successful:', response);
    // You can send the response to your backend for further processing
  };

  return (
    <GoogleOAuthProvider clientId="362028126265-2d0v7ddnmg97r3hoanvj89qusdp9kjdn.apps.googleusercontent.com">
      <div className="flex justify-center items-center min-h-screen bg-blue-200">
        <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <form className="mt-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button type="submit" className="w-full p-3 mt-4 bg-blue-500 text-white rounded-lg">
              Login
            </button>
            
            {/* Google Login */}
            <div className="mt-6 text-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => console.log('Login Failed')}
                useOneTap
              />
            </div>
          </form>
          
          {/* Register Now Button */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Don't have an account?</p>
            <button 
              onClick={() => navigate('/signup')} 
              className="mt-2 text-blue-500 hover:underline"
            >
              Register Now
            </button>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;