
// import React, { useContext, useState } from 'react';
// import { Modal, Button, Spinner } from 'react-bootstrap';
// import AuthContext from "../../Context/AuthContext";
// import { useWebSocket } from "../../Context/WebSocketProvider";
// import { useNavigate } from "react-router-dom";

// const SurveyResponse = () => {
//     const { user } = useContext(AuthContext);
//     const userId = user?.id;
//     const [loading, setLoading] = useState(false);
//     const [responses, setResponses] = useState([]);
//     const [showResponses, setShowResponses] = useState(false); // Track if responses should be shown

//     // Handle loading and fetching responses
//     const handleToggleResponses = async () => {
//         if (showResponses) {
//             setShowResponses(false); // Hide responses if currently showing
//         } else {
//             setLoading(true); // Show loading spinner
//             try {
//                 const response = await fetch(
//                     `${process.env.REACT_APP_API_URL}/survey/user/answers/${userId}`,
//                     {
//                         credentials: 'include',
//                         headers: {
//                             Authorization: `Bearer ${localStorage.getItem('token')}`,
//                         },
//                     }
//                 );

//                 if (!response.ok) {
//                     throw new Error('Failed to fetch answered questions.');
//                 }

//                 const data = await response.json();

//                 // Check if responses exist
//                 const hasResponses = data.some((item) => item.question && item.answer);
//                 if (!hasResponses) {
//                     alert('You have not participated in the survey yet.');
//                     setShowResponses(false);
//                 } else {
//                     setResponses(data); // Set responses if valid
//                     setShowResponses(true);
//                 }
//             } catch (error) {
//                 console.error('Error fetching answered questions:', error);
//                 alert('An error occurred while fetching your survey responses.');
//                 setShowResponses(false); // Hide responses on error
//             } finally {
//                 setLoading(false); // Hide loading spinner
//             }
//         }
//     };

//     return (
//         <div className="displaySurvey mt-4 pb-5">
//             <div className="d-flex align-items-center justify-content-center">
//                 <Button
//                     className="btn-user"
//                     variant="secondary"
//                     size="lg"
//                     onClick={handleToggleResponses}
//                     disabled={loading} // Disable the button during loading
//                 >
//                     {showResponses ? 'Hide Survey Responses' : 'Show My Survey Responses'}
//                 </Button>
//             </div>

//             {loading && (
//                 <div className="d-flex justify-content-center">
//                     <Spinner animation="border" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                     </Spinner>
//                 </div>
//             )}

//             {showResponses && responses.length > 0 && (
//                 <div style={{ textAlign: 'center', margin: '20px' }}>
//                     <h2>Answered Questions</h2>
//                     <div className="p-2 border border-primary">
//                         <ul>
//                             {responses.map((qa, index) => (
//                                 <li key={qa.questionId || index}>
//                                     <strong>Q: {qa.question}</strong>
//                                     <br />
//                                     <strong>A:</strong> {qa.answer}
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default SurveyResponse;

import React, { useContext, useEffect, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { handleSuccess } from '../../Components/Util';
import { ToastContainer } from 'react-toastify';
import { FaHouseChimney, FaBuildingUser  } from "react-icons/fa6";
import Butn from './Butn';

const SurveyResponse = () => {
    const { user } = useContext(AuthContext);
    const isAuthenticated = !!user;
    const userId = user?.id;
    //const userId = user?._id || localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"))._id;
    const [loading, setLoading] = useState(true);
    const [responses, setResponses] = useState([]);
    const [error, setError] = useState(null);

    const navigate = useNavigate(); // Use navigate to go back to previous page

    // Fetch survey responses when the component mounts
    useEffect(() => {
        if (isAuthenticated) {
        console.log("Before fetch, userId:", userId);
    
        const fetchResponses = async () => {
            if (!userId) {
                console.error("userId is undefined. Aborting fetch.");
                setError("User ID is missing, cannot fetch responses.");
                return;
            }
    
            try {
                console.log("Fetching survey responses for userId:", userId);
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/survey/user/answers/${userId}`,
                    {
                        credentials: 'include',
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
    
                if (!response.ok) {
                    throw new Error("Failed to fetch answered questions.");
                }
    
                const data = await response.json();
                console.log("Survey data received:", data);
    
                if (!data.length) {
                    setError("No survey responses found.");
                } else {
                    setResponses(data);
                }
            } catch (error) {
                console.error("Error fetching answered questions:", error);
                setError("An error occurred while fetching your survey responses.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchResponses();
    }
    }, [isAuthenticated, userId]);
    

    return (
        <div className="displaySurvey mt-4 pb-5">
            {!error && (
                <Butn/>
            )}
            

            {loading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : error ? (
                <div className="text-center">
                    <Butn/>
                    <h5>{error}</h5>
                    
                </div>
            ) : (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // height: '100vh', // Ensures it's vertically centered within the viewport
                    padding: '20px'
                }}>
                    <div style={{ textAlign: 'center', margin: '20px', maxWidth: '500px' }}>
                        <h2>Answered Questions</h2>
                        <div className="p-2 border border-primary">
                            <ul className='ps-2'>
                                {responses.map((qa, index) => (
                                    <li key={qa.questionId || index}>
                                        <strong>Q: {qa.question}</strong>
                                        <br />
                                        <strong>A:</strong> {qa.answer}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>

            )}

            
            {!error && (
                <div className="d-flex justify-content-center mb-3">
                {/* Back Button */}
                <Button
                    variant="outline-success"
                    onClick={() => handleSuccess("Update Response are disable for now!")} // Go back to the previous page
                >
                    Update
                </Button>
            </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default SurveyResponse;

