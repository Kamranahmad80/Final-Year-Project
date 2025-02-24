import { Link } from "react-router-dom";
import logo from "../assets/logo.png"
const Navbar = () => {
  return (
    <nav className="w-full flex justify-between items-center p-4 text-white z-50">
      {/* Logo & Website Name */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-10 w-10 mr-2" />
        <Link to="/" className="text-gray-700 text-xl font-semibold">Onjob</Link>
      </div>

      {/* Navigation Links */}
      <ul className="text-gray-600 flex space-x-5">
        <li><Link to="/" className=" hover:text-[#309689]">Home</Link></li>
        <li><Link to="/Jobs" className="hover:text-[#309689]">Jobs</Link></li>
        <li><Link to="/About" className="hover:text-[#309689]">About Us</Link></li>
        <li><Link to="/Contact" className="hover:text-[#309689]">Contact Us</Link></li>
      </ul>

      {/* Login, Register */}
      <div className=" flex space-x-4">
        <button className="bg-[#309689] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-[#267b6c] "><Link to="/Login">Login</Link></button>
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md cursor-pointer hover:bg-[#309689] hover:text-white"><Link to="/Signup">Register</Link></button>
      </div>
    </nav>
  );
};

export default Navbar;
