import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Alert,
  Spinner,
  Form,
  ListGroup,
  Badge,
  Row,
  Col
} from 'react-bootstrap';
import {
  Save,
  ArrowLeft,
  Trash,
  PlusCircle,
  CheckCircle,
  Clock,
  CurrencyRupee
} from 'react-bootstrap-icons';

const EditSurveyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [survey, setSurvey] = useState(location.state?.survey || null);
  const [loading, setLoading] = useState(!location.state?.survey);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);


// Updated state initialization
const [attachmentPreviews, setAttachmentPreviews] = useState({});
const [newAttachments, setNewAttachments] = useState({});
const [attachmentChanges, setAttachmentChanges] = useState({});





  // Fetch survey if not passed via state
  useEffect(() => {
    if (!survey) {
      const fetchSurvey = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/surveys/${id}`);
          if (!response.ok) throw new Error('Survey not found');
          const data = await response.json();
          setSurvey(data);
          console.log('dita', data);
          
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchSurvey();
    }
  }, [id]);



useEffect(() => {
  return () => {
    Object.values(attachmentPreviews).forEach(preview => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    });
  };
}, [attachmentPreviews]);



// Improved initialization effect
useEffect(() => {
  if (survey) {
    const initialPreviews = {};
    const initialAttachments = {};
    const initialChanges = {};
    
    survey.questions.forEach((q, idx) => {
      if (q.attachment) {
        initialPreviews[idx] = q.attachment;
        initialAttachments[idx] = { file: null, type: q.attachment.includes('image') ? 'image' : 'video' };
        initialChanges[idx] = { changed: false, removed: false };
      }
    });
    
    setAttachmentPreviews(initialPreviews);
    setNewAttachments(initialAttachments);
    setAttachmentChanges(initialChanges);
  }
}, [survey]);

// Updated handleAttachmentChange
const handleAttachmentChange = (qIndex, file) => {
  if (!file) return;

  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg'];
  if (!validTypes.includes(file.type)) {
    setError('Please upload a valid image (JPEG, PNG, GIF) or video (MP4, WebM, Ogg)');
    return;
  }

  const type = file.type.startsWith('image') ? 'image' : 'video';
  
  if (type === 'image') {
    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachmentPreviews(prev => ({ ...prev, [qIndex]: reader.result }));
      setNewAttachments(prev => ({ ...prev, [qIndex]: { file, type } }));
      setAttachmentChanges(prev => ({ ...prev, [qIndex]: { changed: true, removed: false } }));
    };
    reader.readAsDataURL(file);
  } else {
    const previewUrl = URL.createObjectURL(file);
    setAttachmentPreviews(prev => ({ ...prev, [qIndex]: previewUrl }));
    setNewAttachments(prev => ({ ...prev, [qIndex]: { file, type } }));
    setAttachmentChanges(prev => ({ ...prev, [qIndex]: { changed: true, removed: false } }));
  }
};

// Updated removeAttachment
const removeAttachment = (qIndex) => {
  setAttachmentPreviews(prev => {
    const newPreviews = { ...prev };
    delete newPreviews[qIndex];
    return newPreviews;
  });
  
  setAttachmentChanges(prev => ({ ...prev, [qIndex]: { changed: true, removed: true } }));
};


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSurvey(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[index][field] = value;
    setSurvey(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...survey.questions];
    const options = [...updatedQuestions[qIndex].options];
    
    if (value === '') {
      options.splice(optIndex, 1);
    } else {
      options[optIndex] = value;
    }
    
    updatedQuestions[qIndex].options = options;
    setSurvey(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const addQuestion = () => {
    setSurvey(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { questionText: '', questionType: 'text', options: [] }
      ]
    }));
  };

  const removeQuestion = (index) => {
    if (survey.questions.length <= 1) return;
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const addOption = (qIndex) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[qIndex].options = [...updatedQuestions[qIndex].options, ''];
    setSurvey(prev => ({ ...prev, questions: updatedQuestions }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setSaving(true);
  //   setError(null);

  //   try {
  //     // Validate at least 2 options for choice questions
  //     const invalidQuestion = survey.questions.find(q => 
  //       ['single', 'multiple'].includes(q.questionType) && q.options.length < 2
  //     );
      
  //     if (invalidQuestion) {
  //       throw new Error('Choice questions must have at least 2 options');
  //     }

  //     const response = await fetch(`${process.env.REACT_APP_API_URL}/api/surveys/${id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`
  //       },
  //       body: JSON.stringify(survey)
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || 'Failed to update survey');
  //     }

  //     navigate(`/survey/${id}/preview`, {
  //       state: { 
  //         survey: await response.json(),
  //         message: 'Survey updated successfully!' 
  //       }
  //     });
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setSaving(false);
  //   }
  // };

// Modified handleSubmit
// Updated handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  setError(null);

  try {
    // Validation
    const invalidQuestion = survey.questions.find(q => 
      ['single', 'multiple'].includes(q.questionType) && q.options.length < 2
    );
    if (invalidQuestion) throw new Error('Choice questions must have at least 2 options');

    const formData = new FormData();
    
    // Prepare questions with proper attachment flags
    const questionsWithAttachmentFlags = survey.questions.map((q, idx) => ({
      ...q,
      hasNewAttachment: attachmentChanges[idx]?.changed && !attachmentChanges[idx]?.removed,
      removeAttachment: attachmentChanges[idx]?.removed || false
    }));

    formData.append('survey', JSON.stringify({
      ...survey,
      questions: questionsWithAttachmentFlags
    }));

    // Add new attachments
    Object.entries(newAttachments).forEach(([qIndex, attachmentData]) => {
      if (attachmentChanges[qIndex]?.changed && 
          !attachmentChanges[qIndex]?.removed && 
          attachmentData.file) {
        formData.append(`question_${qIndex}_attachment`, attachmentData.file);
      }
    });

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/surveys/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update survey');
    }

    navigate(`/survey/${id}/preview`, {
      state: { 
        survey: await response.json(),
        message: 'Survey updated successfully!' 
      }
    });
  } catch (err) {
    setError(err.message);
  } finally {
    setSaving(false);
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
        Back
      </Button>

      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <h4>Edit Survey</h4>
          <Badge bg={survey.status === 'draft' ? 'warning' : 'success'}>
            {survey.status}
          </Badge>
        </Card.Header>
        
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <Row className="mb-4">
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Survey Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={survey.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Organization</Form.Label>
                  <Form.Control
                    type="text"
                    name="orgName"
                    value={survey.orgName}
                    onChange={handleChange}
                    readOnly={survey.status !== 'draft'}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={survey.description}
                onChange={handleChange}
                rows={3}
                required
              />
            </Form.Group>

            {/* Campaign Details */}
            <Row className="mb-4 g-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <Clock className="me-2" />
                    Duration (days)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="durationDays"
                    value={survey.durationDays}
                    onChange={handleChange}                    
                    disabled={survey.durationDays || survey.status !== 'draft'}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <CurrencyRupee className="me-2" />
                    Budget (₹)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="budget"
                    value={survey.budget}
                    onChange={handleChange}
                    
                    disabled={survey.budget || survey.status !== 'draft'}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                {survey.isTrial && (
                  <div className="border p-2 rounded bg-light">
                    <small className="text-muted">Trial Survey</small>
                    <div className="text-primary">24 hours only</div>
                  </div>
                )}
              </Col>
            </Row>

            {/* Questions */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Questions</h5>
                
              </div>
              
              {survey.questions.map((question, qIndex) => (
                <Card key={qIndex} className="mb-3">
                  <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                    <span>Question {qIndex + 1}</span>
                    {survey.questions.length > 1 && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeQuestion(qIndex)}
                      >
                        <Trash size={14} />
                      </Button>
                    )}
                  </Card.Header>
                  
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Question Text</Form.Label>
                      <Form.Control
                        type="text"
                        value={question.questionText}
                        onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                        required
                      />
                    </Form.Group>


                    {/* Add this attachment section */}
<Form.Group className="mb-3">
  <Form.Label>Reference Media (Optional)</Form.Label>
  {attachmentPreviews[qIndex] ? (
    <div className="mb-2">
      {newAttachments[qIndex]?.type === 'image' || 
       (survey.questions[qIndex].attachment && 
        survey.questions[qIndex].attachment.includes('image')) ? (
        <img 
          src={attachmentPreviews[qIndex]} 
          alt="Question reference" 
          className="img-fluid rounded border"
          style={{ maxHeight: '200px' }}
          onError={() => setAttachmentPreviews(prev => ({ ...prev, [qIndex]: null }))}
        />
      ) : (
        <video 
          controls 
          className="rounded border" 
          style={{ maxWidth: '100%', maxHeight: '200px' }}
          onError={() => setAttachmentPreviews(prev => ({ ...prev, [qIndex]: null }))}
        >
          <source src={attachmentPreviews[qIndex]} />
          Your browser does not support this media.
        </video>
      )}
      <Button
        variant="danger"
        size="sm"
        className="ms-2"
        onClick={() => removeAttachment(qIndex)}
      >
        <Trash size={14} />
      </Button>
    </div>
  ) : (
    <Form.Control
      type="file"
      accept="image/*,video/*"
      onChange={(e) => handleAttachmentChange(qIndex, e.target.files[0])}
    />
  )}
  <Form.Text className="text-muted">
    Add an optional image or video reference
  </Form.Text>
</Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Answer Type</Form.Label>
                      <Form.Select
                        value={question.questionType}
                        onChange={(e) => handleQuestionChange(qIndex, 'questionType', e.target.value)}
                      >
                        <option value="text">Text Answer</option>
                        <option value="single">Single Choice</option>
                        <option value="multiple">Multiple Choice</option>
                      </Form.Select>
                    </Form.Group>

                    {['single', 'multiple'].includes(question.questionType) && (
                      <Form.Group className="mb-3">
                        <Form.Label>Options</Form.Label>
                        <ListGroup variant="flush">
                          {question.options.map((option, optIndex) => (
                            <ListGroup.Item key={optIndex} className="d-flex align-items-center">
                              <Form.Control
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                                placeholder={`Option ${optIndex + 1}`}
                              />
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="ms-2"
                                onClick={() => handleOptionChange(qIndex, optIndex, '')}
                              >
                                <Trash size={12} />
                              </Button>
                            </ListGroup.Item>
                          ))}
                          <ListGroup.Item>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => addOption(qIndex)}
                            >
                              <PlusCircle className="me-1" />
                              Add Option
                            </Button>
                          </ListGroup.Item>
                        </ListGroup>
                        {question.options.length < 2 && (
                          <Form.Text className="text-danger">
                            At least 2 options required
                          </Form.Text>
                        )}
                      </Form.Group>
                    )}

                    
                      
                      
                  </Card.Body>
                </Card>
              ))}
              
<div className="d-flex justify-content-end">
              <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={addQuestion}
                >
                  <PlusCircle className="me-2" />
                  Add Question
                </Button></div>
            </div>

            <div className="d-flex justify-content-between">
              <Button 
                variant="outline-secondary"
                onClick={() => navigate(`/survey/${id}/preview`)}
              >
                Cancel
              </Button>
              
              <Button 
                variant="primary" 
                type="submit"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="me-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditSurveyPage;