


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  FormControl,
  FormSelect,
  FormCheck,
  Alert,
  ListGroup,
  Badge,
  Tabs,
  Tab,
  Image
} from 'react-bootstrap';
import {
  PlusCircle,
  Trash,
  Save,
  ArrowLeft,
  Clock,
  CurrencyRupee,
  Building,
  CardChecklist
} from 'react-bootstrap-icons';
import { handleSuccess } from '../../Components/Util';
import LoadingSpinner from '../../Components/Common/LoadingSpinner';



const SurveyCreateForm = ({ user }) => {
  console.log('oncreate survey', user);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTrialAvailable, setIsTrialAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState('phonepe');
  const [previewImage, setPreviewImage] = useState('');



  const phonepe200 = '/pp200.webp';
  const phonepe300 = '/pp300.webp';
  const phonepe400 = '/pp400.webp';
  const googlepay200 = '/gp200.webp';
  const googlepay300 = '/gp300.webp';
  const googlepay400 = '/gp400.webp';
  const paytm200 = '/ptm200.webp';
  const paytm300 = '/ptm300.webp';
  const paytm400 = '/ptm400.webp';


  // Pricing based on duration
  const pricing = {
    7: 200,
    15: 300,
    30: 400
  };

  const [surveyData, setSurveyData] = useState({
    title: '',
    description: '',
    orgName: user?.orgName,
    durationDays: user?.campaignDuration || 0,
    budget: user?.campaignAmount || 0,
    isTrial: false,
    paymentSlip: null,
    questions: [
      {
        text: '',
        type: 'text',
        options: [],
        attachment: null,
        attachmentPreview: null,
        attachmentType: null // 'image' or 'video'
      }
    ]
  });

  // QR code images mapping
  const qrCodes = {
    phonepe: {
      200: phonepe200,
      300: phonepe300,
      400: phonepe400
    },
    googlepay: {
      200: googlepay200,
      300: googlepay300,
      400: googlepay400
    },
    paytm: {
      200: paytm200,
      300: paytm300,
      400: paytm400
    }
  };

  // Check trial eligibility and initialize form
  useEffect(() => {
    if (user?.isCampaigner === true && !user?.isTrialUsed) {
      setIsTrialAvailable(true);
    }

    // If user has no campaign plan, set default duration
    if (!user?.campaignDuration && !user?.campaignAmount) {
      setSurveyData(prev => ({
        ...prev,
        durationDays: 7,
        budget: pricing[7]
      }));
    }
  }, [user]);

  const renderPaymentQR = () => {
    const amount = surveyData.budget;
    if (!amount || amount === 0) return null;

    const paymentMethod = activeTab;
    const qrImage = qrCodes[paymentMethod][amount];

    return (
      <div className="text-center">
        <Image
          src={qrImage}
          fluid
          className="border p-2"
          style={{ maxHeight: '250px' }}
          alt={`${paymentMethod} QR code for INR ${amount}`}
        />
      </div>
    );
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
        setSurveyData({ ...surveyData, [name]: file });
      }
    } else if (type === 'checkbox') {
      setSurveyData({ ...surveyData, [name]: checked });
    } else {
      setSurveyData({ ...surveyData, [name]: value });
    }
  };

  const handleDurationChange = (e) => {
    const duration = parseInt(e.target.value);
    const amount = pricing[duration] || 0;

    setSurveyData({
      ...surveyData,
      durationDays: duration,
      budget: amount
    });
  };

  // ... (keep all your existing question handling methods) ...


  const questionTypes = [
    { value: 'text', label: 'Text Answer' },
    { value: 'single', label: 'Single Choice' },
    { value: 'multiple', label: 'Multiple Choice' },
    
  ];

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...surveyData.questions];
    updatedQuestions[index][field] = value;
    setSurveyData(prev => ({ ...prev, questions: updatedQuestions }));
  };




  // File type validation
const isValidMediaFile = (file) => {
  const validTypes = [
    'image/jpeg', 
    'image/png', 
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/ogg'
  ];
  return validTypes.includes(file.type);
};

// Add this above the questions section
const handleQuestionMedia = (qIndex, file) => {
  if (!file) return;

  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg'];
  if (!validTypes.includes(file.type)) {
    setError('Please upload a valid image (JPEG, PNG, GIF) or video (MP4, WebM, Ogg)');
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    setSurveyData(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[qIndex] = {
        ...updatedQuestions[qIndex],
        attachment: file,
        attachmentPreview: reader.result,
        attachmentType: file.type.startsWith('image') ? 'image' : 'video'
      };
      return { ...prev, questions: updatedQuestions };
    });
  };

  if (file.type.startsWith('image')) {
    reader.readAsDataURL(file);
  } else {
    // For videos, create object URL
    setSurveyData(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[qIndex] = {
        ...updatedQuestions[qIndex],
        attachment: file,
        attachmentPreview: URL.createObjectURL(file),
        attachmentType: 'video'
      };
      return { ...prev, questions: updatedQuestions };
    });
  }
};

