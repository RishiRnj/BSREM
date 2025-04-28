import React, { useEffect, useState } from "react";
import "./NoticeBoard.css"; // Include the updated CSS above

// const NoticeBoard = ({ notices }) => {
//   return (
//     <div className="notice-board">
//       <div className="notice-container" >
//         {notices.map((notice, index) => (
//           <div
//             key={index}
//             className="notice"
//             // onClick={() => window.location.href = notice.link}
//             onClick={() => {
//               // Check if the notice link is for blood donation
//               if (notice.link === "/donation#Blood") {
//                 // Set local storage only when it's the blood-donation link
//                 localStorage.setItem("redirectToSEC", "blood-donation");
//               }
//               if (notice.link === "/donation#MentorShip") {
//                 // Set local storage only when it's the blood-donation link
//                 localStorage.setItem("redirectToSEC", "skill-donation");
//               }
        
//               // Navigate to the desired link
//               window.location.href = notice.link;
//             }}
//           >
//             {notice.text}
//           </div>
//         ))}

//         {/* Duplicate notices */}
//         {notices.map((notice, index) => (
//           <div
//             key={index}
//             className="notice"
//             // onClick={() => window.location.href = notice.link}
//             onClick={() => {
//               // Check if the notice link is for blood donation
//               if (notice.link === "/donation#Blood") {
//                 // Set local storage only when it's the blood-donation link
//                 localStorage.setItem("redirectToSEC", "blood-donation");
//               }
//               if (notice.link === "/donation#MentorShip") {
//                 // Set local storage only when it's the blood-donation link
//                 localStorage.setItem("redirectToSEC", "skill-donation");
//               }
        
//               // Navigate to the desired link
//               window.location.href = notice.link;
//             }}
//           >
//             {notice.text}
//           </div>
//         ))}
        
       
        
//       </div>
//     </div>
//   );
// };



// export default NoticeBoard;


const NoticeBoard = ({ notices }) => {
  

  return (
    <div className="notice-board">
      <div className="notice-container">
        

        {notices.map((notice, index) => (
          <div
            key={index}
            className="notice"
            onClick={() => {
              if (notice.link === "/donation#Blood") {
                localStorage.setItem("redirectToSEC", "blankB-donation");
              }
              if (notice.link === "/donation#MentorShip") {
                localStorage.setItem("redirectToSEC", "blank-donation");
              }
              window.location.href = notice.link;
            }}
          >
            {notice.text}
          </div>
        ))}

        {/* duplicate */}

        {/* {notices.map((notice, index) => (
          <div
            key={index}
            className="notice"
            onClick={() => {
              if (notice.link === "/donation#Blood") {
                localStorage.setItem("redirectToSEC", "blood-donation");
              }
              if (notice.link === "/donation#MentorShip") {
                localStorage.setItem("redirectToSEC", "skill-donation");
              }
              window.location.href = notice.link;
            }}
          >
            {notice.text}
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default NoticeBoard;
