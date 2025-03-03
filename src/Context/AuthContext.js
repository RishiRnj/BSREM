import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate, Navigate  } from "react-router-dom";
import { handleError } from '../Components/Util';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Null means not logged in
  const [loading, setLoading] = useState(false);  
  const navigate = useNavigate();
  

  

  // Simulate login (replace with API call)
  
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      setLoading(false);
  
      if (response.ok) {
        const { token } = data;
        localStorage.setItem("token", token);
        const decodedUser = jwtDecode(token); // Decode the token
        setUser(decodedUser); // Save user in state
        localStorage.setItem("user", JSON.stringify(decodedUser)); // Save user in local storage
  
        console.log("Login successful. Token and user set:");
        console.log("Token:", token);
        console.log("Decoded User:", decodedUser);
      } else {
        console.error("Login failed. Response:", data.message);
        handleError(data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
      setLoading(false);
    }
  };
  



  // Simulate Google Login
  const googleLogin = async () => {
    setLoading(true); // Show the spinner
    try {
      console.log('Logging in with Google');
      window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
    } catch (error) {
      console.error('Error during Google login:', error);
      setLoading(false); // Hide spinner if there's an error
      alert('Unable to log in with Google. Please try again later.');
    }
  };
  
  

  // Logout
  const logout = () => {
    <Navigate to='/joinUs' replace/>
    console.log("Logging out. Clearing session and local storage.");
    setUser(null);    
    localStorage.removeItem("user");    
    localStorage.removeItem("token");    
  };
 
    
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        const currentTime = Date.now() / 1000;
  
        if (decodedUser.exp > currentTime) {
          setUser(decodedUser); // Set user details
          //navigate("/forum"); // Navigate to forum page
        } else {
          console.error("Token expired. Clearing session.");
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);
  

  return (
    <AuthContext.Provider value={{ user, login, googleLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
