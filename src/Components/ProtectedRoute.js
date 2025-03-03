// //ProtectedRoute
// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import {jwtDecode} from "jwt-decode";

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   const location = useLocation();

//   if (!token) {
//     console.error("No token found. Redirecting to login.");
//     return <Navigate to="/login" replace state={{ from: location.pathname }} />;
//   }

//   try {
//     const decodedUser = jwtDecode(token);
//     const currentTime = Date.now() / 1000;

//     if (decodedUser.exp < currentTime) {
//       console.error("Token expired. Redirecting to login.");
//       localStorage.removeItem("token");
//       return <Navigate to="/login" replace state={{ from: location.pathname }} />;
//     }

//     return children; // Token is valid, render the children
//   } catch (error) {
//     console.error("Invalid token. Redirecting to login:", error);
//     localStorage.removeItem("token");
//     return <Navigate to="/login" replace state={{ from: location.pathname }} />;
//   }
// };

// export default ProtectedRoute;

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    console.warn("No token found. Redirecting to login.");

    // Store the attempted path before redirecting
    localStorage.setItem("redirectAfterLogin", location.pathname);

    return <Navigate to="/login" replace />;
  }

  try {
    const decodedUser = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedUser.exp < currentTime) {
      console.error("Token expired. Redirecting to login.");
      localStorage.removeItem("token");

      // Store the attempted path before redirecting
      localStorage.setItem("redirectAfterLogin", location.pathname);

      return <Navigate to="/login" replace />;
    }

    return children; // Token is valid, render the protected page
  } catch (error) {
    console.error("Invalid token. Redirecting to login:", error);
    localStorage.removeItem("token");

    // Store the attempted path before redirecting
    localStorage.setItem("redirectAfterLogin", location.pathname);

    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;

