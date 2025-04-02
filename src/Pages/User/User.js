
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Modal, Button, Form, Spinner, ProgressBar, ListGroup, Nav } from "react-bootstrap";
import AuthContext from "../../Context/AuthContext";
import { useWebSocket } from "../../Context/WebSocketProvider";
import PostCreator from '../Forum/PostCreator';
import './User.css';
import Box from '@mui/material/Box';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import { BsMenuButtonFill, BsRepeat, BsFillSendFill, BsExclamationDiamondFill, BsExclamationTriangleFill, BsExclamationTriangle } from "react-icons/bs";
import Posts from "../Forum/Posts";

import { RiSurveyLine } from "react-icons/ri";
import { FaOm, FaPlus } from "react-icons/fa6";

const actions = [
    { icon: <FaOm />, name: 'New Post' },
    { icon: <RiSurveyLine />, name: 'Perticipate In Survey' },

];




const User = () => {
    const { user } = useContext(AuthContext);
    const isAuthenticated = !!user;
    const currentUser = user;
    const userId = user?.id;
    const [showFullData, setShowFullData] = useState(false); // Toggles between partial and full table view
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [responses, setResponses] = useState([]);
    const [showResponses, setShowResponses] = useState(false); // State to track button toggle

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const navigate = useNavigate();
    const location = useLocation();
    const [showPostModal, setShowPostModal] = useState(false); // State to control the modal
    const { sendMessage, posts, setPosts } = useWebSocket();
    const [surveyCompleted, setSurveyCompleted] = useState(false);
    const [showModal, setShowModal] = useState();


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
                // Show confirmation alert
                const userResponse = window.confirm(
                    "Your profile is not updated. Update your profile to post. Press OK to update your profile or Cancel to stay here."
                );

                if (userResponse) {
                    navigateToProfileUpdate();
                }
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





    useEffect(() => {
        if (isAuthenticated) {
            localStorage.removeItem("redirectAfterLogin"); // Clear after use
            localStorage.removeItem("redirectAfterUpdate"); // Clear after use
            const fetchUserData = async () => {
                setLoading(true)
                try {
                    const token = localStorage.getItem("token");
                    if (!token) {
                        console.error("No token found");
                        return;
                    }

                    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile/data`, {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Cache-Control": "no-cache",
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUserData(data.user);
                        console.log(data);


                    } else {
                        console.error("Failed to fetch user data");
                    }
                } catch (error) {
                    console.error("Error fetching user data", error);

                } finally {
                    setLoading(false)

                }
            };

            fetchUserData();
        }
    }, [isAuthenticated, userId]);



    const handleDismiss = () => {
        setShowModal(false);
        console.log("Click No");
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

    console.log("Is loading:", loading);
    if (!loading) {
        console.log("Responses ready for rendering:", responses);
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
            </>


            <>
                <Nav justify variant="tabs" defaultActiveKey="">
                    <Nav.Item>
                        <Nav.Link href="">Active</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="">Becon</Nav.Link>
                        {/* <Nav.Link eventKey="link-1">Loooonger NavLink</Nav.Link> */}
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="">Brade</Nav.Link>
                        {/* <Nav.Link eventKey="link-2">Link</Nav.Link> */}
                    </Nav.Item>
                </Nav>
                <div className="user-container">
                    {/* main Content */}
                    <div id='fPage-user'>      {/*615 */}
                        {/* Left Sidebar */}
                        <div id="" className="fPage-sidebar-user">   {/* 617 */}
                            {/* its proxy but needed */}
                        </div>
                        <div id="fPage-left-user" className="">
                            <div className='lt-user'>
                                <p>Main Item set Here for Left Pannel</p>          {/* 622 */}
                            </div>
                        </div>
                        {/* Right Sidebar */}
                        <div id="" className="fPage-sidebar-user">           {/* 626 */}
                            {/* its proxy but needed */}
                        </div>
                        <div id="fPage-right-user" className="">
                            <div className='rt-user'>            {/* 630 */}
                                <strong>Main Item set Here for Right Pannel</strong>
                            </div>
                        </div>
                        {/* main Content Parent Div */}
                        {/* Post by Users fetched from server */}
                        <div id="pst" className="d-flex align-items-center justify-content-center post-container">

                            {/* display post */}

                            <Posts filterByUser={true} />

                        </div>
                    </div>






                    {/* its also invisible */}
                    <div style={{ display: "none" }}>
                        <div className="d-flex align-items-center justify-content-center">
                            <img
                                className="userPic"
                                src={userData?.userImage || "/user.png"}
                                alt="User"
                                title={userData?.updateFullName || userData?.displayName || "User"}
                                style={{
                                    marginRight: "10px",
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "50%",
                                    border: "1px solid #ccc",
                                }}
                                onError={(e) => {
                                    e.target.src = "/user.png"; // Fallback in case of load error
                                }}
                            />
                        </div>

                        <div className="d-flex align-items-center justify-content-center">
                            <h3>{userData?.updateFullName || userData?.displayName || "User"}</h3>
                        </div>
                    </div>


                    <div style={{ position: "relative", }}>
                        {/* Fab Button */}
                        <div>

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
                    </div>





                    {/* for now its invisible */}
                    {/* User Data Table */}
                    <div className="user-data" style={{ display: "none" }}>
                        <table className="user-table" border="1" style={{ width: "80%", margin: "auto" }}>
                            <thead>
                                <tr>
                                    {/* <th>Field</th>
                                        <th>Value</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Render partial data */}
                                {(!showFullData ? userData?.partialFields : userData?.fullFields)?.map((field, index) => (
                                    <tr key={index}>
                                        <td><strong>{field.label}</strong></td>
                                        <td>{field.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Toggle Buttons */}
                        {!showFullData ? (
                            <div className="show-more-container text-center" style={{ marginTop: "20px" }}>
                                <Button className="btn"
                                    onClick={() => setShowFullData(true)}
                                    variant="primary" size="lg">
                                    Show More
                                </Button>
                            </div>
                        ) : (
                            <div className="show-less-container text-center" style={{ marginTop: "20px" }}>
                                <Button variant="success" size="lg" className="btn"
                                    onClick={() => setShowFullData(false)}>
                                    Show Less
                                </Button>
                                <Button variant="warning" size="lg" className="btn ms-2"
                                    onClick={() => alert("Edit Profile option not Available at this time.")}>
                                    Edit
                                </Button>
                            </div>
                        )}
                    </div>
                </div>


            </>


        </>
    );
};

export default User;
