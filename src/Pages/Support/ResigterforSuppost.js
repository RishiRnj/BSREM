// import React, { useEffect, useState, useContext } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import AuthContext from "../../Context/AuthContext";
// import LoadingSpinner from '../../Components/Common/LoadingSpinner';
// import ConfirmationModal from '../../Components/Common/ConfirmationModal';
// import PreFieldData from '../JoinUs/PreFieldData';
// import SupportStep2 from './SupportStep2';
// import { handleWarning } from '../../Components/Util';
// import { ToastContainer } from 'react-toastify';
// import Status from './Status';

// const ResigterforSuppost = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { user } = useContext(AuthContext);

//     const [isCheckingProfile, setIsCheckingProfile] = useState(true);
//     const [ifUserData, setIfUserDate] = useState(false);
//     const [error, setError] = useState(null);
//     const [showProfileModal, setShowProfileModal] = useState(false);
//     const [isUserUpdated, setIsUserUpdated] = useState(false); // State to track if user is updated
//     const [readyToUpdatedBeneficiary, setReadyToUpdatedBeneficiary] = useState(false); // State to track if user is updated

//     const [isStep1Completed, setIsStep1Completed] = useState(false);
//     const [isStep2Completed, setIsStep2Completed] = useState(false);
//     const [showStatusModal, setShowStatusModal] = useState(false);
//     const [showStatus, setShowStatus] = useState(false);



//     useEffect(() => {
//         const checkProfileAndRedirect = async () => {
//             try {
//                 setIsCheckingProfile(true);
//                 setError(null);

//                 const { isProfileCompleted, isBeneficiary, isBenefited } = await checkUserProfile(window.location);

//                 if (!isProfileCompleted) {      // if profile is incomplete then complete first
//                     setShowProfileModal(true);
//                     return;
//                 }
//                 setIsUserUpdated(true);

//                 if (!isBeneficiary) {           // if isBeneficiary = false the user apply as beneficiary no status will display
//                     setReadyToUpdatedBeneficiary(true);
//                     setIsUserUpdated(true);

//                     handleWarning("Welcome to our Family! Please update further details to proceed.");                    
//                     return;

//                 } else if (isBenefited > 0) {   // if user already apply as beneficiary and donation was sattled then isBenifited has a value, if it has value then status will display, along with this user can apply again for support
//                     setShowStatus(true);
                    
//                 } else {
                    
//                     setShowStatusModal(true)
//                 }

//             } catch (err) {
//                 setError(err.message);
//                 console.error("Profile check error:", err);
//             } finally {
//                 setIsCheckingProfile(false);
//             }
//         };

//         checkProfileAndRedirect();
//     }, [user]);

//     useEffect(() => {
//         localStorage.removeItem("redirectAfterLogin"); // Clear step 1 status
//         localStorage.removeItem("redirectAfterUpdate"); // Clear step 1 status
//         const storedStep1Status = localStorage.getItem("isStep1Completed");
//         const storedStep2Status = localStorage.getItem("isStep2Completed");
//         if (storedStep1Status) {
//             setIsStep1Completed(storedStep1Status === "true");
//         } else if (storedStep2Status) {
//             setIsStep2Completed(storedStep2Status === "true");
//         }
//     }, [isStep1Completed, isStep2Completed]);

//     const checkUserProfile = async () => {
//         try {
//             const token = localStorage.getItem("token");
//             if (!token) {
//                 throw new Error("Please log in to access this page.");
//             }

//             const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
//                 method: "GET",
//                 credentials: "include",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error(response.status === 401
//                     ? "Session expired. Please log in again."
//                     : "Failed to fetch user profile.");
//             }

//             const userData = await response.json();
//             setIfUserDate(userData.user);
//             console.log("User Data:", userData);
//             localStorage.setItem("beneficiary", JSON.stringify(userData.user));
//             return {
//                 isProfileCompleted: userData.isProfileCompleted || false,
//                 isBeneficiary: userData.isBeneficiary || false,
//                 isBenefited: userData.isBenefited || null
//             };

//         } catch (error) {
//             console.error("Error in checkUserProfile:", error);
//             localStorage.setItem("redirectAfterUpdate", location.pathname);
//             navigate("/login", { state: { from: location }, replace: true });
//             throw error;
//         }
//     };

//     const handleProfileUpdateConfirm = () => {
//         setShowProfileModal(false);
//         navigateToProfileUpdate();
//     };

