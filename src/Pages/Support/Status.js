import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, InputGroup, Badge, Card, Form, Button, FormText, Modal, ListGroup, ListGroupItem } from 'react-bootstrap'
import AuthContext from "../../Context/AuthContext";
import LoadingSpinner from '../../Components/Common/LoadingSpinner';
import ConfirmationModal from '../../Components/Common/ConfirmationModal';
import { handleSuccess, handleWarning } from '../../Components/Util';


const Status = ({ onClickForAnotherApply }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [donations, setDonations] = useState([]);
  const [showBeneData, setShowBeneData] = useState([]);
  const [beneID, setBeneId] = useState(null);
  const [showStatus, setShowStatus] = useState(false); // New state for toggle
  const [forAnotherApply, setForAnotherApply] = useState(false);
  const [loading, setLoading] = useState(false);  
  const id = user.id;
  console.log("user id", id);

  

  const handleClose = () => setShowStatus(false);




  useEffect(() => {
    const handleShowStatus = async () => {
      // await fetchDonationData();
      await fetchBeneData();
      // setShowStatus(true);
      handleSuccess("status show");
    }
    handleShowStatus();
  }, []); // Logs will only fire when either `donations` or `showBeneData` changes

  const fetchDonationData = async (iD) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/donate/donations/${iD}`);
      const data = await response.json();
      setDonations(data.donations);  // Set donation data in state

      console.log("res Dona", data);

    } catch (err) {
      console.error('Error fetching donations:', err);
    }
  }

  const fetchBeneData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/beneficiary/${id}`);
      const data = await response.json();
      setShowBeneData(data.beneficiary);  // Set beneficiary data in state
      setBeneId(data.beneficiary._id)
      console.log("res", data);
      console.log("bene Id", beneID);

    } catch (err) {
      console.error('Error fetching beneficiary data:', err);
    }
  }

  const handleAnotherAplly = async (id) => {
    console.log("Beneficiary id", id);

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/beneficiary/profile-status/selected_user/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // No Content-Type for FormData
        },
      });
      const data = await response.json();
      if (data.status === 'in-progress') {
        handleWarning(data.message);
        console.log('Collection in progress:', data.inProgressCollection);
      } else {
        onClickForAnotherApply(true);
        setForAnotherApply(!forAnotherApply);
        console.log('All collections are complete');
      }

    } catch (error) {
      console.error("Error updating data:", error);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
}


  return (
    <div className='mb-5'>
      {!forAnotherApply && ("")}

      {showBeneData.map((b, index) => (
        <div className='d-flex justify-content-center flex-column m-2 '>
          <Card key={b?._id} style={{ width: '100%', maxWidth: '600px', margin: 'auto', }}>

            <Card.Body>
              <Card.Title className='text-center'> Beneficiary Data </Card.Title>
              {/* Your content goes here */}
              <div className="">
                <hr />

                <Row >
                  <Col>
                    <p><strong>Beneficiary Name:</strong></p>
                  </Col>
                  <Col>
                    <p>{b?.updateFullName}</p>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <p><strong>Email:</strong></p>
                  </Col>
                  <Col>
                    <p>{b?.email}</p>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <p><strong>Applied For:</strong></p>
                  </Col>
                  <Col>
                    <p>{b?.applyFor}</p>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <p><strong>Verification Status:</strong></p>
                  </Col>
                  <Col>
                    <p>{b?.verificationStatus}</p>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <p><strong>Donation Status:</strong></p>
                  </Col>
                  <Col>
                    <p>{b?.donationStatus}</p>
                  </Col>
                </Row>

                <Row>
                  {b?.donationStatus === "fulfilled" && (
                    <>
                      <Button onClick={() => {
                        setShowStatus(!showStatus); fetchDonationData(b?._id);
                      }}
                      > {showStatus ? 'Hide Donor data' : 'Show Donor data'} </Button>

                      {!showStatus && (<Button className='mt-3' variant='outline-secondary' 
                      onClick={() => {handleAnotherAplly(b._id)}}
                      // {() => {
                      //   onClickForAnotherApply(true); setForAnotherApply(!forAnotherApply);
                      // }}
                      > Click for another apllication foe support </Button>
                      )}
                    </>
                  )}

                </Row>
              </div>
            </Card.Body>
          </Card>
        </div>
      ))}



      {/* Modal for Donation Details */}
      <Modal show={showStatus} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Donations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {donations && (

            <div className='d-flex justify-content-center flex-column' style={{ maxWidth: "100%" }}>

              <ul className="list-unstyled d-flex flex-column align-items-center">
                {/* <ul className="list-unstyled d-flex flex-column align-items-center"> */}
                {donations.map((donation) => (
                  <li key={donation._id} className="mb-4">
                    <Card className="w-100 ms-auto" style={{ maxWidth: '550px', margin: 'auto' }}>
                      <Card.Header className="text-center">
                        <strong>{donation.type === 'Blood' ? 'Blood Donation' : 'Donation'}</strong>
                      </Card.Header>
                      <Card.Body>
                        {donation.type === 'Blood' && (
                          <div style={{ width: "400px" }}>
                            <Row className="mb-2">
                              <Col>
                                <p><strong>Blood Donation:</strong></p>
                              </Col>
                              <Col>
                                <p>{donation.bloodUnitsDonated} unit(s)</p>
                              </Col>
                            </Row>
                            <Row className="mb-2">
                              <Col>
                                <p><strong>Donor Name:</strong></p>
                              </Col>
                              <Col>
                                <p>{donation.donor?.updateFullName} </p>
                              </Col>
                            </Row>
                          </div>
                        )}
                        {donation.type === 'Mentorship' && (

                          <div style={{ width: "400px" }}>
                            <Row className="mb-2">
                              <Col>
                                <p><strong> Donation Via:</strong></p>
                              </Col>
                              <Col>
                                <p>{donation.donateVia} unit(s)</p>
                              </Col>
                            </Row>
                            <Row className="mb-2">
                              <Col>
                                <p><strong>Donor Name:</strong></p>
                              </Col>
                              <Col>
                                <p>{donation.donor?.updateFullName} </p>
                              </Col>
                            </Row>
                          </div>
                        )}

                        {(donation.type === 'Books' || donation.type === 'Learning Material' || donation.type === 'Learning Gadgets' || donation.type === 'Medications' || donation.type === 'Essentials' || donation.type === 'Clothes for Underprivileged' || donation.type === 'Food for the Hungry' || donation.type === 'Fundraising') && (
                          <>  <div style={{ width: "400px" }}>
                            <Row className="mb-2">
                              <Col>
                                <p><strong> Donation Via:</strong></p>
                              </Col>
                              <Col>
                                <p>{donation.donateVia}</p>
                              </Col>
                            </Row>
                            {donation.amount && (
                              <Row className="mb-2">
                                <Col>
                                  <p><strong>Amount:</strong></p>
                                </Col>
                                <Col>
                                  <p>{donation.amount}/- </p>
                                </Col>
                              </Row>

                            )}

                            <Row className="mb-2">
                              <Col>
                                <p><strong>Donor Name:</strong></p>
                              </Col>
                              <Col>
                                <p>{donation.donor?.updateFullName} </p>
                              </Col>
                            </Row>
                          </div>
                          </>

                        )}


                      </Card.Body>
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>




    </div>
  )
}

export default Status