import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  Table,
  Spinner,
  Alert,
  Button,
  Badge,
  Row,
  Col
} from 'react-bootstrap';
import { 
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { ArrowLeft, Share, Download } from 'react-bootstrap-icons';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const QuestionResultsPage = () => {
  const { id, questionId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchQuestionResults = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/surveys/${id}/results?question=${questionId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch question results');
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestionResults();
  }, [id, questionId]);

  const processQuestionData = () => {
    if (!data || !data.question) return null;

    if (data.question.questionType === 'text') {
      return {
        type: 'text',
        responses: data.responses.map((r, i) => ({
          id: i + 1,
          response: r.answer || '-',
          date: new Date(r.respondedAt).toLocaleString()
        }))
      };
    }

    // Process choice questions
    const optionCounts = {};
    (data.question.options || []).forEach(opt => {
      optionCounts[opt] = 0;
    });

    let total = 0;
    data.responses.forEach(r => {
      const answer = r.answer;
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
      type: data.question.questionType,
      data: Object.keys(optionCounts).map(opt => ({
        name: opt,
        value: optionCounts[opt],
        percent: total > 0 ? Math.round((optionCounts[opt] / total) * 100) : 0
      })),
      totalResponses: total
    };
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/surveys/${id}/questions/${questionId}/export`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `question_${questionId}_results.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Question results link copied to clipboard!');
  };

  if (loading) return (
    <Container className="text-center py-5">
      <Spinner animation="border" />
      <p>Loading question results...</p>
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

  if (!data) return null;

  const questionData = processQuestionData();

  return (
    <Container className="py-4 pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="outline-secondary" onClick={() => navigate(`/survey/${id}/results`)}>
          <ArrowLeft className="me-2" />
          Back to Full Results
        </Button>
        
        <div>
          <Button variant="outline-primary" onClick={handleShareLink} className="me-2">
            <Share className="me-2" />
            Share
          </Button>
          <Button variant="primary" onClick={handleExportCSV} disabled={exporting}>
            <Download className="me-2" />
            {exporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>

      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-light">
          <h4>{data.surveyTitle}</h4>
          <h5 className="mt-2">{data.question.questionText}</h5>
          <Badge bg="info" className="mt-2">
            {data.totalResponses} responses
          </Badge>
        </Card.Header>
        <Card.Body>
          {questionData && questionData.type !== 'text' ? (
            <div style={{ height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                {data.question.questionType === 'single' ? (
                  <PieChart>
                    <Pie
                      data={questionData.data}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
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
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Respondent</th>
                  <th>Response</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.responses.map((response, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{response.respondent || 'Anonymous'}</td>
                    <td>
                      {Array.isArray(response.answer) 
                        ? response.answer.join(', ') 
                        : response.answer || '-'}
                    </td>
                    <td>{new Date(response.respondedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default QuestionResultsPage;