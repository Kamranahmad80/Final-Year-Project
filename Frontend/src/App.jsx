import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EmployeeProfile from './pages/EmployeeProfile';
import EmployerProfile from './pages/EmployerProfile';
import About from './pages/About';
import Contact from './pages/Contact';
import HelpCenter from './pages/HelpCenter';
import ResumeTips from './pages/ResumeTips';
import InterviewGuide from './pages/InterviewGuide';
import CareerBlog from './pages/CareerBlog';

function App() {
  return (
    <>
      {/* You may include your Header or Navbar here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/employee-profile" element={<EmployeeProfile />} />
        <Route path="/employer-profile" element={<EmployerProfile />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/resume-tips" element={<ResumeTips />} />
        <Route path="/interview-guide" element={<InterviewGuide />} />
        <Route path="/career-blog" element={<CareerBlog />} />
      </Routes>
    </>
  );
}

export default App;
