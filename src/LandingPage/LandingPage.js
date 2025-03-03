import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';



import BackgroundVideo from './BackgroundVideo';
import LoginCard from './LoginCard';
import RegisterModal from './RegisterModal';
import { ToastContainer } from 'react-toastify';

function LandingPage() {
  const [showRegister, setShowRegister] = useState(false);

  const handleRegisterClick = () => setShowRegister(true);
  const handleCloseRegister = () => setShowRegister(false);
  const navigate = useNavigate();
  
  

  
  useEffect(() => {
    // Check if the token exists in localStorage (indicating the user is already logged in)
    const token = localStorage.getItem("token");
    if (token) {
      // If the user is already logged in, redirect to the homepage or dashboard
      navigate("/forum"); // Or any other page you want the user to land on after login
    }
  }, [navigate]);
  
  

  return (
    <div className="landing-page">
      <BackgroundVideo />
      <ToastContainer autoClose={2000} />
      <div className="content">
        <LoginCard onRegisterClick={handleRegisterClick} />
      </div>
      <RegisterModal show={showRegister} onClose={handleCloseRegister} />
      
    </div>
  );
}

export default LandingPage;
