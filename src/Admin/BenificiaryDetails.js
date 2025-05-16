


import { useState, useEffect } from 'react';
import { Button, Card, CardHeader, Row, Col, Carousel, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../Components/Util';

const fetchBeneficiaryById = async (id) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/beneficiary/${id}/details`);

  if (!response.ok) {
    throw new Error('Error fetching beneficiary data');
  }

  const data = await response.json();
  console.log("ddddd", data);
  
  return data;
};

function BeneficiaryDetailPage() {
  const { id } = useParams();  // Get the beneficiary ID from the URL
  const navigate = useNavigate();
  const [beneficiary, setBeneficiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clickedItem, setClickedItem] = useState(null);
  const falback = "/a4.webp";
  const [showLink, setShowLink] = useState(true);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedBeneficiary = await fetchBeneficiaryById(id);
        setBeneficiary(fetchedBeneficiary.beneficiary);
        setLoading(false);       

      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // Re-run when ID changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!beneficiary) return <div>Beneficiary not found</div>;
 


  const handleBack = () => {
    navigate(-1);  // This will go back to the previous page
  };

  const openImageInNewTab = (src) => {
    const newTab = window.open();
    newTab.document.body.innerHTML = `<img src="${src}" style="width: 100%; height: auto; object-fit: cover;" />`;
  };

  const handleStatusupdate = async () =>{
    try {
      const id = beneficiary?._id;
    console.log("transaction", id);

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/beneficiary/make-fulfill/${id}`, {
      method: "PUT",
        credentials: "include", // Necessary for cookies/session handling
        headers: {
          "Content-Type": "application/json",          
        },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile.");
    }
    handleSuccess("Update Successfull ");
    setShowLink(false);
      
    } catch (error) {
      console.error("Error in checkUserProfile:", error);
      handleError(error);
    }
  }

  const renderNeeds = () => {
    switch (beneficiary.applyFor) {
      case 'Books':
        return (
          <div>
            <Row className='py-2'>
              <Col> <strong>Book Type:</strong> </Col>
              <Col>  {beneficiary.bookType}   </Col>
            </Row>

            <Row className='py-2'>
              <Col>  <strong>Book Name:</strong> </Col>
              <Col> {beneficiary.bookName}  </Col>
            </Row>

            {beneficiary.bookLanguage && (
              <Row className='py-2'>
                <Col>  <strong>Book Language:</strong> </Col>
                <Col> {beneficiary.bookLanguage} </Col>
              </Row>
            )}

            {beneficiary.bookOption && (
              <Row className='py-2'>
                <Col>  <strong>Book Option:</strong>  </Col>
                <Col> {beneficiary.bookOption}  </Col>
              </Row>
            )}

          </div>
        );
      case 'Learning Material':
        return (
          <div>
            <Row className='py-2'>
              <Col> <strong>Type of Learning Material:</strong> </Col>
              <Col> {beneficiary.learningMaterialType}  </Col>
            </Row>

            <Row className='py-2'>
              <Col>  <strong>Quantity:</strong> </Col>
              <Col> {beneficiary.learningMaterialQuantity} </Col>
            </Row>
            
          </div>
        );
      case 'Learning Gadgets':
        return (
          <div>
            <p><strong>Gadget Type:</strong> {beneficiary.gadgetType}</p>
            <p><strong>Quantity:</strong> {beneficiary.gadgetQuantity}</p>
          </div>
        );
      case 'Mentorship':
        return (
          <div>
            <p><strong>Mentor Type:</strong> {beneficiary.mentorType}</p>
          </div>
        );
      case 'Medications':
        return (
          <div>
            <Row className='py-2'>
              <Col> <strong>Medicine Name:</strong> </Col>
              <Col> {beneficiary.medicineName}  </Col>
            </Row>
            
            {/* Render image previews if available */}
            {beneficiary?.prescription && (
              <div>
                <Row className='py-2'>
                  <Col> <strong>Prescription Images:</strong> </Col>
                  <Col> See in Image Slider  </Col>
                </Row>


              </div>
            )}
          </div>
        );
      case 'Blood':
        return (
          <div>
            <Row className='py-2'>
                  <Col> <strong>Blood Group:</strong> </Col>
                  <Col> {beneficiary.bloodGroupNeed}</Col>
                </Row>
                <Row className='py-2'>
                  <Col> <strong>Unit Needed:</strong> </Col>
                  <Col> {beneficiary.bloodGroupUnitNeed} </Col>
                </Row>
            
          </div>
        );
      case 'Clothes for Underprivileged':
        return (
          <div>
            <p><strong>Cloth For:</strong> {beneficiary.clothFor}</p>
            <p><strong>Unit Needed:</strong> {beneficiary.clothUnit}</p>
          </div>
        );
      case 'Food for the Hungry':
        return (
          <div>
            <p><strong>Number of People:</strong> {beneficiary.headCountForFood}</p>
            <p><strong>Any Child There:</strong> {beneficiary.anyChildHungry}</p>
            {beneficiary.anyChildHungry === 'yes' && (
              <p><strong>Number of Child:</strong> {beneficiary.childCountForFood}</p>
            )}
          </div>
        );
      case 'Essentials':
        return (
          <div>
            <p><strong>Type of Need:</strong> {beneficiary.essentials}</p>
          </div>
        );
      case 'Fundraising':
        return (
          <div>
            <p><strong>Need Monetary Support For:</strong> {beneficiary.fundraising}</p>
            {beneficiary.fundraising === 'forParrents' && (
              <p><strong>Do they receive any Govt. Assistance:</strong> {beneficiary.areParrentsReceiveGovtAssistance}</p>
            )}
          </div>
        );
      default:
        return <p>No specific needs selected.</p>;
    }
  };

  const handleShowDonationData = async () => {
    try {
      const id = beneficiary?._id;
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/donate/donations/${id}`);
      const data = await response.json();
      setDonations(data.donations);  // Set donation data in state
      console.log("res Dona", data);

    } catch (err) {
      console.error('Error fetching donations:', err);
    }
  }


  return (
    <div className='mb-3'>
      <div className='p-3 d-flex justify-content-center'>
        <Button variant='outline-dark' onClick={handleBack}>
          Back Admin Panel
        </Button>
      </div>

      <div className='d-flex justify-content-center p-3 w-100'>
        <Card id='bene' className='mx-auto' style={{ marginBottom: "50px", width: "100%", maxWidth: "600px" }}>

          <CardHeader className='text-center'>
            <h3>Full Details for :- {beneficiary?.username || beneficiary?.updateFullName || beneficiary?.displayName}</h3>
          </CardHeader>

          <Row className='px-4 py-2'>
            <Col><strong>Father's Name:</strong> </Col>
            <Col>{beneficiary.fathersName}</Col>
          </Row>

          <Row className='px-4 py-2'>
            <Col><strong>Age & Gender:</strong> </Col>
            <Col>{`${beneficiary.age} || ${beneficiary.gender}`}</Col>
          </Row>

          <Row className='px-4 py-2'>
            <Col><strong>Email:</strong> </Col>
            <Col>{beneficiary.email}</Col>
          </Row>

          <Row className='px-4 py-2'>
            <Col><strong>Mobile:</strong> </Col>
            <Col>{`+ ${beneficiary.mobile}`}</Col>
          </Row>

          <Row className='px-4 py-2'>
            <Col><strong>Family Income:</strong> </Col>
            <Col>{`${beneficiary.familyIncome}`}</Col>
          </Row>

          <Row className='px-4 py-2'>
            <Col><strong>Family Members:</strong> </Col>
            <Col>{`${beneficiary.familyMembersNumber}`}</Col>
          </Row>

          <Row className='px-4 py-2'>
            <Col className='text-center border'>
              <strong>Origin: {beneficiary.origin}</strong>
              <br /> Address:
            </Col>
          </Row>

          <Row className='px-4 py-2'>
            <Col><strong>Village:</strong> </Col>
            <Col>{`${beneficiary.address}`}</Col>
          </Row>

          <Row className='px-4 py-2'>
            <Col><strong>City:</strong> </Col>
            <Col>{`${beneficiary.city}`}</Col>
          </Row>

          <Row className='px-4 py-2'>
            <Col><strong>District & PIN:</strong> </Col>
            <Col>{`${beneficiary.district} & ${beneficiary?.PIN}`}</Col>
          </Row>

          <Row className='px-4 py-2'>
            <Col><strong>State:</strong> </Col>
            <Col>{`${beneficiary.state}`}</Col>
          </Row>

          <Row className='px-4 py-2'>
            <Col><strong>Apply For:</strong> </Col>
            <Col>{`${beneficiary.applyFor}`}</Col>
          </Row>

          <Row className='px-4 py-2'>
            <Col><strong>Donation Status:</strong> </Col>
            <Col>{`${beneficiary.donationStatus}`} {showLink && beneficiary.donationStatus === "in-progress" && (
              <span> <Button variant="link" onClick={handleStatusupdate}>Mark as Fulfilled</Button> </span>)}</Col>
          </Row>

          <Row className='px-4 py-2'>
            {renderNeeds()}
          </Row>

          <Row className='px-4 py-2'>
            <Col><strong>Description:</strong> </Col>
            <Col>{`${beneficiary.descriptionOfNeed}`}</Col>
          </Row>

          {(beneficiary.donationStatus === "in-progress" || beneficiary.donationStatus === "fulfilled") && (

            <>
              <Row className='px-4 py-2'>
                <Col><strong>Donation Data:</strong> </Col>
                <Col>{showLink && (beneficiary.donationStatus === "in-progress" || beneficiary.donationStatus === "fulfilled") && (
                  <span> <Button variant="link" onClick={handleShowDonationData}>Show Donation Data</Button> </span>)}</Col>
              </Row>
              <Row>
                <Col>
                  <h5 className="text-center mb-4">Donations</h5>
                </Col>
              </Row>
            </>


          )}

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
                                      <Row className="mb-1">
                                        <Col>
                                          <p><strong>Blood Donation:</strong></p>
                                        </Col>
                                        <Col>
                                          <p>{donation.bloodUnitsDonated} unit(s)</p>
                                        </Col>
                                      </Row>
                                      <Row className="mb-1">
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
                                      <Row className="mb-1">
                                        <Col>
                                          <p><strong> Donation Via:</strong></p>
                                        </Col>
                                        <Col>
                                          <p>{donation.donateVia} unit(s)</p>
                                        </Col>
                                      </Row>
                                      <Row className="mb-1">
                                        <Col>
                                          <p><strong>Donor Name:</strong></p>
                                        </Col>
                                        <Col>
                                          <p>{donation.donor?.updateFullName} </p>
                                        </Col>
                                      </Row>
                                    </div>       
                                  )}
          
                                  {( donation.type === 'Books' || donation.type === 'Learning Material' || donation.type === 'Learning Gadgets' || donation.type === 'Medications' ||donation.type === 'Essentials'  || donation.type === 'Clothes for Underprivileged'  || donation.type === 'Food for the Hungry' || donation.type === 'Fundraising'  ) && (
                                    <>  <div style={{ width: "400px" }}>
                                    <Row className="mb-1">
                                      <Col>
                                        <p><strong> Donation Via:</strong></p>
                                      </Col>
                                      <Col>
                                        <p>{donation.donateVia}</p>
                                      </Col>
                                    </Row>
                                    {donation?.amount && (
                                      <Row className="mb-1">
                                      <Col>
                                        <p><strong>Amount:</strong></p>
                                      </Col>
                                      <Col>
                                        <p>{donation.amount}/- </p>
                                      </Col>
                                    </Row>
          
                                    )}
                                    
                                    <Row className="mb-1">
                                      <Col>
                                        <p><strong>Donor Name:</strong></p>
                                      </Col>
                                      <Col>
                                        <p>{donation.donor?.updateFullName} </p>
                                      </Col>
                                    </Row>
                                    <Row className="mb-1">
                                      <Col>
                                        <p><strong>Donor Mobile:</strong></p>
                                      </Col>
                                      <Col>
                                        <p> + {donation.donor?.mobile} </p>
                                      </Col>
                                    </Row>
                                    <Row className="mb-1">
                                    <Col>
                                        <p className=''><strong>Donor Address:</strong></p>
                                      </Col>
                                      <Col>
                                        <p>Village: {donation.donor?.address}, <span/> City: {donation.donor?.city}, <span/> District: {donation.donor?.district}, <span/> State: {donation.donor?.state}, <span/> PIN: {donation.donor?.PIN} <span/> </p>
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

          <div className='d-flex justify-content-center'>
            <Carousel style={{ width: "400px" }} data-bs-theme="dark">
              <Carousel.Item onClick={() => openImageInNewTab(beneficiary?.aadhaar)}>
                <img className="d-block w-100" src={beneficiary?.aadhaar} alt="Aadhaar Card" />
                <Carousel.Caption>
                  <h2><Badge className='border border-success bg-dark'>Aadhaar Card</Badge></h2>
                </Carousel.Caption>
              </Carousel.Item>

              <Carousel.Item onClick={() => openImageInNewTab(beneficiary?.voterID)}>
                <img className="d-block w-100" src={beneficiary?.voterID} alt="Voter ID Card" />
                <Carousel.Caption>
                  <h2><Badge className='border border-success bg-dark'>Voter ID Card</Badge></h2>
                </Carousel.Caption>
              </Carousel.Item>

              <Carousel.Item onClick={() => openImageInNewTab(beneficiary?.incomeCertificate)}>
                <img className="d-block w-100" src={beneficiary?.incomeCertificate} alt="Income Certificate" />
                <Carousel.Caption>
                  <h2><Badge className='border border-success bg-dark'>Income Certificate</Badge></h2>
                </Carousel.Caption>
              </Carousel.Item>

              {beneficiary?.prescription &&(
                <Carousel.Item onClick={() => openImageInNewTab(beneficiary?.prescription || falback)}>
                <img className="d-block w-100" src={beneficiary?.prescription || falback} alt="Prescription" />
                <Carousel.Caption>
                  <h2><Badge className='border border-success bg-dark'>Doctor Prescription</Badge></h2>
                </Carousel.Caption>
              </Carousel.Item>

              )}
            </Carousel>
          </div>
        </Card>
      </div>
    </div>
  );
  

}

export default BeneficiaryDetailPage;