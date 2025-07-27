import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  ProgressBar,
  Modal,
  Badge
} from 'react-bootstrap';
import { CheckCircle, ArrowLeft, ShareFill, Link } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import ShareModal from '../Components/Common/ShareSurveyModal';

import { WhatsappShareButton, WhatsappIcon, FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon } from 'react-share';
import { FaLink } from "react-icons/fa";
import { motion } from 'framer-motion';
import AuthContext from '../Context/AuthContext';


const SurveyParticipationPage = () => {
  const { id, status } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [responses, setResponses] = useState({});
  const [completed, setCompleted] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { user } = useContext(AuthContext);



  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/surveys/adminCreated`);
        if (!response.ok) throw new Error('Survey not found');
        const data = await response.json();
        console.log('Survey data admin:', data);
        setSurvey(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [id]);

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // const handleSubmit = (surveyId) => async (e) => {
  //   e.preventDefault();
  //   setSubmitting(true);
  //   setError(null);

  //   try {
  //     // Prepare submission data
  //     const submission = {
  //       answers: responses,
  //       ...(!localStorage.getItem('token') && {
  //         anonymousId: localStorage.getItem('anonymousId') ||
  //           `anon_${Math.random().toString(36).substr(2, 9)}`
  //       })
  //     };

  //     // Store anonymous ID if needed
  //     if (submission.anonymousId && !localStorage.getItem('anonymousId')) {
  //       localStorage.setItem('anonymousId', submission.anonymousId);
  //     }

  //     const response = await fetch(`${process.env.REACT_APP_API_URL}/api/surveys/${surveyId}/respond`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         ...(localStorage.getItem('token') && {
  //           'Authorization': `Bearer ${localStorage.getItem('token')}`
  //         })
  //       },
  //       body: JSON.stringify(submission)
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || 'Submission failed');
  //     }

  //     setCompleted(true);
      
  //   } catch (err) {
  //     setError(err.message);
  //     console.error('Submission error:', err);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const handleSubmit = (surveyId) => async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Prepare submission data
      const submission = {
        answers: responses,
        ...(!localStorage.getItem('token') && {
          anonymousId: localStorage.getItem('anonymousId') ||
            `anon_${Math.random().toString(36).substr(2, 9)}`
        })
      };

      // Store anonymous ID if needed
      if (submission.anonymousId && !localStorage.getItem('anonymousId')) {
        localStorage.setItem('anonymousId', submission.anonymousId);
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/surveys/${surveyId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') && {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          })
        },
        body: JSON.stringify(submission)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Submission failed');
      }

      // Mark survey as completed in localStorage (for anonymous users)
      if (!localStorage.getItem('token')) {
        try {
          const completed = JSON.parse(localStorage.getItem('completedSurveys') || []);
          if (!completed.includes(surveyId)) {
            localStorage.setItem(
              'completedSurveys', 
              JSON.stringify([...completed, surveyId])
            );
          }
        } catch (error) {
          console.error('Error updating completed surveys:', error);
          // Initialize if corrupted
          localStorage.setItem('completedSurveys', JSON.stringify([surveyId]));
        }
      }

      // Clear any dismissals for this survey
      try {
        const dismissed = JSON.parse(localStorage.getItem('dismissedSurveys') || []);
        const updatedDismissals = dismissed.filter(id => id !== surveyId);
        localStorage.setItem('dismissedSurveys', JSON.stringify(updatedDismissals));
      } catch (error) {
        console.error('Error cleaning dismissals:', error);
      }

      setCompleted(true);

    } catch (err) {
      setError(err.message);
      console.error('Submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) return (
    <Container className="text-center py-5">
      <Spinner animation="border" />
      <p>Loading survey...</p>
    </Container>
  );

  if (error) return (
    <Container className="py-5">
      <Alert variant="danger">
        {error}
        <div className="mt-3">
          <Button variant="outline-primary" onClick={() => navigate('/')}>
            <ArrowLeft className="me-2" />
            Back to Dashboard
          </Button>
        </div>
      </Alert>
    </Container>
  );

  if (!survey) return null;

  if (completed) return (
    <Container className="text-center py-5">
      <CheckCircle size={48} className="text-success mb-3" />
      <h3>Thank you for participating!</h3>
      <p>Your responses have been recorded.</p>
      <Button variant="primary" onClick={() => navigate('/')}>
        View Other Dashboard
      </Button>
      <Button variant="primary" onClick={() => navigate('/')}>
        View Survey Result
      </Button>
    </Container>
  );

  const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
      <Button
        variant="outline-secondary"
        onClick={() => navigate('/')}
        className="mb-4"
      >
        <ArrowLeft className="me-2" />
        Back to Surveys
      </Button>

      {user?.role === "admin" && (
                <Button
                variant="outline-secondary"
                onClick={() => navigate('/admin')}
                className="mb-4"
              >
                <ArrowLeft className="me-2" />
                Back to Admin Pannel
                </Button>
              )}
              </div>

      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-light">
          <div className='d-flex  flex-row'>
            <div>
              <h3>{survey.title}</h3>
              <p className="mb-0 text-muted">{survey.description}</p>
              <div className="d-flex align-items-center mt-2">
                <Badge bg="info" className="me-2">
                  {survey.responses?.length || 0} responses
                </Badge>
                <small className="text-muted">
                  {survey.status === 'active' ?
                    `Open` :
                    'Survey closed'}
                </small>
              </div>
            </div>


            <div className='ms-auto d-flex align-items-center'>
              <Button
                variant="outline-success"
                size="sm"
                className="ms-2"
                onClick={() => {
                  const id = survey._id || survey.createdBy;
                  setShareUrl(`${window.location.origin}/open-survey/byAdmin/${id}/${survey.status}`);
                  // navigator.clipboard.writeText(shareUrl);
                  // alert('Link copied to clipboard!');
                  setShowShareModal(true);
                }}
              >
                <ShareFill size={14} className='mb-1' /> Share
              </Button>


              <ShareModal
                show={showShareModal}
                onHide={() => setShowShareModal(false)}
                shareUrl={shareUrl}
              />

            </div>
          </div>
        </Card.Header>

        <Card.Body>
          {/* <Form onSubmit={handleSubmit(survey._id)}>
            {survey.questions.map((question, index) => (
              <Form.Group key={question._id} className="mb-4">
                <Form.Label className="fw-bold">
                  {index + 1}. {question.questionText}
                </Form.Label>

                {question.questionType === 'text' && (
                  <Form.Control
                    as="textarea"
                    rows={3}
                    onChange={(e) => handleResponseChange(question._id, e.target.value)}
                    required
                  />
                )}

                {question.questionType === 'single' && (
                  <div className="ms-3">
                    {question.options.map((option, optIndex) => (
                      <Form.Check
                        key={optIndex}
                        type="radio"
                        name={`question-${question._id}`}
                        label={option}
                        onChange={() => handleResponseChange(question._id, option)}
                        required
                      />
                    ))}
                  </div>
                )}

                {question.questionType === 'multiple' && (
                  <div className="ms-3">
                    {question.options.map((option, optIndex) => (
                      <Form.Check
                        key={optIndex}
                        type="checkbox"
                        name={`question-${question._id}-${optIndex}`}
                        label={option}
                        onChange={() => {
                          const current = responses[question._id] || [];
                          const updated = current.includes(option) ?
                            current.filter(opt => opt !== option) :
                            [...current, option];
                          handleResponseChange(question._id, updated);
                        }}
                      />
                    ))}
                  </div>
                )}
              </Form.Group>
            ))}

            <div className="d-grid mt-4">
              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={submitting || survey.status !== 'active'}
              >
                {submitting ? 'Submitting...' : 'Submit Responses'}
              </Button>
              {survey.status !== 'active' && (
                <Alert variant="warning" className="mt-3">
                  This survey is no longer accepting responses
                </Alert>
              )}
            </div>
          </Form> */}

          <Form onSubmit={handleSubmit(survey._id)}>
            <ProgressBar
              animated
              style={{ height: '20px' }}
              now={progress}
              label={`${Math.round(progress)}%`}
              className="mb-4"
            />

            <motion.div
              key={currentQuestionIndex}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">
                  {currentQuestionIndex + 1}. {survey.questions[currentQuestionIndex].questionText}
                </Form.Label>


                      {/* Add this section to display question attachments */}
      {survey.questions[currentQuestionIndex].attachment && (
        <div className="mb-3 d-flex justify-content-center">
          {survey.questions[currentQuestionIndex].attachment.includes('image') ? (
            <img 
              src={survey.questions[currentQuestionIndex].attachment} 
              alt="Question reference"
              className="img-fluid rounded border"
              style={{ maxHeight: '200px' }}
            />
          ) : survey.questions[currentQuestionIndex].attachment.includes('video') ? (
            <video 
              key={survey.questions[currentQuestionIndex].attachment} // ensures re-render
              controls
              className="rounded border"
              style={{ maxWidth: '100%', maxHeight: '200px' }}
            >
              <source 
                src={survey.questions[currentQuestionIndex].attachment} 
                type={
                  survey.questions[currentQuestionIndex].attachment.includes('mp4') ? 'video/mp4' :
                  survey.questions[currentQuestionIndex].attachment.includes('webm') ? 'video/webm' :
                  'video/ogg'
                }
              />
              Your browser does not support the video tag.
            </video>
          ) : null}
        </div>
      )}

                {/* Render based on type */}
                {survey.questions[currentQuestionIndex].questionType === 'text' && (
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={responses[survey.questions[currentQuestionIndex]._id] || ''}
                    onChange={(e) =>
                      handleResponseChange(survey.questions[currentQuestionIndex]._id, e.target.value)
                    }
                    required
                  />
                )}

                {survey.questions[currentQuestionIndex].questionType === 'single' && (
                  <div className="ms-3">
                    {survey.questions[currentQuestionIndex].options.map((option, i) => (
                      <Form.Check
                        key={i}
                        type="radio"
                        name={`question-${survey.questions[currentQuestionIndex]._id}`}
                        label={option}
                        checked={responses[survey.questions[currentQuestionIndex]._id] === option}
                        onChange={() =>
                          handleResponseChange(survey.questions[currentQuestionIndex]._id, option)
                        }
                        required
                      />
                    ))}
                  </div>
                )}

                {survey.questions[currentQuestionIndex].questionType === 'multiple' && (
                  <div className="ms-3">
                    {survey.questions[currentQuestionIndex].options.map((option, i) => {
                      const current = responses[survey.questions[currentQuestionIndex]._id] || [];
                      return (
                        <Form.Check
                          key={i}
                          type="checkbox"
                          label={option}
                          checked={current.includes(option)}
                          onChange={() => {
                            const updated = current.includes(option)
                              ? current.filter((opt) => opt !== option)
                              : [...current, option];
                            handleResponseChange(survey.questions[currentQuestionIndex]._id, updated);
                          }}
                        />
                      );
                    })}
                  </div>
                )}
              </Form.Group>
            </motion.div>

            <div className="d-flex justify-content-between mt-3">
              <Button
                variant="outline-secondary"
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>

              {currentQuestionIndex === survey.questions.length - 1 ? (
                <Button
                  variant="primary"
                  type="submit"
                  disabled={submitting || survey.status !== 'active'}
                >
                  {submitting ? 'Submitting...' : 'Submit Responses'}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  disabled={
                    !responses[survey.questions[currentQuestionIndex]._id] ||
                    responses[survey.questions[currentQuestionIndex]._id].length === 0
                  }
                >
                  Next
                </Button>
              )}
            </div>
          </Form>



        </Card.Body>
      </Card>
    </Container>
  );
};

export default SurveyParticipationPage;