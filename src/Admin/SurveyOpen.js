import { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Spinner, Alert, Modal } from 'react-bootstrap';
import { Eye, Pencil, Trash, PlusCircle, BarChart, ShareFill } from 'react-bootstrap-icons';
import { MdAirplanemodeActive, MdAirplanemodeInactive } from 'react-icons/md';
import { data, Link, useNavigate } from 'react-router-dom';
import SurveyToggleModal from './SurveyToggleModal'; // Import the modal component
import ShareModal from '../Components/Common/ShareSurveyModal'; // Import the modal component
import { FaLink } from 'react-icons/fa';
import { WhatsappShareButton, WhatsappIcon, FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, LinkedinShareButton, LinkedinIcon, } from 'react-share';

const AdminSurveysPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');


  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/surveys/admin`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch surveys');
        const data = await response.json();

        setSurveys(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this survey?')) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/surveys/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete survey');
      setSurveys(surveys.filter(survey => survey._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };


  const handleToggleStatuss = async (id) => {
    if (!window.confirm('Are you sure you want to make the status Active this survey?')) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/surveys/toogle-status/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete survey');
      const updated = await response.json();
      setSurveys(prev => prev.map(s => s._id === id ? updated : s));

    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleClick = (id) => {
    setSelectedSurveyId(id);
    setShowModal(true);
  };

  const handleToggleStatus = async ({ budget, duration }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/surveys/toogle-status/${selectedSurveyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ budget, durationDays: duration }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      const updated = await response.json();

      setSurveys(prev =>
        prev.map(s => s._id === updated._id ? updated : s)
      );

    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return (
    <Container className="text-center py-5">
      <Spinner animation="border" />
      <p>Loading surveys...</p>
    </Container>
  );

  if (error) return (
    <Container className="py-5">
      <Alert variant="danger">{error}</Alert>
    </Container>
  );

  return (
    <Container className="py-4 mb-3">
      <h1 className="mb-4">All Survey List </h1>


      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Responses</th>
            <th>Created at</th>
            <th>Created by</th>
            <th>View</th>
            <th>Edit</th>
            <th>Results</th>
            <th>DELETE</th>
            <th>Change Status</th>
            <th>Share</th>
          </tr>
        </thead>
        <tbody>
          {surveys.map(survey => (
            <tr key={survey._id}>
              <td>
                <Link to={survey?.isAdminCreated === true
                  ? `${window.location.origin}/open-survey/byAdmin/${survey._id}/${survey.status}`
                  : `${window.location.origin}/open-survey/byCampaigner/${survey._id}/${survey.status}`}
                // `/survey/${survey._id}/view`}
                >{survey.title}</Link>
              </td>
              <td>
                <Badge bg={
                  survey.status === 'active' ? 'success' :
                    survey.status === 'draft' ? 'warning' : 'secondary'
                }>
                  {survey.status}
                </Badge>
              </td>
              <td>{survey.responses?.length || 0}</td>
              <td>{new Date(survey.createdAt).toLocaleDateString()}</td>
              <td>{survey?.isAdminCreated === true ? 'Admin' : survey.createdBy?.updateFullName}</td>
              <td>
                
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/survey/${survey._id}/preview`)}
                  >
                    <Eye size={14} />
                  </Button>
                  </td>
              <td>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/survey/${survey._id}/edit`)}
                    disabled={survey.status !== 'draft'}
                  >
                    <Pencil size={14} />
                  </Button>
                  </td>
                  <td>
                  <Button
                    variant="outline-info"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/survey/${survey._id}/results`)}
                  >
                    <BarChart size={14} />
                  </Button>
                  </td>
                  <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className='me-2'
                    disabled={survey.isAdminCreated !== true}
                    onClick={() => handleDelete(survey._id)}
                  >
                    <Trash size={14} />
                  </Button>
                </td>
                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className='me-2'
                    disabled={survey?.status === "active"}
                    // onClick={() => handleToggleStatuss(survey._id)}>
                    onClick={() => handleToggleClick(survey._id)}>
                    {survey?.status === "active" ? <MdAirplanemodeActive size={14} /> : <MdAirplanemodeInactive size={14} />}
                  </Button>
                  </td>
                  <td>
                  <Button
                    variant="outline-success"
                    size="sm"

                    onClick={() => {
                      const id = survey._id;

                      const shareUrl = survey?.isAdminCreated === true
                        ? `${window.location.origin}/open-survey/byAdmin/${id}/${survey.status}`
                        : `${window.location.origin}/open-survey/byCampaigner/${id}/${survey.status}`;
                      // navigator.clipboard.writeText(shareUrl);
                      // alert('Link copied to clipboard!');

                      setShareUrl(shareUrl);
                      setShowShareModal(true);

                    }}
                  >
                    <ShareFill size={14} />
                  </Button>

                  <ShareModal
                    show={showShareModal}
                    onHide={() => setShowShareModal(false)}
                    shareUrl={shareUrl}
                  />

                

              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <SurveyToggleModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleToggleStatus}
      />
    </Container>
  );
};

export default AdminSurveysPage;