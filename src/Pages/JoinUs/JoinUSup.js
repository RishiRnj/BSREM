

// JoinUSup

import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from "../../Context/AuthContext";
import LoadingSpinner from '../../Components/Common/LoadingSpinner';
import ConfirmationModal from '../../Components/Common/ConfirmationModal';
import PreFieldData from './PreFieldData';
import { handleWarning } from '../../Components/Util';
import JoinStep2 from './JoinStep2';

const JoinUSup = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);

    const [isCheckingProfile, setIsCheckingProfile] = useState(true);
    const [ifUserData, setIfUserDate] = useState(false);
    const [error, setError] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [isUserUpdated, setIsUserUpdated] = useState(false); // State to track if user is updated
    const [isStep1Completed, setIsStep1Completed] = useState(false);
    const [isStep2Completed, setIsStep2Completed] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [isUserVolunteer, setIsUserVolunteer] = useState(""); // State to track if user is updated


    useEffect(() => {
        const checkProfileAndRedirect = async () => {
            try {
                setIsCheckingProfile(true);
                setError(null);

                const { isProfileCompleted, isVolunteer, religion } = await checkUserProfile(window.location);

                

                if (!isProfileCompleted) {
                    setShowProfileModal(true);
                    return;
                }
                setIsUserUpdated(true);

                if (religion !== "Hinduism") {
                    setShowAlert(true);                    
                    return;
                }

                if (!isVolunteer) {
                    handleWarning("Welcome to our Family! Please update further details to proceed.");
                    return;

                } else {
                    navigate('/joinUs/volunteer', {
                        state: { from: window.location.pathname },
                    });
                }

            } catch (err) {
                setError(err.message);
                console.error("Profile check error:", err);
            } finally {
                setIsCheckingProfile(false);
            }
        };

        checkProfileAndRedirect();
    }, [user]);

    useEffect(() => {
        localStorage.removeItem("redirectAfterLogin"); // Clear step 1 status
        const storedStep1Status = localStorage.getItem("isStep1Completed");
        const storedStep2Status = localStorage.getItem("isStep2Completed");
        if (storedStep1Status) {
            setIsStep1Completed(storedStep1Status === "true");
        } else if (storedStep2Status) {
            setIsStep2Completed(storedStep2Status === "true");
        }
    }, [isStep1Completed, isStep2Completed]);

    const checkUserProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Please log in to access this page.");
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(response.status === 401
                    ? "Session expired. Please log in again."
                    : "Failed to fetch user profile.");
            }

            const userData = await response.json();
            setIfUserDate(userData.user);
            console.log("User Data:", userData);
            localStorage.setItem("volunteer", JSON.stringify(userData.user));
            return {
                isProfileCompleted: userData.isProfileCompleted || false,
                isVolunteer: userData.isVolunteer || false,
                religion: userData.religion || "",
            };

        } catch (error) {
            console.error("Error in checkUserProfile:", error);
            localStorage.setItem("redirectAfterUpdate", location.pathname);
            navigate("/login", { state: { from: location }, replace: true });
            throw error;
        }
    };

    const handleProfileUpdateConfirm = () => {
        setShowProfileModal(false);
        navigateToProfileUpdate();
    };

    const handleProfileUpdateCancel = () => {
        setShowProfileModal(false);
        // Optionally add any cancel logic here
        setIsUserUpdated(false); // Reset the state if needed
    };

    const navigateToProfileUpdate = () => {
        if (!user?.id) {
            throw new Error("Missing user authentication details.");
        }

        localStorage.setItem("redirectAfterUpdate", location.pathname);
        navigate(`/user/${user.id}/update-profile`, { replace: true });
    };

    // Function to update isStep1Completed state
    const handleStep1Completion = (status) => {
        setIsStep1Completed(status);
        localStorage.setItem("isStep1Completed", status);

    };
    const handleStep2Completion = (status) => {
        setIsStep2Completed(status);
        localStorage.removeItem("isStep1Completed"); // Clear step 1 status
        localStorage.setItem("isStep2Completed", status);
    };

    const handleJoinUsConfirm = () => {
        setIsStep2Completed(false);
        setIsUserUpdated(false);
        setShowProfileModal(false);
        localStorage.removeItem("isStep1Completed"); // Clear step 1 status
        localStorage.removeItem("isStep2Completed"); // Clear step 2 status
        navigate("/joinUs/volunteer", { replace: true });
    };
    const handleJoinUsCancel = () => {
        setIsStep2Completed(false);
        setIsUserUpdated(false);
        setShowProfileModal(false);
        localStorage.removeItem("isStep1Completed"); // Clear step 1 status
        localStorage.removeItem("isStep2Completed"); // Clear step 2 status
        navigate("/joinUs/volunteer", { replace: true });
    };

    if (isCheckingProfile) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="error-message">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
        );
    }

    return (
        <>
            <ConfirmationModal
                isOpen={showProfileModal}
                onClose={handleProfileUpdateCancel}
                onConfirm={handleProfileUpdateConfirm}
                title="Profile Update Required"
                message="Your profile is not updated. Please update your profile to proceed."
                confirmText="Update Profile"
                cancelText="Stay Here"
            />

            <div className="join-us-container" style={{ paddingBottom: "70px" }} >
                {/* Your actual component content goes here */}
                <div>
                    <h2 className='text-center pt-2' >Welcome to Join Us</h2>
                    {isUserUpdated && !isStep1Completed && (
                        <PreFieldData isUser={ifUserData} isStepOneCompleted={handleStep1Completion} />)}

                    {isStep1Completed && !isStep2Completed && (

                        <JoinStep2 onStepTwoCompleted={handleStep2Completion} />)}

                    {isUserUpdated && isStep1Completed && isStep2Completed && (
                        <ConfirmationModal
                            isOpen={isStep2Completed}
                            onClose={handleJoinUsCancel}
                            onConfirm={handleJoinUsConfirm}
                            title="Thank you for joining us!"
                            message="Your Volunteer profile is complete. You can now Download Volunteer Pass."
                            confirmText="Generate Pass"
                            cancelText="Download Pass"
                        />

                    )}

                    <ConfirmationModal
                    isOpen={showAlert}
                    onClose={() => { setShowAlert(false); navigate('/') }}
                    onConfirm={() => { setShowAlert(false); navigate('/open-survey/create-own-survey') }}
                    title={"⚠️ Important Note"}
                    message={"We will communicate later, when platform created for your Community. However, You only access our Campaign service, for creating Survey and Analysis."}
                    confirmText='Go to Campaigner Dashboard'
                    cancelText='Cencel'
                    />
                </div>
            </div>
        </>
    );
};

export default JoinUSup;