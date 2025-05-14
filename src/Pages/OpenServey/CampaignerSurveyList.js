import { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { Eye, Pencil, Trash, ShareFill, BarChart } from 'react-bootstrap-icons';
import { MdAirplanemodeInactive } from 'react-icons/md';
import { VscVm, VscVmActive } from 'react-icons/vsc';
import { Link, useNavigate } from 'react-router-dom';
import { FaLink } from 'react-icons/fa';
import { WhatsappShareButton, WhatsappIcon, FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, } from 'react-share';


const CampaignerSurveyPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');



  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/surveys/my-surveys`, {
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

  const handleAlertOnClick = (survey) => {
    setSelectedSurvey(survey);
    setModalStep(1);
    setShowRenewModal(true);
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
    <Container className="py-4">


      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Responses</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {surveys.map(survey => (
            <tr key={survey._id}>
              <td>
                <Link to={`/open-survey/byCampaigner/${survey._id}/${survey.status}`}>{survey.title}</Link>
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
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate(`/survey/${survey._id}/preview`)}
                >
                  <Eye size={14} />
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate(`/survey/${survey._id}/edit`)}
                  disabled={survey.status !== 'draft'}
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  variant="outline-dark"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate(`/survey/${survey._id}/results`)}
                >
                  <BarChart size={14} />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="me-2"
                  onClick={() => handleDelete(survey._id)}
                >
                  <Trash size={14} />
                </Button>

                <Button
                  variant="outline-success"
                  size="sm"
                  className='me-2'
                  onClick={() => {
                    const id = survey._id || survey.createdBy;
                    setShareUrl(`${window.location.origin}/open-survey/byCampaigner/${id}/${survey.status}`);
                    // navigator.clipboard.writeText(shareUrl);
                    // alert('Link copied to clipboard!');
                    setShowShareModal(true);
                  }}
                >
                  <ShareFill size={14} className='mb-1' />
                </Button>

                <Button
                  variant="outline-danger"
                  size="sm"

                  disabled={survey?.status === "active"}
                  // onClick={() => handleToggleStatuss(survey._id)}>
                  onClick={() => handleAlertOnClick(survey)}
                >
                  {survey?.status === "active" ? <VscVmActive size={14} /> : <MdAirplanemodeInactive size={14} />}
                </Button>


              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showRenewModal} onHide={() => setShowRenewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Renew Campaign</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalStep === 1 && (
            <>
              <p>Your campaign has ended and is marked as completed. To re-run it, you must submit the budget and duration again for review.</p>
              <Button variant="primary" onClick={() => setModalStep(2)}>Next</Button>
            </>
          )}
          {modalStep === 2 && (
            <>
              <p>Select a duration and corresponding budget:</p>
              {[{ days: 5, budget: 100 }, { days: 10, budget: 200 }, { days: 15, budget: 250 }, { days: 30, budget: 350 }].map(opt => (
                <div key={opt.days}>
                  <Form.Check
                    type="radio"
                    label={`${opt.days} days - ₹${opt.budget}`}
                    checked={selectedOption?.days === opt.days}
                    onChange={() => setSelectedOption(opt)}
                  />
                </div>
              ))}
              <Button
                className="mt-3"
                variant="success"
                disabled={!selectedOption}
                onClick={async () => {
                  try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/surveys/renew-request/${selectedSurvey._id}`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                      },
                      body: JSON.stringify(selectedOption)
                    });
                    if (!response.ok) throw new Error('Failed to submit request');

                    setModalStep(3);
                  } catch (err) {
                    alert('Failed: ' + err.message);
                    setShowRenewModal(false);
                  }
                }}
              >
                Submit Request
              </Button>
            </>
          )}
          {modalStep === 3 && (
            <>
              <p>
                ✅ Request submitted successfully. Our support team has been notified. After review, your campaign will go live and you’ll be notified via email.
              </p>
              <Button onClick={() => setShowRenewModal(false)}>Close</Button>
            </>
          )}
        </Modal.Body>
      </Modal>


      <Modal
        show={showShareModal}
        onHide={() => setShowShareModal(false)}
        centered
        dialogClassName="custom-centered-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Share Survey</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Share this survey with others:</p>
          <div className="d-flex gap-2">
            <WhatsappShareButton url={shareUrl}><WhatsappIcon size={32} round /></WhatsappShareButton>
            <FacebookShareButton url={shareUrl}><FacebookIcon size={32} round /></FacebookShareButton>
            <TwitterShareButton url={shareUrl}><TwitterIcon size={32} round /> </TwitterShareButton>
            <span
              title='Copy Link and Share URL'
              className='bg-dark'
              style={{
                cursor: 'pointer',
                backgroundColor: '#000',
                color: 'white',
                border: '1px solid #ccc',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                alert('Link copied to clipboard!');
              }}
            >
              <FaLink className='' />
            </span>

          </div>
        </Modal.Body>
      </Modal>

    </Container>
  );
};

export default CampaignerSurveyPage;