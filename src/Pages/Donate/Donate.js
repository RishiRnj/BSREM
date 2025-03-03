


import React, { useEffect, useState } from 'react';
import { Card, Button, CardGroup, Modal, Badge, Row } from 'react-bootstrap';
import DonationModal from './DonationModal';
import './Donation.css';
import { ToastContainer } from 'react-toastify';

const Donate = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvedBeneficiaries, setApprovedBeneficiaries] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 45; // Set the maximum length to display initially
  const [expandedCards, setExpandedCards] = useState({});
  const [showModal, setShowModal] = useState(false); // Modal state
  const [selectedCard, setSelectedCard] = useState(null); // Store the selected card details
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [formData, setFormData] = useState(null);
  //const [remainingBloodUnits, setRemainingBloodUnits] = useState(null);



  const handleDonate = (beneficiary) => {
    const donationType = mapApplyForToDonationType(beneficiary?.applyFor);
    console.log("donate type", donationType);
    setFormData({
      ...formData,
      type: donationType, // Set donation type based on beneficiary's request
    });

    // Save both the beneficiary and donation type
    setSelectedBeneficiary({
      ...beneficiary,
      donationType, // Include the donation type with the beneficiary
    });


    setShowDonateModal(true); // Show the modal
  };


  const mapApplyForToDonationType = (applyFor) => {
    const mapping = {
      Books: 'empowerSkillAndKnowledge',
      'Learning Material': 'empowerSkillAndKnowledge',
      'Learning Gadgets': 'empowerSkillAndKnowledge',
      Mentorship: 'empowerSkillAndKnowledge',
      Medicine: 'healthCare',
      Medications: 'healthCare',
      'Hospital Assistance': 'healthCare',
      Blood: 'healthCare',
      'Clothes for Underprivileged': 'essentialServices',
      'Food for the Hungry': 'essentialServices',
      Essentials: 'essentialServices',
      Volunteering: 'communityServices',
      Fundraising: 'monetarySupport',
    };

    return mapping[applyFor] || ''; // Return the mapped type or an empty string as fallback
  };



  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Missing user authentication details.");
      setIsLoading(false);
      return;
    }
    localStorage.removeItem("redirectAfterLogin"); // Clear after use
    localStorage.removeItem("redirectAfterUpdate"); // Clear after use
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/beneficiary/approved-beneficiaries`)
      .then((res) => res.json())
      .then((data) => setApprovedBeneficiaries(data.approvedBeneficiaries))
      .catch((err) => console.error("Error fetching beneficiaries:", err));
  }, []);
  console.log(approvedBeneficiaries);


  const getCategory = (applyFor) => {
    if (["Books", "Learning Material", "Learning Gadgets", "Mentorship"].includes(applyFor)) {
      return "Skill & Knowledge";
    } else if (["Medications", "Hospital Assistance", "Medicine", "Blood"].includes(applyFor)) {
      return "Health Care";
    } else if (["Clothes for Underprivileged", "Food for the Hungry", "Essentials"].includes(applyFor)) {
      return "Essential Services";
    } else if (["Volunteering"].includes(applyFor)) {
      return "Community Services";
    } else if (["Fundraising"].includes(applyFor)) {
      return "Monetary support";
    }
    return "Uncategorized"; // In case no match is found
  };

  // Function to handle truncation and expansion of the verify note
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`; // Truncate and add ellipsis
    }
    return text;
  };

  // Function to handle modal opening
  const handleShowModal = (card) => {
    console.log("Opening Modal for:", card); // Debugging
    setSelectedCard(card); // Set the selected card to show in the modal
    setShowModal(true); // Open the modal
  };

  // Function to handle modal close
  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    setSelectedCard(null); // Clear the selected card
  };




  const filteredBeneficiaries = approvedBeneficiaries.filter(b => b.donationStatus !== "fulfilled");


  return (
    < >
      <div className='text-center' style={{ fontSize: "25px" }}>Donate</div>
      <div style={{ maxHeight: "300px" }}>


      </div>



      <div className="container mt-4 p-5 mb-4" >
        <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 mb-4">
          {filteredBeneficiaries.map((b) => {
            const donationStatus = b?.donationStatus == "in-progress";
            const fundRised = b?.fundRaised > 0 ;
            console.log([approvedBeneficiaries, filteredBeneficiaries]);

            const category = getCategory(b?.applyFor); // Determine category based on applyFor
            const isExpanded = expandedCards[b._id]; // Check if this specific card is expanded

            const formatFieldName = (field) => {
              // Convert camelCase or snake_case to words with proper capitalization
              return field
                .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
                .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
                .replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space between lowercase and uppercase
            };

            const bookName = formatFieldName(b?.bookName);
            const bookType = formatFieldName(b?.bookType);
            const bookLanguage = formatFieldName(b?.bookLanguage);
            const bookOption = formatFieldName(b?.bookOption);

            const learningMaterialType = formatFieldName(b?.learningMaterialType);
            const gadgetType = formatFieldName(b?.gadgetType);
            const mentorType = formatFieldName(b?.mentorType);



            const medicineName = formatFieldName(b?.medicineName);

            const bloodGroup = formatFieldName(b?.bloodGroupNeed);
            const bloodUnit = formatFieldName(b?.bloodGroupUnitNeed);
            const clothFor = formatFieldName(b?.clothFor);
            const description = formatFieldName(b?.descriptionOfNeed);
            const remainingBloodUnits = (b?.bloodGroupUnitReceived);

            //Render all needs
            const renderNeeds = () => {
              switch (b?.applyFor) {
                case 'Books':
                  return (
                    <div>
                      <Card.Text className="description" title="Looking for">
                        <strong> <span title='Book Name'> {bookName} </span> </strong> ||
                        <span /> <strong> <span title='Book Type'> {bookType} </span> </strong> ||
                        <span> {b?.bookLanguage && <span title='Language'><strong> {bookLanguage}</strong> </span>} </span>  || <span title='Book Option'> {b?.bookOption && <span> {bookOption}</span>} </span>  <span /> </Card.Text>

                    </div>
                  );
                case 'Learning Material':
                  return (
                    <div>

                      <Card.Text className="description" title="Looking for">  <span title='Type of Learning Material:'> Type of Material: <span /><strong>{learningMaterialType} </strong> </span>  ||  <span /> <strong> <span title='Quantity'> {b?.learningMaterialQuantity} </span> </strong>    <span /> </Card.Text>

                    </div>
                  );
                case 'Learning Gadgets':
                  return (
                    <div>

                      <Card.Text className="description" title="Looking for">  <span title='Type of Gadget:'> Type of Gadget: <span /> <strong> {gadgetType} </strong> </span>  ||  <span /> <strong> <span title='Quantity'> {b?.gadgetQuantity} </span> </strong>    <span /> </Card.Text>
                      {/* <p><strong>Gadget Type:</strong> {b?.gadgetType}</p>
                      <p><strong>Quantity:</strong> {b?.gadgetQuantity}</p> */}
                    </div>
                  );
                case 'Mentorship':
                  return (
                    <div>

                      <Card.Text className="description" title="Looking for">  <span title='Type of Mentorship:'> Type of Mentorship: <span /> <strong> {mentorType} </strong> </span>  </Card.Text>

                      {/* <p><strong>Mentor Type:</strong> {b?.mentorType}</p> */}
                    </div>
                  );
                case 'Medications':
                  return (
                    <div>

                      <Card.Text className="description" title="Looking for"> <strong> <span title='Medicine Name:'> {medicineName} </span> </strong> ||  <span /> <strong> <span title='Prescrion Link'> {b?.prescription && (
                        <a href={b.prescription} target="_blank" rel="noopener noreferrer">
                          <strong>Prescription</strong>
                        </a>
                      )} </span> </strong>   </Card.Text>


                    </div>
                  );
                case 'Blood':
                  return (
                    <div>
                      <Card.Text className="" title="Looking for">
                        <span title='Blood Grp.'> Grp: <strong> {bloodGroup} </strong>  </span>  ||
                        <span /> Need: <strong>{bloodUnit} </strong> <span />
                        Arrenged: <strong> <span title='Unit'> {remainingBloodUnits} </span> </strong>
                        <span />
                      </Card.Text>
                      <div className="progress mt-2">
                        <div
                          className="progress-bar bg-danger"
                          role="progressbar"
                          style={{ width: `${((bloodUnit - remainingBloodUnits) / bloodUnit * 100)}%` }}
                          aria-valuenow={(bloodUnit - remainingBloodUnits) / bloodUnit * 100}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {((bloodUnit - remainingBloodUnits) / bloodUnit * 100).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  );
                case 'Clothes for Underprivileged':
                  return (
                    <div>

                      <Card.Text className="description" title="Looking for">  <span title='Cloth For'> Cloth For: <strong> {clothFor} </strong>  </span>  ||  <span /> <strong> <span title='Unit'> {b?.clothUnit} </span> </strong>    <span /> </Card.Text>

                      {/* <p><strong>Cloth For:</strong> {b?.clothFor}</p>
                      <p><strong>Unit Needed:</strong> {b?.clothUnit}</p> */}
                    </div>
                  );
                case 'Food for the Hungry':
                  return (
                    <div>

                      <Card.Text className="description" title="Looking for FOOD">  <span title='Food for.'> Number of People: <strong> {b?.headCountForFood} </strong>  </span>  ||  <span />  <span title='Unit'> Any Child There?<strong> {b?.anyChildHungry}</strong>  </span>  ||
                        <span> {b?.anyChildHungry === 'yes' && (
                          <span> <strong>Number of Child:</strong> {b?.childCountForFood} </span>
                        )} </span>  <span /> </Card.Text>


                      {/* <p><strong>Number of People:</strong> {b?.headCountForFood}</p>
                      <p><strong>Any Child There:</strong> {b?.anyChildHungry}</p>
                      {b?.anyChildHungry === 'yes' && (
                        <p><strong>Number of Child:</strong> {b?.childCountForFood}</p>
                      )} */}
                    </div>
                  );
                case 'Essentials':
                  return (
                    <div>
                      <Card.Text className="description" title="Looking for">  <span title='Cloth For'> Type of Need? <strong> {b?.essentials} </strong>  </span>  </Card.Text>
                      {/* <p><strong>Type of Need?</strong> {b?.essentials}</p> */}
                    </div>
                  );
                case 'Fundraising':
                  return (
                    <div >

                      <Card.Text className="description" title="Looking for Fund">  <span title={`Need Support for ${b?.fundraising}`} > Need Monetary Support: <strong> {b?.fundraising} </strong>  </span>    ||
                        <span> {b?.fundraising === 'forParrents' && (
                          <span> <strong>Receive any Govt. Assistance?</strong> {b?.areParrentsReceiveGovtAssistance} </span>
                        )} </span>  <span /> </Card.Text>


                      {/* <p><strong>Need Monetary Support:</strong> {b?.fundraising}</p>
                      {b?.fundraising === 'forParrents' && (
                        <p><strong>Receive any Govt. Assistance?</strong> {b?.areParrentsReceiveGovtAssistance}</p>
                      )} */}
                    </div>
                  );
                default:
                  return <p>No specific needs selected.</p>;
              }
            };

            // Conditionally render the text based on whether it's expanded or not
            const textToDisplayy = isExpanded ? b?.noteByVerifier : truncateText(b?.noteByVerifier, maxLength);
            return (
              <div className="col" key={b._id}>
                <Card id='crd-tem' style={{ width: "100%" }}>
                  <Card.Header title="Category">
                    <div className='d-flex justify-content-between'>
                      <div>
                        {category}
                      </div>
                      <div>
                        <Badge bg={donationStatus ? 'success' : 'primary'}> {donationStatus ? 'In-Progress' : 'Active'} {fundRised ? '/ Recieved': ""}</Badge>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Img
                    variant="top"
                    width={200}
                    height={150}
                    style={{ objectFit: "cover", borderBottomStyle: "double" }}
                    src={b?.userImage}
                  />

                  <Card.Body>
                    <Card.Title className="" title="Apply For">{b?.applyFor}</Card.Title>
                    <div className='border border-primary text-light bg-dark p-1 rounded-sm text-center'> {renderNeeds()} </div>
                    <p className='text-center' title='Description'> <strong> {description} </strong>   </p>


                    <div className='d-flex flex-row-reverse bd-highlight'>
                      <Card.Subtitle title='Beneficiary' className="mb-2 bd-highlight description"> — {b?.updateFullName}</Card.Subtitle> </div>

                    <Card.Subtitle title='Beneficiary Background Checking Authority' className="mb-1 text-muted">Verifier Response</Card.Subtitle>
                    <Card.Text className='description1' title='Verifier response about Beneficiary' >
                      {textToDisplayy}
                      {b?.noteByVerifier.length > maxLength && (
                        <Button
                          variant="link"
                          // onClick={() => handleToggleExpand(b._id)}
                          onClick={() => handleShowModal(b)}
                        >
                          {isExpanded ? 'Read Less' : 'Read More'}
                        </Button>
                      )}
                    </Card.Text>

                    <div className='d-flex justify-content-center'>

                      {/* <Button
                    disabled={donationStatus}
                      className=""
                      variant="outline-dark"
                      onClick={() => handleDonate(b)}
                    >
                     {/* {donationStatus ? 'Donate': 'In-Progress ...'}  *
                     Donate
                    </Button> */}

                      <Button
                        disabled={donationStatus} // Disable the button if donation status is "in-progress"
                        className=""
                        variant="outline-dark"
                        onClick={() => handleDonate(b)}
                      >
                        {donationStatus ? 'In-Progress ...' : 'Donate'} {/* Conditionally render text */}
                      </Button>




                    </div>


                  </Card.Body>
                </Card>
                {/* <ToastContainer/> */}
              </div>
            );
          })}

        </div>
      </div>

      {selectedBeneficiary && (
        <DonationModal
          show={showDonateModal}
          onHide={() => setShowDonateModal(false)}
          beneficiary={selectedBeneficiary}
          donationType={selectedBeneficiary?.donationType} // Pass the donationType explicitly
        />
      )}


      {/* modal for specific card show */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Category: {getCategory(selectedCard?.applyFor)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCard && (
            <>
              <Card style={{ width: "100%" }}>
                <Card.Img
                  variant="top"
                  width={200}
                  height={150}
                  style={{ objectFit: "cover", borderBottomStyle: "double" }}
                  src={selectedCard?.userImage || "default-image.jpg"} // Avoid broken images
                  alt="User"
                />
                <Card.Body>
                  <Card.Title>{selectedCard?.applyFor || "No Title"}</Card.Title>
                  <Card.Text className="description">{selectedCard?.descriptionOfNeed || "No description available"}</Card.Text>
                  <div className='d-flex flex-row-reverse bd-highlight'>
                    <Card.Subtitle title='Beneficiary' className="mb-2 bd-highlight"> — {selectedCard?.updateFullName}</Card.Subtitle> </div>
                  <Card.Subtitle title='Beneficiary background check' className="mb-2 text-muted">Verifier Response</Card.Subtitle>
                  <Card.Text title='Verifier response about Beneficiary'>{selectedCard?.noteByVerifier}</Card.Text>



                  <Button variant="secondary">Secondary</Button>
                </Card.Body>
              </Card>
            </>
          )}
        </Modal.Body>

      </Modal>

    </>
  );

};

export default Donate;
