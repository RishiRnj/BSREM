
import React, { useEffect, useState, useContext, } from 'react';
import {  useNavigate, useLocation } from "react-router-dom";
import NoticeBoard from '../../Components/Notice/NoticeBorad';
import AuthContext from "../../Context/AuthContext";
import ForumStat from "./ForumStatistics";
import { Modal, Spinner } from "react-bootstrap";
import PostCreator from './PostCreator';
import { useWebSocket } from "../../Context/WebSocketProvider";


import "./Forum.css"
import Posts from './Posts';


import Box from '@mui/material/Box';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { RiSurveyLine } from "react-icons/ri";
import { ToastContainer } from 'react-toastify';
import { FaOm } from "react-icons/fa6";

const actions = [
    { icon: <FaOm />, name: 'New Post' },
    { icon: <RiSurveyLine />, name: 'Perticipate In Survey' },
    
];


const Forum = () => {
  const { user } = useContext(AuthContext);
  const currentUser = user;
  const isAuthenticated = !!user;
  const userId = user?.id;
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [notices, setNotices] = useState([]);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [showModal, setShowModal] = useState();  
  const [showPostModal, setShowPostModal] = useState(false); // State to control the modal  
  const { realTimeData, sendMessage, posts, setPosts } = useWebSocket();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [error, setError] = useState(null);


  // on fab button click
  const handleActionClick = (actionName) => {
    // Handle the click event, for example, logging the action name
    if (actionName === "New Post") {

      CheckUserProfileBeforeProcced();
      //alert("New Post Initited");

    } else if (actionName === "Perticipate In Survey") {
      checkUserProgress();
      //alert("New Survey Initiated");
    }
    console.log(`${actionName} clicked`);
    // You can perform other actions, such as navigating or updating state
    setOpen(false); // Optionally close the SpeedDial after action click
  };


  //check user Prograce
  const checkUserProgress = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token || !userId) throw new Error("Missing user authentication details.");

      // Check if the user's profile is updated
      const isProfileUpdated = await checkUserProfile(); // Ensure `checkUserProfile` is async

      if (!isProfileUpdated) {
        // Show confirmation alert
        const userResponse = window.confirm(
          "Your profile is not updated. Update your profile to post. Press OK to update your profile or Cancel to stay here."
        );

        if (userResponse) {
          navigateToProfileUpdate();
        }
        return; // Stop further execution if the profile isn't updated
      }
      localStorage.removeItem("redirectAfterUpdate"); // Clear after use

      // Fetch survey questions and progress
      const [questionsResponse, progressResponse] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/survey/questions/all`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${process.env.REACT_APP_API_URL}/survey/user/progress?userId=${userId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
      ]);

      if (!questionsResponse.ok || !progressResponse.ok) {
        throw new Error("Failed to fetch questions or progress.");
      }

      const questionsData = await questionsResponse.json();
      const progressData = await progressResponse.json();

      const questionsArray = Array.isArray(questionsData) ? questionsData : questionsData.data || [];
      const completedQuestionIds = progressData.map((q) => q);

      const remainingQuestions = questionsArray
        .filter((q) => !completedQuestionIds.includes(q._id))
        .sort((a, b) => a.order - b.order);

      if (remainingQuestions.length === 0) {
        setSurveyCompleted(true);
        setShowModal(true);
      } else {
        navigate("/user/survey");
      }
    } catch (error) {
      console.error("Error fetching progress and questions:", error);
    } finally {
      setLoading(false);
    }
  };  

  //fetch Notices
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Missing user authentication details.");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notices`, {
        method: 'GET',
        credentials: 'include', // Important for cookies or sessions
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

      });
      if (!response.ok) throw new Error("Failed to fetch notices");
      const data = await response.json();
      setNotices(data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Missing user authentication details.");
      return;
    }
    localStorage.removeItem("redirectAfterLogin"); // Clear after use

    const fetchData = async () => {
      // Fetch notices and posts
      await fetchNotices();


      setLoading(false); // Ensure this is set after all operations complete
    };

    fetchData();
  }, []);





  const handleDismiss = () => {
    setShowModal(false);
    console.log("Click No");
  };


  //Show post Modal
  const handleNewPost = (newPost) => {    
    sendMessage("newPost", newPost);
    setShowPostModal(false) // Close the modal after posting
  };


  const CheckUserProfileBeforeProcced = async () => {
    try {
      setLoading(true); // Optional loading state for better UX

      // Step 1: Check if the user's profile is updated
      const isProfileUpdated = await checkUserProfile(); // Ensure `checkUserProfile` is async

      if (!isProfileUpdated) {
        const userResponse = window.confirm(
          "Your profile is not updated. Update your profile to post. Press OK to update your profile or Cancel to stay here."
        );

        if (userResponse) {
          navigateToProfileUpdate();
        }
        return; // Stop further execution if the profile isn't updated
      }
      localStorage.removeItem("redirectAfterUpdate"); // Clear after use

      // Step 2: Check if the user has followed at least 5 users
      const hasFollowedMinimumUsers = await checkUserFollowStatus(); // Ensure `checkUserFollowStatus` is async

      if (!hasFollowedMinimumUsers) {
        navigate('/user/Users-Suggestions-for/follow', {
          state: { from: window.location.pathname },
        });
        // Redirect to a separate page for user follow check
        return; // Stop further execution until the user meets the criteria
      }

      // Step 3: Proceed to open the post modal
      setShowPostModal(true);
    } catch (error) {
      console.error("Error checking user profile or follow status:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  //check follow status
  const checkUserFollowStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/follow/status`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { followedCount } = await response.json(); // Destructure followedCount
        console.log("Followed Users Count:", followedCount);
        return followedCount >= 4; // Check if the count is >= 4 // Assume `followedCount` is the number of users the current user has followed
      } else {
        throw new Error("Failed to fetch follow status.");
      }
    } catch (error) {
      console.error("Error in checkUserFollowStatus:", error);
      return false; // Default to false if there's an error
    }
  };


  //navigate for Update profile
  const navigateToProfileUpdate = () => {
    // Use React Router for navigation
    if (!userId) throw new Error("Missing user authentication details.");
    localStorage.setItem("redirectAfterUpdate", location.pathname);    
    navigate(`/user/${userId}/update-profile`);

  };


  //check user Profile
  const checkUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
        method: "GET",
        credentials: "include", // Necessary for cookies/session handling
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();

        return userData.isProfileCompleted; // Return the profile status
      } else {
        throw new Error("Failed to fetch user profile.");
      }
    } catch (error) {
      console.error("Error in checkUserProfile:", error);
      navigate("/forum"); // Redirect to a fallback route if needed
      return false; // Default to false if there's an error
    }
  };





  if (loading) {
    return (
      <div className="loading-container"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1050,
        }}
      >
        <Spinner animation="border" role="status" >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      <>
        <div >
          {/* notice Board */}
          <div style={{
            cursor: "pointer",
            position: "fixed",
            top: "65px",
            left: "0px", // Move to bottom-left corner
            zIndex: 1000,
          }}>

            <NoticeBoard
              notices={notices.map((notice) => ({
                ...notice,
                onClick: notice.link === "" ? checkUserProgress() : () => navigate(notice.link),
              }))}
            />

          </div>

          {/* Button for New Survey */}
          {/* <div
            id="forum_btn"
            title="Go to Survey Page"
            onClick={checkUserProgress}
            style={{
              cursor: "pointer",
              position: "fixed",
              bottom: "45px",
              left: "0px", // Move to bottom-left corner
              zIndex: 1000,
            }}
          >
            <img
              src="/btn.webp"
              alt="forum"
              width={200}
              height={70}
              className="forum-img"
              style={{ transition: "transform 0.3s ease" }}
            />
          </div> */}
        </div>

        {/* Show Modal */}
        <div>
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h4>Your survey is completed. If you would like to see your "Survey" Responses, click "Yes."</h4>
                {/* its need to change */}
                <button onClick={() => navigate(`/user/${userId}/surveyResponse`)}>Yes</button>
                <button onClick={handleDismiss}>No</button>
              </div>
            </div>
          )}
          <style jsx="true">{`
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .modal-content {
                    max-width: 400px;
                    height: auto;
                    background: white;
                    padding: 20px;
                    border-radius: 5px;
                    text-align: center;
                }
                button {
                    margin: 5px;
                    padding: 10px 20px;
                    font-size: 16px;
                }
            `}</style>
        </div>
      </>
      <>

      {/* main Content */}
      <div id='fPage'>      {/*615 */}
          {/* Left Sidebar */}
          <div id="" className="fPage-sidebar">   {/* 617 */}
            {/* its proxy but needed */}
          </div>
          <div id="fPage-left" className="">
            <div className='lt'>
              <p>Main Item set Here for Left Pannel</p>          {/* 622 */}
            </div>
          </div>
          {/* Right Sidebar */}
          <div id="" className="fPage-sidebar">           {/* 626 */}
            {/* its proxy but needed */}
          </div>
          <div id="fPage-right" className="">
            <div className='rt'>            {/* 630 */}
              <strong>Main Item set Here for Right Pannel</strong>
            </div>
          </div>
          {/* main Content Parent Div */}
          {/* Post by Users fetched from server */}
          <div className="d-flex align-items-center justify-content-center post-container pt-3">

            {/* display post */}

            <Posts filterByUser={false} />
          </div>
        </div>



       

        {/* Fetched Survey Stat only for Forum Page */}
        <div
          style={{
            cursor: "pointer",
            position: "relative", // Changed to relative to avoid affecting other elements            
            left: "0px",
            display: "inline-block", // Restrict clickable area to content only
          }}
          onClick={() => navigate('/survey-stats')}
        >
          <ForumStat />
        </div>

        <div style={{ position: "relative", }}>
          {/* Main Content */}
          <div
          // style={{
          //   position: "fixed",
          //   bottom: "100px", // Space for footer                  
          //   right: "0",
          //   paddingRight: "15px"
          // }}
          >

            {/* <Fab color="primary" aria-label="add"  onClick={CheckUserProfileBeforeProcced}>
              <FaPlus />
            </Fab> */}



            <Box
              sx={{
                position: 'fixed',
                bottom: "100px", // Space for footer
                right: '16px',
                pointerEvents: 'auto',
              }}
            >
              <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                sx={{ position: 'fixed', bottom: 100, right: 16, fontSize:"30px", zIndex: 9999 }}
                icon={<SpeedDialIcon  />}
                direction="left"
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
              >
                {actions.map((action) => (
                  <SpeedDialAction
                  
                    key={action.name}
                    icon={action.icon}
                    sx={{ fontSize: '20px' }}
                    tooltipTitle={action.name}
                   // tooltipOpen
                    onClick={() => handleActionClick(action.name)}
                  />
                ))}
              </SpeedDial>
            </Box>

          </div>
        </div>

        {/* Modal for PostCreator */}
        <Modal
          show={showPostModal}
          onHide={() => setShowPostModal(false)}
          centered
        >
          <Modal.Header closeButton> Create New Post </Modal.Header>
          <Modal.Body>

            <div style={{

              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
              <PostCreator onPostCreated={handleNewPost} />
            </div>

          </Modal.Body>
        </Modal>
        
      </>
      <ToastContainer/>

    </>
  );
};

export default Forum;
