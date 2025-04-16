import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = ({ isTransparent = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

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
  };

  // Get navigation items based on auth status
  const getNavItems = () => {
    const commonItems = [
      { to: "/", label: "Home" },
      { to: "/jobs", label: "Jobs" },
      { to: "/about", label: "About Us" },
      { to: "/contact", label: "Contact Us" },
    ];

    if (userInfo) {
      // Add authenticated user specific nav items
      if (userInfo.role === "employer") {
        commonItems.push({ to: "/post-job", label: "Post a Job" });
      }
    }

    return commonItems;
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

      {/* Navigation Links */}
      <ul className="flex space-x-5">
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
          <div className="flex items-center gap-4">
            <Link
              to={userInfo.role === "employer" ? "/employer-profile" : "/employee-profile"}
              className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-90"
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
              <span className={`${isTransparent ? 'text-white' : 'text-gray-700'} font-medium`}>
                {userInfo.name}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-500 transition-colors duration-200"
            >
              Logout
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
                } px-4 py-2 rounded-md transition-all duration-200 hover:shadow-md`}
            >
              Register
            </Link>
          </>
        )}
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
