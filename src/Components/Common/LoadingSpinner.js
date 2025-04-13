// src/components/Common/LoadingSpinner.js
import React from 'react';
import './LoadingSpinner.css'; // We'll create this next

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;