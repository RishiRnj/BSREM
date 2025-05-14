
import React, { useState, useEffect, useContext } from "react";
import {  useNavigate, useLocation } from "react-router-dom";
import { Modal, Nav } from "react-bootstrap";
import AuthContext from "../../Context/AuthContext";
import { useWebSocket } from "../../Context/WebSocketProvider";
import PostCreator from '../Forum/PostCreator';
import './User.css';
import Box from '@mui/material/Box';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';


import Posts from "../Forum/Posts";

import { RiSurveyLine } from "react-icons/ri";
import { FaOm } from "react-icons/fa6";
import LoadingSpinner from "../../Components/Common/LoadingSpinner";
import ConfirmationModal from '../../Components/Common/ConfirmationModal';
import PagaUnderConstruction from "../../Components/Common/PagaUnderConstruction";


const actions = [
    { icon: <FaOm />, name: 'New Post' },
    { icon: <RiSurveyLine />, name: 'Perticipate In Survey' },

];




const User = () => {
    const { user } = useContext(AuthContext);    
    const userId = user?.id;    
    const [loading, setLoading] = useState(true);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const navigate = useNavigate();
    const location = useLocation();
    const [showPostModal, setShowPostModal] = useState(false); // State to control the modal
    const { sendMessage, posts, setPosts } = useWebSocket();
    const [surveyCompleted, setSurveyCompleted] = useState(false);
    const [showModal, setShowModal] = useState();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [others, setOthers] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            setLoading(false);
            navigate('/');
            return;
        }

       const checkProfileAndRedirect = async () => {
        try {
            const { religion } = await checkUserProfile();
            console.log('relegion', religion);
            
            if (religion !== "Hinduism") {
                setOthers(true);

                return;
            }
        } catch (err) {
            console.error("Profile check error:", err);
        } finally {
            setLoading(false); // ✅ Move it here so it's called after the async check
        }
    };

    checkProfileAndRedirect();

       

    }, [user]);

  




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



    const CheckUserProfileBeforeProcced = async () => {
        try {
            setLoading(true); // Optional loading state for better UX

            // Step 1: Check if the user's profile is updated
            const {isProfileUpdated} = await checkUserProfile(); // Ensure `checkUserProfile` is async

            if (!isProfileUpdated) {
                setShowProfileModal(true);               
                return; // Stop further execution if the profile isn't updated
            }


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
                console.log("data user", userData);
                

                return {
                isProfileCompleted: userData.isProfileCompleted || false,                
                religion: userData.religion || "",
            };
            } else {
                throw new Error("Failed to fetch user profile.");
            }
        } catch (error) {
            console.error("Error in checkUserProfile:", error);
            navigate("/donation"); // Redirect to a fallback route if needed
            return false; // Default to false if there's an error
        } finally {
            setLoading(false)
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
        localStorage.setItem("redirectAfterLogIn", location.pathname);
        navigate(`/user/${userId}/update-profile`);

    };



    //Show post Modal
    const handleNewPost = (newPost) => {
        // reloadFeed();
        sendMessage("newPost", newPost);
        setShowPostModal(false) // Close the modal after posting
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
                setShowProfileModal(true);

                return; // Stop further execution if the profile isn't updated
            }

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





    




    const handleDismiss = () => {
        setShowModal(false);
        console.log("Click No");
    };

    const handleProfileUpdateConfirm = () => {
        setShowProfileModal(false);
        navigateToProfileUpdate();
    };
    
    const handleProfileUpdateCancel = () => {
        setShowProfileModal(false);
        // Optionally add any cancel logic here
        // setIsUserUpdated(false); // Reset the state if needed
    };

    if (loading) {
        return (
            <LoadingSpinner />
        );
    }

    


    return (
        <>

            <>
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


                <ConfirmationModal
                isOpen={showProfileModal}
                onClose={handleProfileUpdateCancel}
                onConfirm={handleProfileUpdateConfirm}
                title="Profile Update Required"
                message="Your profile is not updated. Please update your profile to proceed."
                confirmText="Update Profile"
                cancelText="Stay Here"
            />
            </>


            <>
            {!others ? (
                <>
                <Nav justify variant="tabs" className="sticky-nav">
                    <Nav.Item>
                        <Nav.Link href="/donate">Dashboard</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href=
                         {`/user/${userId}/update-profile`}
                        >Update Profile</Nav.Link>
                        
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/forum"><FaOm className="mb-1"/> Dashboard</Nav.Link>
                        {/* <Nav.Link eventKey="link-2">Link</Nav.Link> */}
                    </Nav.Item>
                </Nav>




                {/* Post by Users fetched from server//post-container */}
                {/* <div className="d-flex align-items-center justify-content-center  ">  */}

                    {/* display post */}
                    <div className="post-container-user p-3 pb-5">
                        <Posts filterByUser={true} />
                    </div>

                    
                {/* </div> */}













                         {/* fab button */}
                <div style={{ position: "relative", }}>
                   

                        <Box
                            sx={{
                                position: 'fixed',
                                bottom: "70px", // Space for footer
                                right: '16px',
                                pointerEvents: 'auto',
                            }}
                        >
                            <SpeedDial
                                ariaLabel="SpeedDial tooltip example"
                                sx={{ position: 'fixed', bottom: 70, right: 16, fontSize: "30px", zIndex: 9999 }}
                                icon={<SpeedDialIcon />}
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

                    ):(
                        <PagaUnderConstruction/>
                    )}
                









            </>


        </>
    );
};

export default User;
