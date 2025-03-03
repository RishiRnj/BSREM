import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthProxy = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get("token");
    
    if (!token) {
      console.warn("No token in URL. Checking session storage...");
      token = localStorage.getItem("token");
    }

    if (token) {
      try {
        const decodedUser = jwtDecode(token); // Decode token
        localStorage.setItem("token", token); // Ensure token is stored
        localStorage.setItem("user", JSON.stringify(decodedUser));

        console.log("Token stored successfully:", token);
        console.log("Decoded user:", decodedUser);

        // Redirect to the intended page or fallback to a default (forum) but in not worked shows error          
        // navigate("/forum"); // Redirect to forum (works)
        // Redirect user to previous page or fallback to "/forum"
        const redirectPath = localStorage.getItem("redirectAfterLogin") || "/forum";
        
        navigate(redirectPath);
        // localStorage.removeItem("redirectAfterLogin"); // Clear after use
       

        
      } catch (error) {
        console.error("Invalid token:", error);
        alert("Authentication failed. Redirecting to login.");
        navigate("/"); // Redirect to login on error
      }
    } else {
      console.error("No token found in URL or session storage.");
      alert("Authentication failed. Redirecting to login.");
      navigate("/"); // Redirect to login
    }
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: `calc(100vh - 65px)`
    }}>

      <h2>Authenticating...</h2>
      <p>Please wait while we checking your login information!</p>
    </div>
  );
};

export default AuthProxy;