const removeQuestionAttachment = (qIndex) => {
  setSurveyData(prev => {
    const updatedQuestions = [...prev.questions];
    // Revoke object URL if it's a video
    if (updatedQuestions[qIndex].attachmentType === 'video') {
      URL.revokeObjectURL(updatedQuestions[qIndex].attachmentPreview);
    }
    updatedQuestions[qIndex] = {
      ...updatedQuestions[qIndex],
      attachment: null,
      attachmentPreview: null,
      attachmentType: null
    };
    return { ...prev, questions: updatedQuestions };
  });
};


useEffect(() => {
  return () => {
    surveyData.questions.forEach(q => {
      if (q.attachmentType === 'video' && q.attachmentPreview) {
        URL.revokeObjectURL(q.attachmentPreview);
      }
    });
  };
}, [surveyData.questions]);


  // Add new empty option
  const addOption = (qIndex) => {
    setSurveyData(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[qIndex].options = [...updatedQuestions[qIndex].options, ''];
      return { ...prev, questions: updatedQuestions };
    });
  };

  // Update existing option
  const updateOption = (qIndex, optIndex, value) => {
    setSurveyData(prev => {
      const updatedQuestions = [...prev.questions];
      const updatedOptions = [...updatedQuestions[qIndex].options];
      updatedOptions[optIndex] = value;
      updatedQuestions[qIndex].options = updatedOptions;
      return { ...prev, questions: updatedQuestions };
    });
  };

  // Remove option
  const removeOption = (qIndex, optIndex) => {
    setSurveyData(prev => {
      const updatedQuestions = [...prev.questions];
      const updatedOptions = [...updatedQuestions[qIndex].options];
      updatedOptions.splice(optIndex, 1);
      updatedQuestions[qIndex].options = updatedOptions;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const addQuestion = () => {
    setSurveyData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { text: '', type: 'text', options: [] }
      ]
    }));
  };

  const removeQuestion = (index) => {
    if (surveyData.questions.length <= 1) return;
    setSurveyData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     // Basic validation for all users
  //     if (!surveyData.title.trim()) {
  //       throw new Error('Survey title is required');
  //     }

  //     // Validate questions
  //     if (surveyData.questions.some(q => !q.text.trim())) {
  //       throw new Error('All questions must have text');
  //     }

  //     // Validate options for choice questions
  //     for (const q of surveyData.questions) {
  //       if (['single', 'multiple'].includes(q.type)) {
  //         if (q.options.length < 2) {
  //           throw new Error('Choice questions must have at least 2 options');
  //         }
  //         if (q.options.some(opt => !opt.trim())) {
  //           throw new Error('All options must have text');
  //         }
  //       }
  //     }

  //     // Skip campaign validation for admin users
  //     if (user?.role !== 'admin') {
  //       // Additional validation for non-admin users
  //       if (!user?.campaignAmount && !user?.campaignDuration) {
  //         if (surveyData.durationDays <= 0) {
  //           throw new Error('Please select a valid duration');
  //         }
  //         if (surveyData.budget <= 0 && !surveyData.isTrial) {
  //           throw new Error('Please complete the payment process');
  //         }
  //         if (!surveyData.paymentSlip && !surveyData.isTrial) {
  //           throw new Error('Payment slip is required');
  //         }
  //       }
  //     }

  //     const formData = new FormData();

  //     // Add common fields for all users
  //     formData.append('title', surveyData.title);
  //     formData.append('description', surveyData.description);

  //     // Format questions properly for backend
  //     const formattedQuestions = surveyData.questions.map(q => ({
  //       questionText: q.text,
  //       questionType: q.type,
  //       options: q.options
  //     }));
  //     formData.append('questions', JSON.stringify(formattedQuestions));

  //     // Add organization name if exists
  //     if (surveyData.orgName) {
  //       formData.append('orgName', surveyData.orgName);
  //     }

  //     // Add campaign details only for non-admin users
  //     if (user?.role !== 'admin') {
  //       formData.append('durationDays', surveyData.durationDays);
  //       formData.append('budget', surveyData.budget);
  //       formData.append('isTrial', surveyData.isTrial);

  //       // Add payment slip if exists (for non-admin, non-trial)
  //       if (surveyData.paymentSlip && !surveyData.isTrial) {
  //         formData.append('paymentSlip', surveyData.paymentSlip);
  //       }
  //     }

  //     // Debug: Log the FormData contents
  //     for (let [key, value] of formData.entries()) {
  //       console.log(key, value);
  //     }

  //     const response = await fetch(`${process.env.REACT_APP_API_URL}/api/surveys/create-survey`, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`
  //       },
  //       body: formData
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || 'Failed to create survey');
  //     }

  //     const result = await response.json();
  //     navigate(`/survey/${result._id}/preview`);
  //     handleSuccess('Survey created successfully!');
  //   } catch (err) {
  //     setError(err.message);
  //     console.error('Survey creation error:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    // Basic validation for all users
    if (!surveyData.title.trim()) {
      throw new Error('Survey title is required');
    }

    // Validate questions
    if (surveyData.questions.some(q => !q.text.trim())) {
      throw new Error('All questions must have text');
    }

    // Validate options for choice questions
    for (const q of surveyData.questions) {
      if (['single', 'multiple'].includes(q.type)) {
        if (q.options.length < 2) {
          throw new Error('Choice questions must have at least 2 options');
        }
        if (q.options.some(opt => !opt.trim())) {
          throw new Error('All options must have text');
        }
      }
    }

    // Skip campaign validation for admin users
    if (user?.role !== 'admin') {
      // Additional validation for non-admin users
      if (!user?.campaignAmount && !user?.campaignDuration) {
        if (surveyData.durationDays <= 0) {
          throw new Error('Please select a valid duration');
        }
        if (surveyData.budget <= 0 && !surveyData.isTrial) {
          throw new Error('Please complete the payment process');
        }
        if (!surveyData.paymentSlip && !surveyData.isTrial) {
          throw new Error('Payment slip is required');
        }
      }
    }

    const formData = new FormData();

    // Add common fields for all users
    formData.append('title', surveyData.title);
    formData.append('description', surveyData.description);

    // Format questions with attachments
    surveyData.questions.forEach((q, qIndex) => {
      const questionData = {
        questionText: q.text,
        questionType: q.type,
        options: q.options
      };
      
      // Add attachment if exists
      if (q.attachment) {
        formData.append(`question_${qIndex}_attachment`, q.attachment);
        // Add metadata about the attachment
        formData.append(`question_${qIndex}_attachmentType`, q.attachmentType);
      }
      
      return questionData;
    });
    
    formData.append('questions', JSON.stringify(
      surveyData.questions.map(q => ({
        questionText: q.text,
        questionType: q.type,
        options: q.options
      }))
    ));

    // Add organization name if exists
    if (surveyData.orgName) {
      formData.append('orgName', surveyData.orgName);
    }

    // Add campaign details only for non-admin users
    if (user?.role !== 'admin') {
      formData.append('durationDays', surveyData.durationDays);
      formData.append('budget', surveyData.budget);
      formData.append('isTrial', surveyData.isTrial);

      // Add payment slip if exists (for non-admin, non-trial)
      if (surveyData.paymentSlip && !surveyData.isTrial) {
        formData.append('paymentSlip', surveyData.paymentSlip);
      }
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/surveys/create-survey`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create survey');
    }

    const result = await response.json();
    navigate(`/survey/${result._id}/preview`);
    handleSuccess('Survey created successfully!');
  } catch (err) {
    setError(err.message);
    console.error('Survey creation error:', err);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Container className="py-4 pb-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">
                <CardChecklist className="me-2" />
                Create New Survey
              </h3>
            </Card.Header>

            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                {/* Basic Information Section */}
                <div className="mb-4">
                  <h5 className="mb-3 border-bottom pb-2">
                    <Building className="me-2" />
                    Survey Information
                  </h5>

                  <Form.Group className="mb-3">
                    <Form.Label>Survey Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={surveyData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Customer Satisfaction Survey"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={surveyData.description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Explain the purpose of this survey"
                      required
                    />
                  </Form.Group>

                  {user?.orgName && (
                    <Form.Group className="mb-3">
                      <Form.Label>Organization Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="orgName"
                        value={surveyData.orgName}
                        onChange={handleInputChange}
                        disabled
                      />
                    </Form.Group>
                  )}
                </div>

                {/* Campaign Details Section */}
                {user?.role !== 'admin' && (
                  <div className="mb-4">
                    <h5 className="mb-3 border-bottom pb-2">
                      <Clock className="me-2" />
                      Campaign Details
                    </h5>

                    {user?.campaignDuration && user?.campaignAmount ? (
                      // Display for users with existing campaign plan
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Duration (days)</Form.Label>
                            <Form.Control
                              type="number"
                              name="durationDays"
                              value={surveyData.durationDays}
                              onChange={handleInputChange}
                              min={1}
                              max={user.campaignDuration}
                              required
                            />
                            <Form.Text className="text-muted">
                              Your plan allows up to {user.campaignDuration} days
                            </Form.Text>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              <CurrencyRupee className="me-1" />
                              Budget (₹)
                            </Form.Label>
                            <Form.Control
                              type="number"
                              name="budget"
                              value={surveyData.budget}
                              onChange={handleInputChange}
                              min={0}
                              max={user.campaignAmount}
                              required
                            />
                            <Form.Text className="text-muted">
                              Your plan budget: ₹{user.campaignAmount}
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>
                    ) : (
                      // Display for users without campaign plan
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label>Campaign Duration (Days)</Form.Label>
                          <Form.Select
                            name="durationDays"
                            value={surveyData.durationDays}
                            onChange={handleDurationChange}
                            required
                          >
                            <option value="0">Select duration</option>
                            <option value="7">7 Days (INR 200)</option>
                            <option value="15">15 Days (INR 300)</option>
                            <option value="30">30 Days (INR 400)</option>
                          </Form.Select>
                        </Form.Group>

                        {surveyData.budget > 0 && (
                          <>
                            <div className="mb-3">
                              <h5>Payment Options</h5>
                              <Tabs
                                activeKey={activeTab}
                                onSelect={(k) => setActiveTab(k)}
                                className="mb-3"
                              >
                                <Tab eventKey="phonepe" title="PhonePe">
                                  {renderPaymentQR()}
                                </Tab>
                                <Tab eventKey="googlepay" title="Google Pay">
                                  {renderPaymentQR()}
                                </Tab>
                                <Tab eventKey="paytm" title="Paytm">
                                  {renderPaymentQR()}
                                </Tab>
                              </Tabs>

                              <div className="alert alert-info">
                                <strong>Payment Instructions:</strong>
                                <ol className="mb-0">
                                  <li>Select your preferred payment app</li>
                                  <li>Scan the QR code with your app</li>
                                  <li>Verify the amount matches automatically</li>
                                  <li>Complete the payment</li>
                                  <li>Upload the payment screenshot below</li>
                                </ol>
                              </div>
                            </div>


                            <Form.Group className="mb-3">
                              <Form.Label>Payment Slip (Screenshot)</Form.Label>
                              <Form.Control
                                type="file"
                                name="paymentSlip"
                                accept="image/*"
                                onChange={handleInputChange}
                                required
                              />
                            </Form.Group>

                            {previewImage && (
                              <div className='d-flex justify-content-center'>
                                <Image
                                  src={previewImage}
                                  thumbnail
                                  className="mt-2"
                                  style={{ maxHeight: '200px' }}
                                  alt="Payment slip preview"
                                />
                              </div>


                            )}

                          </>
                        )}
                      </>
                    )}

                    {isTrialAvailable && (
                      <FormCheck
                        type="switch"
                        id="trial-switch"
                        label="24-hour Trial Survey (Free)"
                        checked={surveyData.isTrial}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setSurveyData(prev => ({
                            ...prev,
                            isTrial: isChecked,
                            durationDays: isChecked ? 1 : (user?.campaignDuration || 7),
                            budget: isChecked ? 0 : (user?.campaignAmount || pricing[7])
                          }));
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Questions Section (keep your existing questions section) */}
                {/* Questions Section old without attachment*/}
                {/* <div className="mb-4">
                  <h5 className="mb-3 border-bottom pb-2">
                    <CardChecklist className="me-2" />
                    Survey Questions
                  </h5>

                  {surveyData.questions.map((question, qIndex) => (
                    <Card key={qIndex} className="mb-3">
                      <Card.Header className="d-flex justify-content-between align-items-center bg-warning fw-bold ">
                        <em> <span className='text-muted '>Question: </span>{qIndex + 1} </em>
                        {surveyData.questions.length > 1 && (
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
                            value={question.text}
                            onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                            placeholder="Enter your question"
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Answer Type</Form.Label>
                          <FormSelect
                            value={question.type}
                            onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                          >
                            {questionTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </FormSelect>
                        </Form.Group>

                        {['single', 'multiple'].includes(question.type) && (
                          <Form.Group className="mb-3">
                            <Form.Label>Options</Form.Label>
                            <ListGroup variant="flush">
                              {question.options.map((option, optIndex) => (
                                <ListGroup.Item key={optIndex} className="d-flex align-items-center">
                                  <FormControl
                                    type="text"
                                    value={option}
                                    onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                                    placeholder={`Option ${optIndex + 1}`}
                                  />
                                  <Badge
                                    bg="danger"
                                    className="ms-2 cursor-pointer"
                                    onClick={() => removeOption(qIndex, optIndex)}
                                  >
                                    X
                                  </Badge>
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
                            <Form.Text className="text-muted">
                              {question.options.length < 2 ? 'Add at least 2 options' : ''}
                            </Form.Text>
                          </Form.Group>
                        )}
                      </Card.Body>
                    </Card>
                  ))}

                  <Button
                    variant="outline-primary"
                    onClick={addQuestion}
                    className="w-100"
                  >
                    <PlusCircle className="me-2" />
                    Add Another Question
                  </Button>
                </div> */}


                {/* Questions Section with attachment */}
<div className="mb-4">
  <h5 className="mb-3 border-bottom pb-2">
    <CardChecklist className="me-2" />
    Survey Questions
  </h5>

  {surveyData.questions.map((question, qIndex) => (
  <Card key={qIndex} className="mb-3">
    <Card.Header className="d-flex justify-content-between align-items-center bg-warning fw-bold">
      <em><span className='text-muted'>Question: </span>{qIndex + 1}</em>
      {surveyData.questions.length > 1 && (
        <Button variant="outline-danger" size="sm" onClick={() => removeQuestion(qIndex)}>
          <Trash size={14} />
        </Button>
      )}
    </Card.Header>

    <Card.Body>
      {/* Optional Media Attachment - Available for ALL question types */}
      <Form.Group className="mb-3">
        <Form.Label>Reference Media (Optional)</Form.Label>
        {question.attachmentPreview ? (
          <div className="mb-2 d-flex align-items-center justify-content-center">
            {question.attachmentType === 'image' ? (
              <Image src={question.attachmentPreview} thumbnail style={{ maxHeight: '200px' }} />
            ) : (
              <video controls style={{ maxHeight: '200px', maxWidth: '100%' }}>
                <source src={question.attachmentPreview} type={question.attachment?.type} />
                Your browser does not support the video tag.
              </video>
            )}
            <Button
              variant="danger"
              size="sm"
              className="ms-2"
              onClick={() => removeQuestionAttachment(qIndex)}
            >
              <Trash size={14} />
            </Button>
          </div>
        ) : (
          <Form.Control
            type="file"
            accept="image/*,video/*"
            onChange={(e) => handleQuestionMedia(qIndex, e.target.files[0])}
          />
        )}
        <Form.Text className="text-muted">
          Add an optional reference image or video to accompany this question
        </Form.Text>
      </Form.Group>

      {/* Question Text */}
      <Form.Group className="mb-3">
        <Form.Label>Question Text</Form.Label>
        <Form.Control
          type="text"
          value={question.text}
          onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
          placeholder="Enter your question"
          required
        />
      </Form.Group>

      {/* Answer Type */}
      <Form.Group className="mb-3">
        <Form.Label>Answer Type</Form.Label>
        <FormSelect
          value={question.type}
          onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
        >
          {questionTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </FormSelect>
      </Form.Group>

      {/* Options - Only for choice questions */}
      {['single', 'multiple'].includes(question.type) && (
        <Form.Group className="mb-3">
          <Form.Label>Options</Form.Label>
          <ListGroup variant="flush">
            {question.options.map((option, optIndex) => (
              <ListGroup.Item key={optIndex} className="d-flex align-items-center">
                <FormControl
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                  placeholder={`Option ${optIndex + 1}`}
                />
                <Badge
                  bg="danger"
                  className="ms-2 cursor-pointer"
                  onClick={() => removeOption(qIndex, optIndex)}
                >
                  X
                </Badge>
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
          <Form.Text className="text-muted">
            {question.options.length < 2 ? 'Add at least 2 options' : ''}
          </Form.Text>
        </Form.Group>
      )}
    </Card.Body>
  </Card>
))}

  <Button
    variant="outline-primary"
    onClick={addQuestion}
    className="w-100"
  >
    <PlusCircle className="me-2" />
    Add Another Question
  </Button>
</div>



                {/* ... */}

                <div className="d-flex justify-content-between mt-4">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/surveys')}
                  >
                    <ArrowLeft className="me-2" />
                    Cancel
                  </Button>

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : (
                      <>
                        <Save className="me-2" />
                        Create Survey
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SurveyCreateForm;