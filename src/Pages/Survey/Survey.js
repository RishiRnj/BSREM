// Date: 07/01/2025
// Desc: Survey page component
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Modal, Button, Form, Spinner, ProgressBar, ListGroup, ModalHeader, ModalBody, ModalFooter } from "react-bootstrap";
import AuthContext from "../../Context/AuthContext";
import "./Survey.css";


const Survey = () => {
  const { user } = useContext(AuthContext);
  const isAuthenticated = !!user;
  const userId = user?.id;
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showModal, setShowModal] = useState(true);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [navigationModal, setNavigationModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.removeItem("redirectAfterLogin"); // Clear after use
      localStorage.removeItem("redirectAfterUpdate"); // Clear after use
      const initializeSurvey = async () => {
        try {
          setLoading(true);
          await checkProfileStatus();
          await fetchProgressAndQuestions();

          // Fetch questions and answers for the user
          await fetchAnsweredQuestions();
        } catch (error) {
          console.error("Error initializing survey:", error);
        } finally {
          setLoading(false);
        }
      };

      initializeSurvey();
    }


  }, [isAuthenticated, currentPage, userId]);

  const fetchAnsweredQuestions = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/survey/user/answers/${userId}`,
        {
          credentials: 'include', // Important for cookies or sessions
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch answered questions.');
      }

      const data = await response.json();
      setResponses(data);
      console.log('Fetched answers accordding to question for display:', data);

    } catch (error) {
      console.error('Error fetching answered questions:', error);
    }
  };

  // Check if the user profile is completed
  const checkProfileStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
        method: "GET",
        credentials: 'include', // Important for cookies or sessions
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setIsProfileCompleted(userData.isProfileCompleted);
        if (!userData.isProfileCompleted) {
          const userResponse = window.confirm(
            "Your profile is not updated. Update your profile to post. Press OK to update your profile or Cancel to stay here."
          );

          if (userResponse) {
            navigateToProfileUpdate();
          }
          return; // Stop further execution if the profile isn't updated
          // navigate(`/user/${userData._id}/update-profile`);
        }
      } else {
        throw new Error("Failed to fetch user profile.");
      }
    } catch (error) {
      console.error("Error checking profile status:", error);
      navigate("/forum");
    }
  };


  //navigate for Update profile
  const navigateToProfileUpdate = () => {
    // Use React Router for navigation
    if (!userId) throw new Error("Missing user authentication details.");
    localStorage.setItem("redirectAfterUpdate", location.pathname);
    navigate(`/user/${userId}/update-profile`);

  };

  // Fetch user progress and questions together
  const fetchProgressAndQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !userId) throw new Error("Missing user authentication details.");

      // Fetch questions and progress concurrently
      const [questionsResponse, progressResponse] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/survey/questions?page=${currentPage}&limit=10`, {
          credentials: 'include', // Important for cookies or sessions
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.REACT_APP_API_URL}/survey/user/progress?userId=${userId}`, {
          credentials: 'include', // Important for cookies or sessions
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!questionsResponse.ok || !progressResponse.ok) {
        throw new Error("Failed to fetch questions or progress.");
      }

      const questionsData = await questionsResponse.json();
      const progressData = await progressResponse.json();

      console.log("Questions Data:", questionsData);
      console.log("Progress Data:", progressData);

      // Extract questions and validate format
      const questionsArray = Array.isArray(questionsData) ? questionsData : questionsData.data || [];
      if (!Array.isArray(questionsArray)) {
        throw new Error("Questions data is not in the expected array format.");
      }

      // Map progressData to a simpler format
      const completedQuestionIds = progressData.map((q) => q);

      // Filter out completed questions and sort by `order`
      const remainingQuestions = questionsArray
        .filter((q) => !completedQuestionIds.includes(q._id))
        .sort((a, b) => a.order - b.order);

      if (remainingQuestions.length === 0) {
        setSurveyCompleted(true);
        setNavigationModal(true);
      } else {
        // Set state for remaining questions and answered questions
        setQuestions(remainingQuestions);
        setAnsweredQuestions(progressData);
        setCurrentQuestionIndex(0);
      }
    } catch (error) {
      console.error("Error fetching progress and questions:", error);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!questions[currentQuestionIndex]) {
      console.error("No question to answer.");
      return;
    }

    const questionId = questions[currentQuestionIndex]._id;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      const response = await fetch(`${process.env.REACT_APP_API_URL}/survey/answers`, {
        method: "POST",
        credentials: 'include', // Important for cookies or sessions
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, questionId, answer: userAnswer }),
      });

      if (response.ok) {
        // Update progress locally
        setAnsweredQuestions((prev) => [
          ...prev,
          { question: questions[currentQuestionIndex].text, answer: userAnswer },
        ]);

        // Move to next question or mark survey as completed
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
          setCurrentQuestionIndex(nextIndex);
          setUserAnswer("");
        } else {
          setSurveyCompleted(true);
        }
      } else {
        const { message } = await response.json();
        console.error("Error from server:", message);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const progressPercentage = answeredQuestions.length
    ? (answeredQuestions.length / (answeredQuestions.length + questions.length)) * 100
    : 0;

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

      {navigationModal && (
        <Modal show={navigationModal} onHide={() => setNavigationModal(false)} centered>
          <ModalHeader closeButton>
            <Modal.Title>Survey Completed</Modal.Title>
          </ModalHeader>
          <ModalBody>
            Your survey is completed. If you would like to Update your "Survey" responses, click on "Update".
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => navigate(`/user/${userId}/surveyResponse`)}>Update</Button>
            <Button variant="secondary" onClick={() => navigate('/forum')}>Back To Home</Button>
          </ModalFooter>
        </Modal>

      )}
      {/* Display Fetched Answers */}
      <div className="survey-container">
        {loading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <div style={{ textAlign: "center", margin: "20px" }}>
            {/* Title for Previously Answered Questions */}
            {responses.length > 0 && (
              <div className="answered-questions">

                <h2>Answered Questions</h2>
                <ul>
                  {responses.map((qa, index) => (
                    <li key={qa.questionId || index}>

                      <strong>Q: {qa.question} </strong> <br />
                      <strong>A:</strong> {qa.answer}
                    </li>
                  ))}
                </ul>

                <div className="button-group">
                  <Button onClick={() => navigate(`/user/${userId}/surveyResponse`)}> Update Your Responses</Button>
                  <Button onClick={() => navigate("/survey-stats")}>View Survey Statistics</Button>
                </div>


              </div>
            )}




            {/* Title for Survey Completion */}
            {surveyCompleted && questions.length > 0 && (
              <div className="survey-completed">
                <h2>Survey Completed!</h2>
                <h4>Your Responses:</h4>
                <ul>
                  {answeredQuestions.map((answered, index) => (
                    <li key={index}>
                      <strong>{answered.question || "You partialy attend this Questions"}</strong>: {answered.answer || "Answered but not available"}
                    </li>
                  ))}
                </ul>
                <div className="button-group">
                  <Button onClick={() => navigate(`/user/${userId}/surveyResponse`)}> Update Your Responses</Button>
                  <Button onClick={() => navigate("/survey-stats")}>View Survey Statistics</Button>
                </div>
              </div>
            )}

            {/* Title for Ongoing Survey */}
            {!surveyCompleted && questions.length > 0 && (
              <>
                <ProgressBar now={progressPercentage} label={`${Math.round(progressPercentage)}%`} />
                <div>
                  <h4>Currently Answering:</h4>
                  <ul>
                    {answeredQuestions.map((answered, index) => (
                      <li key={index}>
                        <strong>{answered.question || "Visible when Completed"}</strong>: {answered.answer || "Answered but not available"}
                      </li>
                    ))}
                  </ul>
                </div>




                {/* Modal for Current Question */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Survey Question</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <h4>{questions[currentQuestionIndex]?.text || "No question available"}</h4>
                    <Form>
                      <Form.Check
                        type="radio"
                        label="Yes"
                        value="Yes"
                        checked={userAnswer === "Yes"}
                        onChange={(e) => setUserAnswer(e.target.value)}
                      />
                      <Form.Check
                        type="radio"
                        label="No"
                        value="No"
                        checked={userAnswer === "No"}
                        onChange={(e) => setUserAnswer(e.target.value)}
                      />
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleAnswerSubmit} disabled={!userAnswer}>
                      Submit Answer
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            )}
          </div>
        )}
      </div>
      <div>

      </div>


    </>
  );
};

export default Survey;


