import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Container,
  Card,
  Button,
  Alert,
  Spinner,
  Badge,
  ListGroup,
  Form
} from 'react-bootstrap';
import {
  Pencil,
  CheckCircle,
  ArrowLeft,
  Eye,
  Calendar,
  CurrencyRupee,
  ShareFill
} from 'react-bootstrap-icons';

const SurveyPreview = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(location.state?.survey || null);
  const [loading, setLoading] = useState(!location.state?.survey);
  const [error, setError] = useState(null);
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [ isPublished, setIsPublished] = useState(false);

  // Fetch survey if not passed via state
  useEffect(() => {
    if (!survey) {
      const fetchSurvey = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/surveys/${id}`);
          if (!response.ok) throw new Error('Survey not found');
          const data = await response.json();
          console.log('Fetched survey:', data);
          setSurvey(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchSurvey();
    }
  }, [id, survey]);

  const handleResponseChange = (questionIndex, value) => {
    setResponses(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const handleSubmitResponses = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/surveys/${id}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          answers: Object.values(responses)
        })
      });

      if (!response.ok) throw new Error('Failed to submit responses');

      navigate(`/survey/${id}/results`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/surveys/publish_Campaign/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to publish survey');

      setSurvey(prev => ({ ...prev, status: 'active' }));
      setIsPublished(true);
      // navigate(`/survey/${id}/share`, { 
      //   state: { message: 'Survey published successfully!' } 
      // });
    } catch (err) {
      console.error('Publish error:', err);
      setError(err.message || 'Something went wrong');
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
          <Button variant="outline-primary" onClick={() => navigate(-1)}>
            <ArrowLeft className="me-2" />
            Go Back
          </Button>
        </div>
      </Alert>
    </Container>
  );

  if (!survey) return null;

  return (
    <Container className="py-4 pb-5">
      <Button
        variant="outline-secondary"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="me-2" />
        Back to Editor
      </Button>

      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-light d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">{survey.title}</h4>
            <small className="text-muted">{survey.description}</small>
          </div>
          <Badge bg={survey.status === 'draft' ? 'warning' : 'success'}>
            {survey.status === 'draft' ? 'Draft' : 'Published'}
          </Badge>
        </Card.Header>

        <Card.Body>
          {/* Survey Info */}
          <div className="d-flex gap-4 mb-4">
            <div>
              <small className="text-muted d-flex align-items-center">
                <Calendar className="me-2" />
                Duration
              </small>
              <div>{survey.durationDays} days</div>
            </div>
            <div>
              <small className="text-muted d-flex align-items-center">
                <CurrencyRupee className="me-2" />
                Budget
              </small>
              <div>₹{survey.budget}</div>
            </div>
            {survey.isTrial && (
              <div>
                <small className="text-muted">Trial Survey</small>
                <div className="text-primary">24 hours</div>
              </div>
            )}
          </div>

          {/* Survey Questions Preview */}
          <h5 className="mb-3 border-bottom pb-2">
            <Eye className="me-2" />
            Preview
          </h5>

          <Form>
            {survey.questions.map((question, qIndex) => (
              <Form.Group key={qIndex} className="mb-4">
                <Form.Label>
                  {qIndex + 1}. {question.questionText}
                </Form.Label>

                {/* Add this section to display attachments */}
    {question.attachment && (
      <div className="mb-3">
        {question.attachment.includes('image') ? (
          <img 
            src={question.attachment} 
            alt="Question reference" 
            className="img-fluid rounded border"
            style={{ maxHeight: '300px' }}
          />
        ) : question.attachment.includes('video') ? (
          <video 
            controls 
            className="rounded border" 
            style={{ maxWidth: '100%', maxHeight: '300px' }}
          >
            <source src={question.attachment} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : null}
      </div>
    )}

                {question.questionType === 'text' && (
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Type your answer here"
                    onChange={(e) => handleResponseChange(qIndex, e.target.value)}
                  />
                )}

                {['single', 'multiple'].includes(question.questionType) && (
                  <ListGroup variant="flush">
                    {question.options.map((option, optIndex) => (
                      <ListGroup.Item key={optIndex}>
                        <Form.Check
                          type={question.questionType === 'single' ? 'radio' : 'checkbox'}
                          name={`question-${qIndex}`}
                          label={option}
                          onChange={() => handleResponseChange(
                            qIndex,
                            question.questionType === 'single' ? option :
                              [...(responses[qIndex] || []), option]
                          )}
                        />
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Form.Group>
            ))}
          </Form>
        </Card.Body>

        <Card.Footer className="bg-light d-flex justify-content-between">
          {survey.status === 'draft' && (
            <Button
              variant="outline-primary"
              onClick={() => navigate(`/survey/${id}/edit`)}
            >
              <Pencil className="me-2" />
              Edit Survey
            </Button>
          )}

          {survey.status === 'draft' ? (
            <Button
              variant="success"
              onClick={handlePublish}
            >
              <CheckCircle className="me-2" />
              Publish Survey
            </Button>
             ) : (
              <div className='ms-auto'>
              <Button 
              variant="outline-success" 
              size="sm"
              className="ms-2"
              onClick={() => {
                const id = survey._id;
                const shareUrl = `${window.location.origin}/open-survey/byCampaigner/${id}/${survey.status}`;
                navigator.clipboard.writeText(shareUrl);
                alert('Link copied to clipboard!');
              }}
            >
              <ShareFill  size={14} className='mb-1' /> Share
            </Button>
            </div>
          )}
          
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default SurveyPreview;