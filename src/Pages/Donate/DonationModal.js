import React, { useState, useEffect, useContext } from 'react';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { BsExclamationCircle } from "react-icons/bs";
import { VscReferences } from "react-icons/vsc";
import Badge from 'react-bootstrap/Badge';
import { FaRupeeSign } from "react-icons/fa";
import AuthContext from "../../Context/AuthContext";
import { handleError, handleSuccess } from '../../Components/Util';
import { ToastContainer } from 'react-toastify';



const DonationModal = ({ show, onHide, beneficiary, donationType }) => {
  console.log("benefivciary", beneficiary);
  
  const { user } = useContext(AuthContext);  
  const userId = user?.id;
  const [donated, setDonated] = useState();

  // Initialize formData only once when beneficiary or donationType is provided
  const [formData, setFormData] = useState({
    type: '', // Default empty string for type
    amount: '', // Leave empty for monetary donations
    description: '', // Optional
    donationType: '', // Set donationType dynamically
    donateVia: '', // Default selection
  });

  // Use useEffect to set formData when beneficiary or donationType changes
  useEffect(() => {
    if (beneficiary && donationType) {
      setFormData({
        type: beneficiary?.applyFor || '',
        amount: '',
        description: '',
        donationType: donationType || '',

      });
    }
    setDonated(false); // Reset 'donated' when the modal is opened or the beneficiary changes
  }, [beneficiary, donationType]); // Only re-run when beneficiary or donationType changes


  const formatFieldName = (field) => {
    // Convert camelCase or snake_case to words with proper capitalization
    return field
      .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
      .replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space between lowercase and uppercase
  };

  const donateType = formatFieldName(formData.donationType);
  const bookName = formatFieldName(beneficiary?.bookName);
  const bookType = formatFieldName(beneficiary?.bookType);
  const bookLanguage = formatFieldName(beneficiary?.bookLanguage);
  const bookOption = formatFieldName(beneficiary?.bookOption);
  const learningMaterialType = formatFieldName(beneficiary?.learningMaterialType);
  const gadgetType = formatFieldName(beneficiary?.gadgetType);
  const mentorType = formatFieldName(beneficiary?.mentorType);
  const medicineName = formatFieldName(beneficiary?.medicineName);
  const bloodGroup = formatFieldName(beneficiary?.bloodGroupNeed);
  const bloodUnit = formatFieldName(beneficiary?.bloodGroupUnitNeed);
  const clothFor = formatFieldName(beneficiary?.clothFor);

  const [remainingBloodUnits, setRemainingBloodUnits] = useState(bloodUnit || 0);


  const handleRadioChange = (e) => {
    setFormData({
      ...formData,
      donateVia: e.target.value, // update selected radio button value
    });

  };



  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Validate if the input is a number only when the input name is 'amount'
    if (name === 'amount' && !/^\d*\.?\d*$/.test(value)) {
      // If the value is not a valid number, return early and don't update the state
      return;
    }

    const remainingAmount = beneficiary?.expectedAmountOfMoney - beneficiary?.fundRaised;
  
    // If donating expected amount, set the amount to the expectedAmount
    if (name === "donateVia" && value === "I want to donate the expected amount.") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        amount: remainingAmount, // Set to the full expected amount
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  



  const handleSubmit = async (e) => {
    e.preventDefault();

    // If the user selects a monetary donation option, ensure amount is filled
    if (formData.donateVia === 'I want to Donate the Partial of the Expected Amount.') {
      if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
        handleError("Please enter a valid amount!");
        return;
      }
    }

    console.log("send for make donation", formData );
    

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/donate/make-donation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          beneficiaryId: beneficiary?._id,
          donorId: userId, // Use logged-in donor's ID here
        }),
      });

      const data = await response.json();

      if (response.ok) {
        handleSuccess("You Donated Successfully!");
        setDonated(true); // This will disable the donation button or show success state
      } else {
        handleError(data.error || "Failed to record donation.");
      }
    } catch (err) {
      console.error('Error:', err);
      alert("An error occurred while processing your donation.");
    }
  };




  //blood Donation
  const handleBloodDonation = async () => {
    if (remainingBloodUnits > 0) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/donate/make-donation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            beneficiaryId: beneficiary?._id,
            donorId: userId, // Replace with logged-in donor's ID
            bloodUnitsDonated: 1, // Donate 1 unit of blood
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setRemainingBloodUnits(prevUnits => prevUnits - 1);
          alert("Thank you for donating 1 unit of blood!");
        } else {
          alert(data.error || "Failed to record donation.");
        }
      } catch (err) {
        console.error('Error:', err);
        alert("An error occurred while processing your donation.");
      }
    } else {
      alert("All required units have been fulfilled!");
    }
  };

  //empolyment donation
  const handleJobCreation = async () => {
    if (formData.donateVia === `I want to finalize after "Meeting the Job Seeker".` || formData.donateVia === `I request the "BSREM" authority to speak to the candidate.`) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/donate/make-donation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            beneficiaryId: beneficiary?._id,
            donorId: userId, // Replace with logged-in donor's ID

          }),
        });

        const data = await response.json();
        if (response.ok) {
          handleSuccess("You have Successfully start Coopration for Community!");
          setDonated(true);
        } else {
          alert(data.error || "Failed to record Coopration.");
        }
      } catch (err) {
        console.error('Error:', err);
        alert("An error occurred while processing your Coopration.");
      }
    } else {
      alert("You Coopration not Successfull!");
    }
  };

  //mentorShip donation
  const handleMentorShipDonation = async () => {
    if (formData.donateVia === 'Click here to "Donate Mentorship" Online.' || formData.donateVia === 'Click here to "Donate Mentorship" Offline.') {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/donate/make-donation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            beneficiaryId: beneficiary?._id,
            donorId: userId, // Replace with logged-in donor's ID

          }),
        });

        const data = await response.json();
        if (response.ok) {
          handleSuccess("You Donated Mentorship Successfully!");
          setDonated(true);
        } else {
          alert(data.error || "Failed to record donation.");
        }
      } catch (err) {
        console.error('Error:', err);
        alert("An error occurred while processing your donation.");
      }
    } else {
      alert("You Donation Mentorship not Successfull!");
    }
  };

  console.log("redio", formData);




  const renderNeeds = () => {
    switch (beneficiary?.applyFor) {
      case 'Books':
        return (
          <div>
            <Form.Text className="" title="Looking for">
              <strong> <span title='Book Name'> {bookName} </span> </strong> ||
              <span /> <strong> <span title='Book Type'> {bookType} </span> </strong> ||
              <span> {beneficiary?.bookLanguage && <span title='Language'><strong> {bookLanguage}</strong> </span>} </span>  || <span title='Book Option'> {beneficiary?.bookOption && <span> {bookOption}</span>} </span>  <span /> </Form.Text>

          </div>
        );
      case 'Learning Material':
        return (
          <div>

            <Form.Text className="" title="Looking for">  <span title='Type of Learning Material:'> Type of Material: <span /><strong>{learningMaterialType} </strong> </span>  ||  <span /> <strong> <span title='Quantity'> {beneficiary?.learningMaterialQuantity} </span> </strong>    <span /> </Form.Text>

          </div>
        );
      case 'Learning Gadgets':
        return (
          <div>

            <Form.Text className="" title="Looking for">  <span title='Type of Gadget:'> Type of Gadget: <span /> <strong> {gadgetType} </strong> </span>  ||  <span /> <strong> <span title='Quantity'> {beneficiary?.gadgetQuantity} </span> </strong>    <span /> </Form.Text>

          </div>
        );
      case 'Mentorship':
        return (
          <div>

            <Form.Text className="" title="Looking for">  <span title='Type of Mentorship:'> Type of Mentorship: <span /> <strong> {mentorType} </strong> </span> <br/> <span title='Requested Platform:'> Requested Platform: <span /> <strong> {beneficiary?.mentorArena} </strong> </span> <br/><span title='Expected number of mentee:'> Expected number of mentee: <span /> <strong> {beneficiary?.numberOfMentee} </strong> </span> </Form.Text>


          </div>
        );
      case 'Medications':
        return (
          <div>

            <Form.Text className="" title="Looking for">  <span title='Medicine Name:'> Medicine Name: <strong> {medicineName}   </strong>  <span /> </span>  </Form.Text>


          </div>
        );
      case 'Blood':
        return (
          <div>

            <Form.Text className="" title="Looking for">  <span title='Blood Grp.'> Blood Group: <strong> {bloodGroup} </strong>  </span>  ||  <span /> Unit Need: <strong>{bloodUnit} </strong> <span /> Looking for: <strong> <span title='Unit'> {remainingBloodUnits} Donor </span> </strong>    <span /> </Form.Text>



          </div>




        );
      case 'Clothes for Underprivileged':
        return (
          <div>

            <Form.Text className="" title="Looking for">  <span title='Cloth For'> Cloth For: <strong> {clothFor} </strong>  </span>  ||  <span /> <strong> <span title='Unit'> {beneficiary?.clothUnit} </span> </strong>    <span /> </Form.Text>


          </div>
        );
      case 'Food for the Hungry':
        return (
          <div>

            <Form.Text className="" title="Looking for FOOD">  <span title='Food for.'> Number of People: <strong> {beneficiary?.headCountForFood} </strong>  </span>  ||  <span />  <span title='Unit'> Any Child There?<strong> {beneficiary?.anyChildHungry}</strong>  </span>  ||
              <span> {beneficiary?.anyChildHungry === 'yes' && (
                <span> <strong>Number of Child:</strong> {beneficiary?.childCountForFood} </span>
              )} </span>  <span /> </Form.Text>

          </div>
        );
      case "Employment":
        return (
          <div>
            <Form.Text className="" title="Looking for Job">  
              <span title='Type of Need?'>Job type: <strong> {beneficiary?.expectedJobRole ? beneficiary?.expectedJobRole : beneficiary?.expectedJobRoleR} </strong>  </span>  <br/>
              <span title='Qualification'>Qualification: <strong> {beneficiary?.qualification ? beneficiary?.qualification : beneficiary?.qualificationDetails} </strong>  </span> <br/>
              <span title='Salary '> Expected Salary: <strong> {beneficiary?.expectedSalary} </strong>  </span>   </Form.Text>

          </div>
        );
      case 'Fundraising':
        return (
          <div>
            <Form.Text className="" title="Looking for">  <span title='Cloth For'> Need Monetary Support: <strong> {beneficiary?.fundraising} </strong>  </span>  {beneficiary?.fundraising === 'forParrents' && (
              <span><strong> ||  Receive any Govt. Assistance?</strong> {beneficiary?.areParrentsReceiveGovtAssistance}</span>
            )} <span /> </Form.Text>

          </div>
        );
      default:
        return <p>No specific needs selected.</p>;
    }
  };

  const renderDonationOptions = () => {
    if (beneficiary?.applyFor === 'Fundraising') {
      // If applying for money, show the option for monetary donation

      // Calculate remaining amount
      const remainingAmount = beneficiary?.expectedAmountOfMoney - beneficiary?.fundRaised;

      // If applying for money, show the option for monetary donation
      return (
        <div>
          <Form.Group className="text-center bg-">
            <div className="d-flex justify-content-center">
              <div className="mb-2 text-center">
                <Form.Label>Expected Amount:</Form.Label>
                {beneficiary?.expectedAmountOfMoney && (
                  <span style={{ fontStyle: "italic" }}>
                    <FaRupeeSign />
                    <strong>{beneficiary?.expectedAmountOfMoney}</strong>
                  </span>
                )}
              </div>
              {beneficiary?.fundRaised && (
                <>
                  <h5>
                    <Badge className="ms-2">Arranged:</Badge>
                  </h5>
                  <span style={{ fontStyle: "italic" }}>
                    <FaRupeeSign />
                    <strong>{beneficiary?.fundRaised}</strong>
                  </span>
                </>
              )}
            </div>

            {/* Calculate and display remaining amount */}
            {remainingAmount > 0 && (
              <div>
                <Form.Label>Remaining Amount:</Form.Label>
                <span style={{ fontStyle: "italic" }}>
                  <FaRupeeSign />
                  <strong>{remainingAmount}</strong>
                </span>
              </div>
            )}

            <Form.Label className="" style={{ fontSize: "20px" }}>
              <Badge bg="warning" text="dark">
                Complete your donation:
              </Badge>
            </Form.Label>
            {['radio'].map((type) => (
              <div key={`reverse-${type}`} className="mb-1">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip placement="top" id="tooltip-top">Check this Radio Button for Sending the Expected Monetary Support to the Beneficiary.</Tooltip>}
                >
                  <div>
                    {/* New Radio Button for Amount Available Check */}
                    {beneficiary?.expectedAmountOfMoney && (
                      <div className="row justify-content-center">
                        <div className="col-auto">
                          <Form.Check
                            reverse
                            label={
                              <span
                                style={{
                                  fontWeight: formData.donateVia === 'I want to donate the expected amount.' ? 'bold' : 'normal',
                                  color: formData.donateVia === 'I want to donate the expected amount.' ? 'black' : '#6c757d',
                                }}
                              >
                                I want to Donate the expected amount.
                              </span>
                            }
                            value="I want to donate the expected amount."
                            type={type}
                            name="donateVia"
                            id={`reverse-${type}-1`}
                            checked={formData.donateVia === 'I want to donate the expected amount.'}
                            onChange={handleChange}
                            className="border-end"
                          />
                        </div>
                        {/* Divider */}
                        <div className="d-flex align-items-center">
                          <hr className="flex-grow-1" /> <span className="px-2"> Or </span> <hr className="flex-grow-1" />
                        </div>
                      </div>
                    )}
                  </div>
                </OverlayTrigger>

                {/* Conditional rendering of radio button when expected amount is > 500 */}
                {beneficiary?.expectedAmountOfMoney > 800 && (
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip placement="top" id="tooltip-top">Check this Radio Button for Sending the Partial Amount of Expected Monetary Support to the Beneficiary.</Tooltip>}
                  >
                    {/* Radio Button for Partial Donation */}
                    <div>
                      <div className="row justify-content-center">
                        <div className="col-auto">
                          <Form.Check
                            reverse
                            label={
                              <span
                                style={{
                                  fontWeight: formData.donateVia === 'I want to Donate the Partial of the Expected Amount.' ? 'bold' : 'normal',
                                  color: formData.donateVia === 'I want to Donate the Partial of the Expected Amount.' ? 'black' : '#6c757d',
                                }}
                              >
                                I want to Donate the Partial of the Expected Amount.
                              </span>
                            }
                            value="I want to Donate the Partial of the Expected Amount."
                            type={type}
                            name="donateVia"
                            id={`reverse-${type}-2`}
                            checked={formData.donateVia === 'I want to Donate the Partial of the Expected Amount.'}
                            onChange={handleChange}
                            className="border-end"
                          />
                        </div>
                      </div>
                    </div>
                  </OverlayTrigger>
                )}

                {/* Conditional rendering of the input field when the radio button is checked */}
                {formData.donateVia === 'I want to Donate the Partial of the Expected Amount.' && (
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip placement="top" id="tooltip-top">Enter the Partial Amount to Send to the Beneficiary.</Tooltip>}
                  >
                    <Form.Control
                      type="text"
                      placeholder="Enter the Partial Amount to Send to the Beneficiary."
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      autoFocus
                    />
                  </OverlayTrigger>
                )}
              </div>
            ))}
          </Form.Group>
        </div>
      );

    } else if (beneficiary?.applyFor === 'Mentorship') {
      return (
        <div>

          <Form.Group className="text-center bg-">
            <Form.Label className="" style={{ fontSize: "20px" }}>  <Badge bg="warning" text="dark">Complete your donation:</Badge> </Form.Label>
            {['radio'].map((type) => (
              <div key={`reverse-${type}`} className="mb-3">

                {beneficiary?.mentorArena === "Online" && (

                <OverlayTrigger overlay={<Tooltip placement="left" id="tooltip-left">Check the radio button to Donate Mentorship Online, directly to the Beneficiary. Note: We will facilitate a fruitful discussion between both the donor and the beneficiary.</Tooltip>}>
                  <div className="row justify-content-center">
                    <div className="col-auto">
                      <Form.Check
                        reverse
                        label={
                          <span
                            style={{
                              fontWeight: formData.donateVia === 'Click here to "Donate Mentorship" Online.' ? 'bold' : 'normal',
                              color: formData.donateVia === 'Click here to "Donate Mentorship" Online.' ? 'black' : '#6c757d',
                            }}
                          >
                            Click here to "Donate Mentorship" Online.
                          </span>
                        }
                        name="donateVia"
                        value={`Click here to "Donate Mentorship" Online.`}
                        type={type}
                        id={`reverse-${type}-1`}
                        checked={formData.donateVia === 'Click here to "Donate Mentorship" Online.'}
                        onChange={handleChange}
                        className='border-end'
                        autoFocus
                      />
                    </div>
                  </div>
                </OverlayTrigger>

                )}
                {beneficiary?.mentorArena === "Offline" &&(

                  <OverlayTrigger overlay={<Tooltip placement="left" id="tooltip-left">Check the radio button to Donate Mentorship Offline, directly to the Beneficiary. Note: We will facilitate a fruitful discussion between both the donor and the beneficiary.</Tooltip>}>
                  <div className="row justify-content-center">
                    <div className="col-auto">
                      <Form.Check
                        reverse
                        label={
                          <span
                            style={{
                              fontWeight: formData.donateVia === 'Click here to "Donate Mentorship" Offline.' ? 'bold' : 'normal',
                              color: formData.donateVia === 'Click here to "Donate Mentorship" Offline.' ? 'black' : '#6c757d',
                            }}
                          >
                            Click here to "Donate Mentorship" Offline.
                          </span>
                        }
                        name="donateVia"
                        value={`Click here to "Donate Mentorship" Offline.`}
                        type={type}
                        id={`reverse-${type}-1`}
                        checked={formData.donateVia === 'Click here to "Donate Mentorship" Offline.'}
                        onChange={handleChange}
                        className='border-end'
                        autoFocus
                      />
                    </div>
                  </div>
                </OverlayTrigger>

                )}

                {formData.donateVia === 'Click here to "Donate Mentorship" Online.' ? (
                  <div>
                    <Form.Text> <span >To start the online <strong> {mentorType} Mentorship</strong>  </span>  process, we will share your contact number with the beneficiary, and the beneficiary's contact number will be shared with you. Once you click the "Donate" button, both parties will receive the contact details needed to begin Communication and Collaboration, <strong> for strenthening Hindu Community. </strong> </Form.Text>
                    <div className="d-flex align-items-center">
                      <hr className="flex-grow-1" />
                    </div>                    
                  </div>
                ):(
                  <div>
                    <Form.Text> <span >To start the offline <strong> {mentorType} Mentorship</strong>  </span>  process, we will share your contact number with the beneficiary, and the beneficiary's contact number will be shared with you. Once you click the "Donate" button, both parties will receive the contact details needed to begin Communication and Collaboration, <strong> for strenthening Hindu Community. </strong> </Form.Text>
                    <div className="d-flex align-items-center">
                      <hr className="flex-grow-1" />
                    </div>                    
                  </div>
                )}
              

                    <Button disabled={donated} variant={donated ? "primary" : "success"} onClick={handleMentorShipDonation}>
                      {donated ? 'Donated' : 'Confirm Donation'}
                    </Button>

              </div>
            ))}
          </Form.Group>
        </div>

      

      );

    } else if (beneficiary?.applyFor === 'Blood') {
      return (
        <div>

          <Form.Group className="text-center bg-">
            <Form.Label className="" style={{ fontSize: "20px" }}>  <Badge bg="warning" text="dark">Complete your Blood donation:</Badge> </Form.Label>
            {['radio'].map((type) => (
              <div key={`reverse-${type}`} className="mb-3">

                <OverlayTrigger overlay={<Tooltip placement="left" id="tooltip-left">Check the radio button to Donate Blood, directly to the Beneficiary. Note: We will facilitate a fruitful discussion between both the donor and the beneficiary.</Tooltip>}>
                  <div className="row justify-content-center">
                    <div className="col-auto">
                      <Form.Check
                        reverse
                        label={
                          <span
                            style={{
                              fontWeight: formData.donateVia === 'Click here to "View the Beneficiary Location".' ? 'bold' : 'normal',
                              color: formData.donateVia === 'Click here to "View the Beneficiary Location".' ? 'black' : '#6c757d',
                            }}
                          >
                            Click here to "View the Beneficiary Location".
                          </span>
                        }
                        name="donateVia"
                        value={`Click here to "View the Beneficiary Location".`}
                        type={type}
                        id={`reverse-${type}-1`}
                        checked={formData.donateVia === 'Click here to "View the Beneficiary Location".'}
                        onChange={handleChange}
                        className='border-end'
                        autoFocus
                      />
                    </div>
                  </div>
                </OverlayTrigger>

                {formData.donateVia === 'Click here to "View the Beneficiary Location".' && (
                  <div>
                    <p>Beneficiary Location or Address:</p>
                    <Form.Text> Village: <span style={{ fontStyle: 'italic', fontWeight: "bold" }}> {beneficiary?.address} </span> <span className='ms-1' /> City: <span style={{ fontStyle: 'italic', fontWeight: "bold" }}> {beneficiary?.city} </span> </Form.Text> <br />



                    <Form.Text> District: <span style={{ fontStyle: 'italic', fontWeight: "bold" }}> {beneficiary?.district} </span> <span className='ms-1' /> PIN: <span style={{ fontStyle: 'italic', fontWeight: "bold" }}> {beneficiary?.PIN} </span></Form.Text>

                    <Form.Text> <span className='ms-1' /> State: <span style={{ fontStyle: 'italic', fontWeight: "bold" }}> {beneficiary?.state} </span> </Form.Text>

                    {/* Divider */}
                    <div className="d-flex align-items-center">
                      <hr className="flex-grow-1" />
                    </div>

                    {remainingBloodUnits > 0 ? (
                      <Button variant="danger" onClick={handleBloodDonation}>
                        Donate 1 Unit
                      </Button>
                    ) : (
                      <p className="text-success">All required units have been fulfilled!</p>
                    )}



                  </div>
                )}




              </div>
            ))}


          </Form.Group>

        </div>
      );


      // need correction also need to add for shelter
    } else if (beneficiary?.applyFor === 'Employment') {
      return (
        <div>

          <Form.Group className="text-center bg-">
            <Form.Label className="" style={{ fontSize: "20px" }}>  <Badge bg="warning" text="dark">Complete your Cooperation:</Badge> </Form.Label>
            {['radio'].map((type) => (
              <div key={`reverse-${type}`} className="mb-3">

                <OverlayTrigger overlay={<Tooltip delay={{ show: 250, hide: 400 }} placement="left" id="tooltip-left">Check the radio button to Complete the contribution through Meeting directly to the Job Seeker. Note: We will facilitate a fruitful discussion between both the Contributor and the Job Seeker.</Tooltip>}>
                  <div className="row justify-content-center">
                    <div className="col-auto">
                      <Form.Check
                        reverse
                        label={
                          <span
                            style={{
                              fontWeight: formData.donateVia === `I want to finalize after "Meeting the Job Seeker".` ? 'bold' : 'normal',
                              color: formData.donateVia === `I want to finalize after "Meeting the Job Seeker".` ? 'black' : '#6c757d',
                            }}
                          >
                            I want to finalize after "Meeting the Job Seeker".
                          </span>
                        }
                        name="donateVia"
                        value={`I want to finalize after "Meeting the Job Seeker".`}
                        type={type}
                        id={`reverse-${type}-1`}
                        checked={formData.donateVia === `I want to finalize after "Meeting the Job Seeker".`}
                        onChange={handleChange}
                        className='border-end'

                      />

                    </div>
                  </div>
                </OverlayTrigger>

                {formData.donateVia === `I want to finalize after "Meeting the Job Seeker".` && (
                  <div>
                    <Form.Text> <span >To begin the process of <strong> your contribution to job creation,</strong>  </span> we will share your contact number with the Job Seeker, and the Job Seeker's details will be shared with you. Once you click the "I able to arrange Job for You" button, <strong>Note:</strong> Both parties will receive all the required details needed to begin Communication and Cooperation, <strong> for strenthening Hindu Community. </strong> </Form.Text>
                  </div>
                )}
                <hr />

                <OverlayTrigger overlay={<Tooltip delay={{ show: 250, hide: 400 }} placement="left" id="tooltip-left">By checking this radio button, we will review the candidate's background on your behalf and share various relevant information with you. Note: We will facilitate a productive discussion between both the contributor and the job seeker.</Tooltip>}>
                  <div className="row justify-content-center">
                    <div className="col-auto">

                      <Form.Check
                        reverse
                        label={
                          <span
                            style={{
                              fontWeight: formData.donateVia === `I request the "BSREM" authority to speak to the candidate.` ? 'bold' : 'normal',
                              color: formData.donateVia === `I request the "BSREM" authority to speak to the candidate.` ? 'black' : '#6c757d',
                            }}
                          >
                            I request the "BSREM" authority to speak to the candidate.
                          </span>
                        }
                        name="donateVia"
                        value={`I request the "BSREM" authority to speak to the candidate.`}
                        type={type}
                        id={`reverse-${type}-1`}
                        checked={formData.donateVia === `I request the "BSREM" authority to speak to the candidate.`}
                        onChange={handleChange}
                        className='border-end'
                        autoFocus
                      />
                    </div>
                  </div>
                </OverlayTrigger>



                {formData.donateVia === `I request the "BSREM" authority to speak to the candidate.` && (
                  <div>
                    <Form.Text> To begin the process of <strong> your contribution to job creation,</strong> we will try to provide a qualified candidate for your job by talking to the job seeker on your behalf and then the details of the job seeker will be shared with you. After clicking on the "I am able to arrange a job for you" button, <strong>Note:</strong> Both parties will receive the contact details needed to begin Communication and Collaboration, <strong> for strenthening Hindu Community. </strong> </Form.Text>
                  </div>
                )}
                <hr />
                <Button disabled={donated} variant={donated ? "primary" : "success"} onClick={handleJobCreation}>
                  {donated ? 'Contributed' : 'I able to arrange a job for you.'}
                </Button>

              </div>
            ))}
          </Form.Group>
        </div>
      );

    } else {
      // Calculate remaining amount
      const remainingAmount = beneficiary?.expectedAmountOfMoney - beneficiary?.fundRaised;
      return (

        <div>
          {/* For non-money donations, show the three options */}
          <Form.Group className="text-center bg-">
            <Form.Label className="" style={{ fontSize: "20px" }}>  <Badge bg="warning" text="dark">Complete your donation:</Badge> </Form.Label>
            {['radio'].map((type) => (
              <div key={`reverse-${type}`} className="mb-3">

                <OverlayTrigger overlay={<Tooltip placement="left" id="tooltip-left">Check the Radio Button for Sending the Donated item Directly to the Beneficiary. </Tooltip>}>
                  <div className="row justify-content-center">
                    <div className="col-auto">
                      <Form.Check
                        reverse
                        label={
                          <span
                            style={{
                              fontWeight: formData.donateVia === 'By Sending it Directly to the Beneficiary.' ? 'bold' : 'normal',
                              color: formData.donateVia === 'By Sending it Directly to the Beneficiary.' ? 'black' : '#6c757d',
                            }}
                          >
                            By Sending it Directly to the Beneficiary.
                          </span>
                        }
                        name="donateVia"
                        value="By Sending it Directly to the Beneficiary."
                        type={type}
                        id={`reverse-${type}-1`}
                        checked={formData.donateVia === 'By Sending it Directly to the Beneficiary.'}
                        onChange={handleChange}
                        className='border-end'
                      />
                    </div>
                  </div>
                </OverlayTrigger>

                {formData.donateVia === 'By Sending it Directly to the Beneficiary.' && (
                  <div>

                    <Form.Text>
                      <strong> N.B.: </strong>    📢  If the <strong>Donation Process </strong>  is <strong> Successful </strong>, all details such as Name, <br />Contact No will be shared with both the <strong> Donor</strong>   and the <strong> Beneficiary</strong>.
                    </Form.Text>
                  </div>
                )}


                {/* Divider */}
                <div className="d-flex align-items-center">
                  <hr className="flex-grow-1" /> <span className="px-2"> Or </span> <hr className="flex-grow-1" />
                </div>

                <OverlayTrigger placement="top" overlay={<Tooltip placement="top" id="tooltip-top"> Check this Radio Button for Sending the Donated item via "BSREM" to the Beneficiary. </Tooltip>}>
                  <div className="row justify-content-center">
                    <div className="col-auto">
                      <Form.Check
                        reverse
                        label={
                          <span
                            style={{
                              fontWeight: formData.donateVia === 'Sending it through US to the Beneficiary.' ? 'bold' : 'normal',
                              color: formData.donateVia === 'Sending it through US to the Beneficiary.' ? 'black' : '#6c757d',
                            }}
                          >
                            Sending it through US to the Beneficiary.
                          </span>
                        }

                        value="Sending it through US to the Beneficiary."
                        type={type}
                        autoFocus
                        name="donateVia"
                        id={`reverse-${type}-2`}
                        checked={formData.donateVia === 'Sending it through US to the Beneficiary.'}
                        onChange={handleChange}
                        className='border-end'
                      />
                    </div>
                  </div>
                </OverlayTrigger>

                {formData.donateVia === 'Sending it through US to the Beneficiary.' && (
                  <div>
                    <Form.Text>
                      <strong> N.B.: </strong>    📢  If the <strong>Donation Process </strong>  is <strong> Successful </strong>, all details such as Name, <br />Contact No will be shared with both the <strong> Donor</strong>   and the <strong> Beneficiary</strong>. When your <strong> support</strong> reached to <strong> Beneficiary</strong>, After that you will be informed that <strong> "Donation completed"</strong>.
                    </Form.Text>
                  </div>
                )}

                {/* Display expected amount if applicable */}
                {["Books", "Learning Material", "Learning Gadgets", "Medications", "Clothes for Underprivileged", "Food for the Hungry", "Shelter"].includes(beneficiary?.applyFor) && (
                  <OverlayTrigger placement="top" overlay={<Tooltip placement="top" id="tooltip-top">Select any of these Radio Button for Donate the Expected Amount Full or partial to the Beneficiary.</Tooltip>}>
                    <div>
                      <div className="d-flex align-items-center">
                        <hr className="flex-grow-1" /> <span className="px-2"> Or </span> <hr className="flex-grow-1" />
                      </div>

                      <div className='d-flex justify-content-center'>
                        <div className="mb-1 text-center">
                          <Form.Label>Expected Amount:</Form.Label>
                          {beneficiary?.expectedAmountOfMoney && (
                            <span style={{ fontStyle: "italic" }}>
                              <FaRupeeSign />
                              <strong>{beneficiary?.expectedAmountOfMoney}</strong>
                            </span>
                          )}
                        </div>
                        <div>

                          {beneficiary?.fundRaised && (
                            <>
                              <Form.Text className='ms-2'>Arrenged:</Form.Text>
                              <span style={{ fontStyle: "italic" }}>
                                <FaRupeeSign />
                                <strong>{beneficiary?.fundRaised}</strong>
                              </span>
                            </>
                          )}


                        </div>
                      </div>
                      {/* Calculate and display remaining amount */}
                      {remainingAmount > 0 && (
                        <div>
                          <Form.Label>Remaining Amount:</Form.Label>
                          <span style={{ fontStyle: "italic" }}>
                            <FaRupeeSign />
                            <strong>
                              {remainingAmount}
                            </strong>
                          </span>
                        </div>
                      )}


                    </div>
                  </OverlayTrigger>
                )}

                <>
                  <OverlayTrigger placement="top" overlay={<Tooltip placement="top" id="tooltip-top">Check this Radio Button for Donate the Expected Amount which Beneficiaries need. </Tooltip>}>
                    {/* New Radio Button for Amount Available Check */}
                    {beneficiary?.expectedAmountOfMoney && (
                      <div className="row justify-content-center">
                        <div className="col-auto">
                          <Form.Check
                            reverse
                            label={
                              <span
                                style={{
                                  fontWeight: formData.donateVia === 'I want to donate the expected amount.' ? 'bold' : 'normal',
                                  color: formData.donateVia === 'I want to donate the expected amount.' ? 'black' : '#6c757d',
                                }}
                              >
                                I want to Donate the expected amount.
                              </span>
                            }

                            value="I want to donate the expected amount."
                            type={type}
                            name="donateVia"
                            id={`reverse-${type}-3`}
                            checked={formData.donateVia === 'I want to donate the expected amount.'}
                            onChange={handleChange}
                            className='border-end'
                          />
                        </div>
                      </div>

                    )}

                  </OverlayTrigger>
                </>

                <>
                  {beneficiary?.expectedAmountOfMoney > 300 && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip placement="top" id="tooltip-top">Check this Radio Button for Donate the partial of Expected Amount which Beneficiaries need.</Tooltip>}
                    >
                      {/* New Radio Button for Amount Available Check */}
                      <div>
                        <div className="d-flex align-items-center">
                          <hr className="flex-grow-1" /> <span className="px-2"> Or </span> <hr className="flex-grow-1" />
                        </div>
                        <div className="row justify-content-center">
                          <div className="col-auto">
                            <Form.Check
                              reverse
                              label={
                                <span
                                  style={{
                                    fontWeight: formData.donateVia === 'I want to Donate the Partial of the Expected Amount.' ? 'bold' : 'normal',
                                    color: formData.donateVia === 'I want to Donate the Partial of the Expected Amount.' ? 'black' : '#6c757d',
                                  }}
                                >
                                  I want to Donate the Partial of the Expected Amount.
                                </span>
                              }
                              value="I want to Donate the Partial of the Expected Amount."
                              type={type}
                              name="donateVia"
                              id={`reverse-${type}-4`}
                              checked={formData.donateVia === 'I want to Donate the Partial of the Expected Amount.'}
                              onChange={handleChange}
                              className='border-end'
                            />
                          </div>
                        </div>
                      </div>
                    </OverlayTrigger>
                  )}

                  {/* Conditional rendering of the input field when the radio button is checked */}
                  {formData.donateVia === 'I want to Donate the Partial of the Expected Amount.' && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip placement="top" id="tooltip-top">Enter the Partial Amount to Send to the Beneficiary.</Tooltip>}
                    >
                      <Form.Control
                        type="text"
                        placeholder="Enter the Partial Amount to Send to the Beneficiary."
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}

                        autoFocus
                      />
                    </OverlayTrigger>
                  )}
                </>


              </div>
            ))}
          </Form.Group>
        </div>
      );
    }
  };

  let buttonLabel = 'Confirm Donation';
  const remainingAmount = beneficiary?.expectedAmountOfMoney - beneficiary?.fundRaised;

  // Check if the user wants to donate the full expected amount or partial amount
  if (formData.donateVia === 'I want to donate the expected amount.' && remainingAmount) {
    buttonLabel = `Confirm Donation of \u20B9 ${remainingAmount} /-`;
  } else if (formData.donateVia === 'I want to Donate the Partial of the Expected Amount.' && formData.amount) {
    buttonLabel = `Confirm Donation of \u20B9 ${formData.amount}/-`;
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        {/* <Modal.Title>{beneficiary?.applyFor === "Employment" ?  `Cooperation for the Betterment of the Community through ${beneficiary?.updateFullName}` : `Donate to ${beneficiary?.updateFullName}`}</Modal.Title> */}
        <Modal.Title>
          {beneficiary?.applyFor === "Employment" ? (
            <>
              <span className="text-muted">
                Cooperation for the Betterment of the Community through{' '}
              </span>
              {beneficiary?.updateFullName}
            </>
          ) : (
            `Donate to ${beneficiary?.updateFullName}`
          )}
        </Modal.Title>

      </Modal.Header>
      <Modal.Body>
        {/* <Form > */}
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <div className='d-flex align-items-center'>
              <div>
                <Form.Text> {beneficiary?.updateFullName}'S Need: <span style={{ fontStyle: 'italic', fontWeight: "bold" }}> {beneficiary?.applyFor} </span> </Form.Text> <br />
                {renderNeeds()}
                <Form.Text> Description of need: <span style={{ fontStyle: 'italic', fontWeight: "bold" }}> {beneficiary?.descriptionOfNeed} </span> </Form.Text>

              </div>
              <div className='ms-auto'>

                <OverlayTrigger overlay={<Tooltip placement="left" id="tooltip-left"> <span style={{ fontWeight: "bold" }}> Verifier Response: </span>  {beneficiary?.noteByVerifier}</Tooltip>}>
                  <span className="d-inline-block">
                    <Button title='' variant='link'> <VscReferences />  </Button>
                  </span>
                </OverlayTrigger>
              </div>


            </div>

            <Form.Label><span className='text-muted'>  {beneficiary?.applyFor === "Employment" ? "Type of Contribution:" : "Type of Donation:"}</span> <span style={{ fontStyle: 'italic' }}>{donateType}</span> </Form.Label>
            <hr className="flex-grow-1" />


            {/* Render Donation Options based on the donation type */}
            {renderDonationOptions()}

          </Form.Group>

          {(beneficiary?.applyFor !== "Blood" && beneficiary?.applyFor !== "Mentorship" && beneficiary?.applyFor !== "Employment") && (
            <div className='d-flex justify-content-center'>


              <Button type="submit" className="mt-3" disabled={donated} variant={donated ? "outline-primary" : "primary"} >

                {donated ? 'Donated' : buttonLabel}
              </Button>
            </div>
          )}


        </Form>
      </Modal.Body>
      <ToastContainer />
    </Modal>
  );
};

export default DonationModal;

