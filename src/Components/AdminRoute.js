import React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const AdminRoute = ({ user, children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    console.error("No token found. Redirecting to login.");
    localStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login" replace  />;
  }  

  try {
    const decodedUser = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedUser.exp < currentTime) {
      console.error("Token expired. Redirecting to login.");
      localStorage.removeItem("token");
      localStorage.setItem("redirectAfterLogin", location.pathname);
      return <Navigate to="/login" replace  />;
    }

    if (decodedUser.role !== 'admin') {
        // Redirect to unauthorized page if user is not an admin
        console.log("amid", decodedUser);
        
        return <Navigate to="/unauthorized" />;
      } 

    return children; // Token is valid, render the children
  } catch (error) {
    console.error("Invalid token. Redirecting to login:", error);
    localStorage.removeItem("token");
    localStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login" replace  />;
  }


  
};

export default AdminRoute;