//     const handleProfileUpdateCancel = () => {
//         setShowProfileModal(false);
//         // Optionally add any cancel logic here
//         setIsUserUpdated(false); // Reset the state if needed
//     };

//     const handleStatusConfirm = () => {
//         setShowStatusModal(false)
//         setShowStatus(true)
//     }

//     const handleStatusCancel = () => {
//         setShowStatusModal(false)
//     }

//     const navigateToProfileUpdate = () => {
//         if (!user?.id) {
//             throw new Error("Missing user authentication details.");
//         }

//         localStorage.setItem("redirectAfterUpdate", location.pathname);
//         navigate(`/user/${user.id}/update-profile`, { replace: true });
//     };

//     // Function to update isStep1Completed state
//     const handleStep1Completion = (status) => {
//         setIsStep1Completed(status);
//         localStorage.setItem("isStep1Completed", status);

//     };

//     const handleStep2Completion = (status) => {
//         setIsStep2Completed(status);
//         setIsStep1Completed(true);
//         setShowStatusModal(true);
        
//     };


//     if (isCheckingProfile) {
//         return <LoadingSpinner />;
//     }

//     if (error) {
//         return (
//             <div className="error-message">
//                 <p>{error}</p>
//                 <button onClick={() => window.location.reload()}>Try Again</button>
//             </div>
//         );
//     }

//     return (
//         <>
//             <ConfirmationModal
//                 isOpen={showProfileModal}
//                 onClose={handleProfileUpdateCancel}
//                 onConfirm={handleProfileUpdateConfirm}
//                 title="Profile Update Required"
//                 message="Your profile is not updated. Please update your profile to proceed."
//                 confirmText="Update Profile"
//                 cancelText="Stay Here"
//             />


//             <h2 className='text-center pt-2' >Welcome to BSREM Support</h2>
//             {/* If user profile is updated, with this user can review their profile info */}
//             {isUserUpdated && !isStep1Completed && !isStep2Completed && (
//                 <PreFieldData isUser={ifUserData} isStepOneCompleted={handleStep1Completion} />)}

//                 {/* after review their profile, with this form they can apply for support && and if isBeneficiary === false only then  it display */}
//             {isStep1Completed && !isStep2Completed && readyToUpdatedBeneficiary && (
//                 <SupportStep2 onStepTwoCompleted={handleStep2Completion} />)}

//             <ConfirmationModal
//                 isOpen={showStatusModal}
//                 onClose={handleStatusCancel}
//                 onConfirm={handleStatusConfirm}
//                 title="Already requested for Support"
//                 message="Your profile is not updated. Please update your profile to proceed."
//                 confirmText="Show Status"
//                 cancelText="Stay Here"
//             />
// {/* with current logic if isBeneficiary === true only then it display, but I want along with the form it display when IsBenefited >0 */}
// {showStatus && (
//     <>
//     <Status/>
//     </>

// )}



//             <ToastContainer />

//         </>
//     )
// }

// export default ResigterforSuppost

import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from "../../Context/AuthContext";
import LoadingSpinner from '../../Components/Common/LoadingSpinner';
import ConfirmationModal from '../../Components/Common/ConfirmationModal';
import PreFieldData from '../JoinUs/PreFieldData';
import SupportStep2 from './SupportStep2';
import { handleWarning } from '../../Components/Util';
import { ToastContainer } from 'react-toastify';
import { Button } from 'react-bootstrap'; // Import Button component
import Status from './Status';

