import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = ({ isTransparent = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Retrieve user info from localStorage, if available
  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  // Function to generate a fallback avatar (first letter of the name)
  const getInitialAvatar = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  // Function to check if the link is active
  const isActive = (path) => location.pathname === path;

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
    setSidebarOpen(false);
  };

  // Get navigation items based on auth status
  const getNavItems = () => {
    const commonItems = [
      { to: "/", label: "Home" },
      { to: "/jobs", label: "Jobs" },
      // Only show Recommendations if user is logged in
      ...(userInfo ? [{ to: "/recommendations", label: "For You" }] : []),
      { to: "/about", label: "About Us" },
      { to: "/contact", label: "Contact Us" },
    ];

    return commonItems;
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when a link is clicked
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <nav className={`w-full flex justify-between items-center p-4 z-50 ${isTransparent ? 'absolute top-0 left-0 right-0' : 'bg-white shadow-sm'}`}>
      {/* Logo & Website Name */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-10 w-10 mr-2" />
        <Link to="/" className={`text-xl font-semibold transition-colors duration-200 ${isTransparent ? 'text-white hover:text-white/90' : 'text-gray-700 hover:text-[#309689]'}`}>
          Onjob
        </Link>
      </div>

      {/* Navigation Links - Hidden on Mobile */}
      <ul className="hidden lg:flex space-x-5">
        {getNavItems().map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            label={item.label}
            isActive={isActive}
            isTransparent={isTransparent}
          />
        ))}
      </ul>

      {/* Right Side: Profile or Auth Buttons */}
      <div className="flex items-center space-x-4">
        {userInfo ? (
          <div className="flex items-center gap-2">
            <Link
              to={userInfo.role === "employer" ? "/employer-profile" : "/employee-profile"}
              className="flex items-center gap-1 transition-opacity duration-200 hover:opacity-90"
            >
              {userInfo.photo ? (
                <img
                  src={userInfo.photo}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#309689]"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#309689] flex items-center justify-center text-white font-semibold border-2 border-[#309689]">
                  {getInitialAvatar(userInfo.name)}
                </div>
              )}
              <span className={`${isTransparent ? 'text-white' : 'text-gray-700'} font-medium hidden sm:block`}>
                {userInfo.name}
              </span>
            </Link>
            {/* Only show logout button on desktop */}
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-500 transition-colors duration-200 hidden lg:block"
            >
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <>
            <Link 
              to="/login" 
              className="bg-[#309689] text-white px-4 py-2 rounded-md transition-all duration-200 hover:bg-[#267b6c] hover:shadow-md"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className={`${
                isTransparent 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'bg-gray-200 text-gray-800 hover:bg-[#309689] hover:text-white'
                } px-4 py-2 rounded-md transition-all duration-200 hover:shadow-md hidden sm:block`}
            >
              Register
            </Link>
          </>
        )}

        {/* Hamburger Menu for Mobile */}
        <button 
          className="lg:hidden text-gray-600 hover:text-[#309689] focus:outline-none"
          onClick={toggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar - Positioned on right side now */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      >
        <div 
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <img src={logo} alt="Logo" className="h-8 w-8 mr-2" />
                <span className="text-lg font-semibold text-gray-800">Onjob</span>
              </div>
              <button 
                className="text-gray-600 hover:text-[#309689] focus:outline-none"
                onClick={closeSidebar}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Profile Info in Sidebar */}
            {userInfo && (
              <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
                {userInfo.photo ? (
                  <img
                    src={userInfo.photo}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#309689]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#309689] flex items-center justify-center text-white font-semibold border-2 border-[#309689]">
                    {getInitialAvatar(userInfo.name)}
                  </div>
                )}
                <div className="ml-3">
                  <p className="font-medium text-gray-800">{userInfo.name}</p>
                  <p className="text-sm text-gray-500">{userInfo.email}</p>
                </div>
              </div>
            )}
            
            <ul className="space-y-4">
              {getNavItems().map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`block py-2 px-4 rounded-md transition-colors ${
                      isActive(item.to) 
                        ? 'bg-[#309689]/10 text-[#309689] font-semibold' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={closeSidebar}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {!userInfo ? (
                <li>
                  <Link 
                    to="/signup" 
                    className="block py-2 px-4 mt-2 text-center bg-[#309689] text-white rounded-md hover:bg-[#267b6c]"
                    onClick={closeSidebar}
                  >
                    Register
                  </Link>
                </li>
              ) : (
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full block py-2 px-4 mt-2 text-left rounded-md text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </div>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Reusable NavItem Component for Clean Code
const NavItem = ({ to, label, isActive, isTransparent }) => {
  const active = isActive(to);
  
  return (
    <li>
      <Link
        to={to}
        className={`relative font-medium transition-all duration-200 group ${
          active 
            ? `${isTransparent ? 'text-white font-semibold' : 'text-[#309689] font-semibold'}`
            : `${isTransparent ? 'text-white/90' : 'text-gray-600'}`
        }`}
      >
        {label}
        <span 
          className={`absolute left-0 bottom-0 w-full h-[2px] transition-all duration-200 transform origin-left
            ${active 
              ? `scale-x-100 ${isTransparent ? 'bg-white' : 'bg-[#309689]'}` 
              : 'scale-x-0 group-hover:scale-x-100'} 
            ${isTransparent ? 'bg-white/90' : 'bg-[#309689]'}`
          }
        ></span>
      </Link>
    </li>
  );
};

export default Navbar;
