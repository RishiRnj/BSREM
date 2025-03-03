import React from 'react';
import './BackgroundVideo.css';

const BackgroundVideo = () => (
  <div className="video-container">
    <video autoPlay loop muted poster="placeholder.webp" className="background-video">
      <source src= 
      "https://www.dropbox.com/scl/fi/fl8jden30zsdqaqmc6yci/Teple1.mp4?rlkey=q3ahy0arrbwwdkmwr1h0hx7nm&st=w3lv335k&raw=1"
       type="video/mp4" />
      Your browser does not support HTML video.
    </video>
  </div>
);

export default BackgroundVideo;


