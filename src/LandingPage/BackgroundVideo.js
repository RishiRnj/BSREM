import React from 'react';
import './BackgroundVideo.css';

const BackgroundVideo = () => (
  <div className="video-container-land">
    <video autoPlay loop muted poster="placeholder.webp" className="background-video">
      <source src= 
      "Temple.mp4"
       type="video/mp4" />
      Your browser does not support HTML video.
    </video>
  </div>
);

export default BackgroundVideo;


