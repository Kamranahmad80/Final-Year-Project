import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import logo from "../assets/logo.png";

const Navbar = ({ isTransparent = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || null
  );

  // 🔄 Check auth state on mount and listen for changes
  useEffect(() => {
    // Initial check
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("userInfo");
      
      // If there's a token but no user info, clear the token (inconsistent state)
      if (token && !storedUser) {
        localStorage.removeItem("token");
        setUserInfo(null);
        return;
      }
      
      // If there's user info, parse it
      if (storedUser) {
        try {
          setUserInfo(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing user info:", e);
          localStorage.removeItem("userInfo");
          localStorage.removeItem("token");
          setUserInfo(null);
        }
      } else {
        setUserInfo(null);
      }
    };

    // Check auth immediately
    checkAuth();

    // Listen for storage events (from other tabs/windows)
    const handleStorageChange = () => checkAuth();
    window.addEventListener("storage", handleStorageChange);

    // Also listen for our custom auth event (from same tab)
    window.addEventListener('auth', checkAuth);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener('auth', checkAuth);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  const getInitialAvatar = (name) => (name ? name.charAt(0).toUpperCase() : "");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('auth'));
    navigate("/login");
  };

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/jobs", label: "Jobs" },
    ...(userInfo ? [{ to: "/recommendations", label: "For You" }] : []),
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },
  ];

  return (
    <nav
      className={`w-full flex justify-between items-center p-4 z-50 ${
        isTransparent ? "absolute top-0 left-0 right-0" : "bg-white shadow-sm"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-10 w-10 mr-2" />
        <Link
          to="/"
          className={`text-xl font-semibold ${
            isTransparent
              ? "text-white hover:text-white/90"
              : "text-gray-700 hover:text-[#309689]"
          }`}
        >
          Onjob
        </Link>
      </div>

      {/* Nav links - desktop */}
      <ul className="hidden lg:flex space-x-5">
        {navItems.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className={`transition-colors duration-200 font-medium ${
                isActive(item.to)
                  ? isTransparent
                    ? "text-white font-semibold"
                    : "text-[#309689] font-semibold"
                  : isTransparent
                  ? "text-white/90"
                  : "text-gray-600"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right side - auth or profile */}
      <div className="flex items-center space-x-4">
        {userInfo ? (
          <div className="flex items-center gap-2">
            <Link
              to={
                userInfo.role === "employer"
                  ? "/employer-profile"
                  : "/employee-profile"
              }
              className="flex items-center gap-2"
            >
              {userInfo.photo ? (
                <img
                  src={userInfo.photo}
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#309689]"
                  alt="Profile"
                />
              ) : (
                <div className="w-8 h-8 bg-[#309689] text-white rounded-full flex items-center justify-center font-semibold border-2 border-[#309689]">
                  {getInitialAvatar(userInfo.name)}
                </div>
              )}
              <span
                className={`hidden sm:block font-medium ${
                  isTransparent ? "text-white" : "text-gray-800"
                }`}
              >
                {userInfo.name}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-500 transition-colors hidden lg:block"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-[#309689] text-white px-4 py-2 rounded-md hover:bg-[#267b6c]"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`${
                isTransparent
                  ? "bg-white/20 text-white hover:bg-white/30"
                  : "bg-gray-200 text-gray-800 hover:bg-[#309689] hover:text-white"
              } px-4 py-2 rounded-md transition duration-200 hidden sm:block`}
            >
              Register
            </Link>
          </>
        )}

        {/* Hamburger for mobile */}
        <button
          className="lg:hidden text-gray-600"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="fixed top-0 right-0 h-full w-64 bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between mb-6">
              <div className="text-xl font-bold">Onjob</div>
              <button onClick={() => setSidebarOpen(false)}>✕</button>
            </div>

            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`block py-2 px-4 rounded-md ${
                      isActive(item.to)
                        ? "bg-[#309689]/10 text-[#309689] font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {userInfo ? (
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-500 hover:bg-red-50 px-4 py-2 rounded-md"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="block py-2 px-4 text-center bg-[#309689] text-white rounded-md"
                      onClick={() => setSidebarOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      className="block py-2 px-4 text-center bg-gray-200 text-gray-800 rounded-md"
                      onClick={() => setSidebarOpen(false)}
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  isTransparent: PropTypes.bool,
};

export default Navbar;
