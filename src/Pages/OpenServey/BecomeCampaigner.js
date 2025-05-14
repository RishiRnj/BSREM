

import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from "../../Context/AuthContext";
import LoadingSpinner from '../../Components/Common/LoadingSpinner';
import { handleWarning, handleSuccess, handleError } from '../../Components/Util';
import { ToastContainer } from 'react-toastify';
import { Button, Card, ListGroup, Badge } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import ConfirmationModal from '../../Components/Common/ConfirmationModal';

const BecomeCampaigner = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);

    const [isCheckingProfile, setIsCheckingProfile] = useState(true);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Modal states
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const [applicationStatus, setApplicationStatus] = useState({
        isCampaigner: false,
        isCampaignerProfileCompleted: false,
        isProfileCompleted: false,
        isCampaignerRequested: false,
    });

    useEffect(() => {
        const checkProfileAndRedirect = async () => {
            try {
                setIsCheckingProfile(true);
                setError(null);

                const { 
                    isProfileCompleted, 
                    isCampaigner, 
                    isCampaignerProfileCompleted,
                    isCampaignerRequested, 
                    userData,                    
                } = await checkUserProfile();

                console.log("Profile status:", {
                    isProfileCompleted,
                    isCampaigner,
                    isCampaignerProfileCompleted,
                  });
                  
                setApplicationStatus({ 
                    isCampaigner, 
                    isCampaignerProfileCompleted, 
                    isProfileCompleted,  
                    isCampaignerRequested,                  
                });
                setUserData(userData);

                if (!isProfileCompleted) {
                    console.log("Profile is not completed, showing profile modal.");
                    
                    setShowProfileModal(true)
                    return;
                }

                if (!isCampaignerProfileCompleted && !isCampaigner) {
                    setShowStatusModal(true); 
                    return;                   
                }

                if (isCampaigner) {
                    navigate('/campaigner-dashboard', { replace: true });
                    return;
                }
                
                if (isCampaignerRequested) {
                    setShowReviewModal(true);
                    handleWarning("Your request is already submitted. Please wait for admin approval.");
                    return;
                }
                
                
                

                

            } catch (err) {
                setError(err.message);
                console.error("Profile check error:", err);
            } finally {
                setIsCheckingProfile(false);
            }
        };

        checkProfileAndRedirect();
    }, [user, navigate]);

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
            localStorage.setItem("campaigner", JSON.stringify(data.user));
            
            return {
                isProfileCompleted: data.isProfileCompleted || false,
                isCampaigner: data.isCampaigner || false,
                isCampaignerProfileCompleted: data.isCampaignerProfileCompleted || false,  
                isCampaignerRequested: data.isCampaignerRequested || false,              
                userData: data.user
            };

        } catch (error) {
            console.error("Error in checkUserProfile:", error);
            localStorage.setItem("redirectAfterUpdate", location.pathname);
            navigate("/login", { state: { from: location }, replace: true });
            throw error;
        }
    };

    const requestCampaignerStatus = async () => {
        // Check if campaigner profile is completed first
        if (!applicationStatus.isCampaignerProfileCompleted) {
            handleWarning("Please complete your campaigner profile first.");
            navigate('/complete-campaigner-profile');
            return;
        }

        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("token");
            
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/campaign/campaigner/request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: userData._id,
                    reason: "Requesting campaigner status"
                })
            });

            if (!response.ok) {
                throw new Error("Failed to submit campaigner request");
            }

            const data = await response.json();
            setShowReviewModal(true);
            handleSuccess("Campaigner request submitted successfully! Admin will review your application.");
            setApplicationStatus(prev => ({ ...prev, isCampaigner: false }));

        } catch (error) {
            handleError(error.message);
            console.error("Request campaigner error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const RequirementItem = ({ text, isCompleted }) => (
        <ListGroup.Item className="d-flex justify-content-between align-items-center">
            {text}
            {isCompleted ? (
                <Badge bg="success">
                    <FaCheck />
                </Badge>
            ) : (
                <Badge bg="danger">
                    <FaTimes />
                </Badge>
            )}
        </ListGroup.Item>
    );


    const navigateToProfileCompletion = () => {
        localStorage.setItem("redirectAfterUpdate", location.pathname);
        navigate(`/user/${user.id}/update-profile`, { replace: true });
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
        <div className="container py-5">
            <ToastContainer />
            
            <Card className="shadow">
                <Card.Header className="bg-primary text-white">
                    <h2 className="mb-0">Become a Campaigner</h2>
                </Card.Header>
                
                <Card.Body>
                    {!applicationStatus.isCampaigner ? (
                        <>
                            <p className="lead text-center fs-4">
                                As a campaigner, you'll be able to create and manage your own campaigns, 
                                reach more supporters, and make a bigger impact.
                            </p>
                            
                            <div className="my-4">
                                <h4>Requirements:</h4>
                                <ListGroup>
                                    <RequirementItem 
                                        text="Complete your profile information" 
                                        isCompleted={applicationStatus.isProfileCompleted} 
                                    />
                                    <RequirementItem 
                                        text="Provide valid identification" 
                                        isCompleted={applicationStatus.isCampaignerProfileCompleted} 
                                    />
                                    <RequirementItem 
                                        text="Provide Campaign details" 
                                        isCompleted={applicationStatus.isCampaignerProfileCompleted} 
                                    />
                                    <RequirementItem 
                                        text="Agree to our terms and conditions" 
                                        isCompleted={applicationStatus.isCampaignerProfileCompleted} 
                                    />
                                </ListGroup>
                            </div>
                            
                            <div className="d-flex justify-content-center">
                                {!applicationStatus.isCampaignerProfileCompleted ? (
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={() => navigate('/complete-campaigner-profile')}
                                    >
                                        Update Campaigner Profile First
                                    </Button>
                                ) : (
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={requestCampaignerStatus}
                                        disabled={isSubmitting || 
                                            !applicationStatus.isProfileCompleted || 
                                            !applicationStatus.isCampaignerProfileCompleted ||
                                            applicationStatus.isCampaignerRequested
                                        }
                                        
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Apply to Become a Campaigner'}
                                    </Button>
                                )}                                
                                
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <h3 className="text-success">You're already a Campaigner!</h3>
                            <p>You can now create and manage your campaigns.</p>
                            <Button 
                                variant="success"
                                onClick={() => navigate('/campaigner-dashboard')}
                            >
                                Create Your First Campaign
                            </Button>
                        </div>
                    )}
                </Card.Body>
            </Card>


            {/* Campaigner Status Modal */}
            <ConfirmationModal
                isOpen={showReviewModal}                
                onConfirm={() => setShowReviewModal(false)}  
                onClose={() => setShowReviewModal(false)}              
                title="Admin Review on Process"
                message="We will get back to you soon. Thank you for your patience."
                confirmText="Okay"                
                cancelText="Thanks"
            />
            

            {/* Campaigner Status Modal */}
            <ConfirmationModal
                isOpen={showStatusModal}                
                onClose={() => setShowStatusModal(false)}
                onConfirm={() => navigate('/complete-campaigner-profile')}                
                title="Campaigner Profile Required"
                message="Please complete your campaigner profile to access all features."
                confirmText="Complete Now"
                cancelText="Later"
            />

             {/* Profile Completion Modal */}            
             <ConfirmationModal
                 isOpen={showProfileModal}
                 onClose={() => setShowProfileModal(false)}
                 onConfirm={navigateToProfileCompletion}                 
                 title="Profile Incomplete!"
                 message="You need to complete your profile before becoming a campaigner."
                 confirmText="Complete Profile"
                 cancelText="Later"
             />



        </div>
    );
}

export default BecomeCampaigner;