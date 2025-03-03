import React from "react";
import "./NoticeBoard.css"; // Include the updated CSS above

const NoticeBoard = ({ notices }) => {
  return (
    <div className="notice-board">
      <div className="notice-container" >
        {notices.map((notice, index) => (
          <div
            key={index}
            className="notice"
            onClick={() => window.location.href = notice.link}
          >
            {notice.text}
          </div>
        ))}
        {/* Duplicate the notices to create a seamless looping effect */}
        {notices.map((notice, index) => (
          <div
            key={`duplicate-${index}`}
            className="notice"
            onClick={() => window.location.href = notice.link}
          >
            {notice.text}
          </div>
        ))}
        {/* Duplicate the notices to create a seamless looping effect */}
        {notices.map((notice, index) => (
          <div
            key={`duplicate-${index}`}
            className="notice"
            onClick={() => window.location.href = notice.link}
          >
            {notice.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeBoard;
