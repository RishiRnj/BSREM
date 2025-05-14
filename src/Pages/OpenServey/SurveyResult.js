

import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  Tab,
  Tabs,
  Table,
  Spinner,
  Alert,
  Row,
  Col,
  Button,
  Badge
} from 'react-bootstrap';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { ArrowLeft, Download, Clipboard, Share, Opencollective, BoxArrowInUpRight, ShareFill } from 'react-bootstrap-icons';
import AuthContext from '../../Context/AuthContext';
import ShareModal from '../../Components/Common/ShareSurveyModal';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SurveyResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState({
    title: '',
    description: '',
    questions: [],
    responses: [],
    createdBy: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [exporting, setExporting] = useState(false);
  const { user } = useContext(AuthContext);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');



  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/surveys/${id}/results`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch results');

        const data = await response.json();
        setSurvey({
          ...data,
          questions: data.questions || [],
          responses: data.responses || []
        });
        console.log('survey data', data.responses);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  const processQuestionData = (question) => {
    if (!question || !survey.responses) return { type: 'text', responses: [] };

    if (question.questionType === 'text') {
      return {
        type: 'text',
        responses: survey.responses
          .filter(r => r.answers && r.answers[question._id])
          .map((r, i) => ({
            id: i + 1,
            response: r.answers[question._id] || '-',
            date: new Date(r.respondedAt).toLocaleString()
          }))
      };
    }

    // Process choice questions
    const optionCounts = {};
    (question.options || []).forEach(opt => {
      optionCounts[opt] = 0;
    });

    let total = 0;
    survey.responses.forEach(r => {
      const answer = r.answers?.[question._id];
      if (Array.isArray(answer)) {
        answer.forEach(opt => {
          if (opt && optionCounts[opt] !== undefined) {
            optionCounts[opt]++;
            total++;
          }
        });
      } else if (answer && optionCounts[answer] !== undefined) {
        optionCounts[answer]++;
        total++;
      }
    });

    return {
      type: question.questionType,
      data: Object.keys(optionCounts).map(opt => ({
        name: opt,
        value: optionCounts[opt],
        percent: total > 0 ? Math.round((optionCounts[opt] / total) * 100) : 0
      })),
      totalResponses: total
    };
  };

  const formatResponseCount = (count) => {
    return count === 1 ? '1 response' : `${count} responses`;
  };


  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/surveys/${id}/export`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `survey_${id}_results.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleCopyLink = () => {
    setShareUrl(`${window.location.origin}/survey/${id}/results`);
    // alert('Survey results link copied to clipboard!');
    setShowShareModal(true);
  };




  const handleShareQuestion = (questionId) => {
   setShareUrl(
      `${window.location.origin}/survey/${id}/results/question/${questionId}`
    );
    setShowShareModal(true);
  };

  const handleQuestion = (questionId) => {
    const url = `${window.location.origin}/survey/${id}/results/question/${questionId}`;
    window.open(url, '_blank');
  };



  if (loading) return (
    <Container className="text-center py-5">
      <Spinner animation="border" />
      <p>Loading survey results...</p>
    </Container>
  );

  if (error) return (
    <Container className="py-5">
      <Alert variant="danger">
        {error}
        <Button variant="outline-primary" onClick={() => navigate(-1)} className="mt-3">
          <ArrowLeft className="me-2" />
          Go Back
        </Button>
      </Alert>
    </Container>
  );

  return (
    <Container className="py-4 pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="outline-secondary" onClick={() => { user?.role === "admin" ? navigate('/admin') : navigate('/campaigner-dashboard') }} className="mb-2">
          <ArrowLeft className="me-2" />
          Back to Dashboard
        </Button>


        <div>

          <Button
            variant="outline-primary"
            onClick={handleCopyLink}
            className="me-2"
          >
            <ShareFill className="me-2 mb-1" />
            Share Results Link
          </Button>
          <Button
            variant="primary"
            onClick={handleExportCSV}
            disabled={exporting}
          >
            <Download className="me-2 mb-1" />
            {exporting ? 'Exporting...' : 'Export to CSV'}
          </Button>
        </div>

      </div>


      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-light">
          <h3>{survey.title}</h3>
          <p className="mb-0 text-muted">
            {formatResponseCount(survey.totalResponses)} |
            Created by: {survey.createdBy?.updateFullName || survey.createdBy?.email || 'Unknown'} |
            <Badge bg={survey.status === 'active' ? 'success' : 'secondary'} className="ms-2">
              {survey.status}
            </Badge>
          </p>
        </Card.Header>
      </Card>

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        <Tab eventKey="summary" title="Summary">
          <Row className="g-4 mt-2">
            {survey.questions.map((question, qIndex) => {
              const questionData = processQuestionData(question);

              return (
                <Col key={qIndex} md={6} lg={6}>
                  <Card className="h-100">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5>{qIndex + 1}. {question.questionText}</h5>
                        <small className="text-muted">
                          {formatResponseCount(questionData.totalResponses || 0)}
                        </small>
                      </div>
                      <div>
                        <Button
                        variant="outline-secondary"
                        size="sm"
                        className='me-2'
                        onClick={() => handleShareQuestion(question._id)}
                        title="Share this question"
                      >
                        <Share size={14} />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleQuestion(question._id)}
                        title="Open this question"
                      >
                        <BoxArrowInUpRight size={14} />
                      </Button>


                      </div>
                      
                    </Card.Header>
                    <Card.Body>
                      {question.questionType === 'text' ? (
                        questionData.responses.length > 0 ? (
                          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <Table striped bordered hover size="sm">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Response</th>
                                  <th>Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {questionData.responses.map((r, i) => (
                                  <tr key={i}>
                                    <td>{r.id}</td>
                                    <td>{r.response}</td>
                                    <td>{r.date}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </div>
                        ) : (
                          <Alert variant="info">No text responses yet</Alert>
                        )
                      ) : questionData.data.length > 0 ? (
                        <div style={{ height: '300px' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            {question.questionType === 'single' ? (
                              <PieChart>
                                <Pie
                                  data={questionData.data}
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => `${name}: ${percent}%`}
                                >
                                  {questionData.data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                              </PieChart>
                            ) : (
                              <BarChart
                                data={questionData.data}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" name="Responses">
                                  {questionData.data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Bar>
                              </BarChart>
                            )}
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <Alert variant="info">No responses yet</Alert>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Tab>

        <Tab eventKey="responses" title={`All Responses (${survey.responses.length})`}>
          <Card className="mt-3">
            <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {survey.responses.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Respondent</th>
                      {survey.questions.map((q, i) => (
                        <th key={i}>Q{i + 1}</th>
                      ))}
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {survey.responses.map((response, rIndex) => (
                      <tr key={rIndex}>
                        <td>{rIndex + 1}</td>
                        <td>
                          <td>
                            {response.respondentName || (response.anonymousId ? 'Guest User' : 'Registered User')}
                          </td>

                        </td>
                        {survey.questions.map((q, qIndex) => {
                          const answer = response.answers?.[q._id];
                          if (answer === undefined || answer === null) return <td key={qIndex}>-</td>;
                          if (Array.isArray(answer)) {
                            return <td key={qIndex}>{answer.filter(a => a).join(', ') || '-'}</td>;
                          }
                          return <td key={qIndex}>{answer}</td>;
                        })}
                        <td>{new Date(response.respondedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">No responses yet</Alert>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      <div className="d-flex justify-content-between align-items-center mb-4"></div>

      <ShareModal
        show={showShareModal}
        onHide={() => setShowShareModal(false)}
        shareUrl={shareUrl}
      />
    </Container>
  );
};

export default SurveyResultsPage;