const RegisterForSupport = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);

    const [isCheckingProfile, setIsCheckingProfile] = useState(true);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [showStatus, setShowStatus] = useState(false); // New state for toggle
    
    // Modal states
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    
    // Application flow states
    const [isStep1Completed, setIsStep1Completed] = useState(false);
    const [isStep2Completed, setIsStep2Completed] = useState(false);
    const [clickForAnotherApply, setClickForAnotherApply] = useState(false);

    const [applicationStatus, setApplicationStatus] = useState({
        isBeneficiary: false,
        isBenefited: 0,
        isProfileCompleted: false
    });

    useEffect(() => {
        const checkProfileAndRedirect = async () => {
            try {
                setIsCheckingProfile(true);
                setError(null);

                const { isProfileCompleted, isBeneficiary, isBenefited, userData } = await checkUserProfile();

                setApplicationStatus({ isBeneficiary, isBenefited, isProfileCompleted });
                setUserData(userData);

                if (!isProfileCompleted) {
                    setShowProfileModal(true);
                    return;
                }

                if (!isBeneficiary) {
                    handleWarning("Welcome to our Family! Please update further details to proceed.");
                    return;
                }

                if (isBenefited > 0) {
                    setShowStatusModal(true);                    
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
        localStorage.removeItem("redirectAfterLogin");
        localStorage.removeItem("redirectAfterUpdate");
        
        const storedStep1Status = localStorage.getItem("isStep1Completed");
        const storedStep2Status = localStorage.getItem("isStep2Completed");
        
        if (storedStep1Status) {
            setIsStep1Completed(storedStep1Status === "true");
        }
        if (storedStep2Status) {
            setIsStep2Completed(storedStep2Status === "true");
        }
    }, []);

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

            const data = await response.json();
            localStorage.setItem("beneficiary", JSON.stringify(data.user));
            
            return {
                isProfileCompleted: data.isProfileCompleted || false,
                isBeneficiary: data.isBeneficiary || false,
                isBenefited: data.isBenefited || 0,
                userData: data.user
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

    const handleStatusConfirm = () => {
        setShowStatusModal(false);
    };

    const navigateToProfileUpdate = () => {
        if (!user?.id) {
            throw new Error("Missing user authentication details.");
        }
        localStorage.setItem("redirectAfterUpdate", location.pathname);
        navigate(`/user/${user.id}/update-profile`, { replace: true });
    };

    const handleStep1Completion = (status) => {
        setIsStep1Completed(status);
        localStorage.setItem("isStep1Completed", status);
    };

    const handleStep2Completion = (status) => {
        setIsStep2Completed(status);
        setClickForAnotherApply(false);
        localStorage.setItem("isStep2Completed", status);
        setShowStatusModal(true);
    };

    const handleAnotherApply = (status) => {
        setClickForAnotherApply(status);
        setShowStatus(false);
        localStorage.removeItem("isStep2Completed", status);
        
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
                onClose={() => setShowProfileModal(false)}
                onConfirm={handleProfileUpdateConfirm}
                title="Profile Update Required"
                message="Your profile is not updated. Please update your profile to proceed."
                confirmText="Update Profile"
                cancelText="Stay Here"
            />

            <ConfirmationModal
                isOpen={showStatusModal}
                onClose={handleStatusConfirm}
                onConfirm={handleStatusConfirm}
                title="Support Request Status"
                message="You already have a support request. Would you like to view its status?"
                confirmText="View Status"
                cancelText="Continue Application"
            />

            <h2 className='text-center pt-2'>Welcome to BSREM Support</h2>
            
            
            
            {/* Show profile review if user hasn't completed step 1 */}
            {(!isStep1Completed && !applicationStatus.isProfileCompleted) && !isStep2Completed && userData && (
                <PreFieldData isUser={userData} isStepOneCompleted={handleStep1Completion} />
            )}
            
            {/* Show support form if step 1 is completed but not step 2 */}
            {isStep1Completed && !isStep2Completed && !applicationStatus.isBeneficiary &&  applicationStatus.isBenefited <= 0 && (
                <SupportStep2 onStepTwoCompleted={handleStep2Completion} />
            )}

            {clickForAnotherApply && (
                <SupportStep2 onStepTwoCompleted={handleStep2Completion} />
            )}

            {/* Toggle button for status - only shown if user has status to show */}
            {(applicationStatus.isBenefited > 0 || applicationStatus.isBeneficiary) && (
                <div className="text-center m-3">
                    <h4>
                        {applicationStatus.isBenefited > 0
                            ? "You have already received benefits - see your status below"
                            : "You have already applied for support - see your application details below"}
                    </h4>
                    <Button 
                        variant="outline-primary"
                        onClick={() => {setShowStatus(!showStatus); 
                        }}
                    >
                        {showStatus ? 'Hide Status' : 'Show Status'}
                    </Button>
                </div>
            )}
            
            {/* Show status if toggled on and user has benefited or is beneficiary */}
            {showStatus && (applicationStatus.isBenefited > 0 || applicationStatus.isBeneficiary) && (
                <div className='mb-5'>
                <Status onClickForAnotherApply={handleAnotherApply} />
                <div className='text-white' style={{height:"80px"}}></div>
                </div>
            )}

            


            <ToastContainer />
        </>
    );
};

export default RegisterForSupport;