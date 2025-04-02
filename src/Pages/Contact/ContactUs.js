import React, { useState } from 'react';
import { Button, Card, Form, InputGroup, Modal, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap';
import './Contact.css';
import EmailVerify from '../../Components/EmailVerify'
import { handleError, handleSuccess, handleWarning } from '../../Components/Util';
import { ToastContainer } from 'react-toastify';




const ContactUs = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    altPhone: '',
    formSelect: '',
    address: '',
    city: '',
    district: '',
    state: '',
    PIN: '',
    country: '',
    formMsg: '',
    keepInfoSecret: false,
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isQuickContact, setIsQuickContact] = useState(false);


  const handleCheckboxChange = (e) => {
    setIsQuickContact(e.target.checked && isVerified); // Allow quick contact only if email is verified
  };

  const handleQuickContact = async () => {
    // Logic to send form data via email
    const updatedFormData = {
      ...formData,
      isQuickContact: true, // Explicitly set to true for quick contact
    };
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/contactFrm/quickContact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFormData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log(updatedFormData);
        setLoading(false);
        setSubmissionStatus('Your Request has been Send successfully!');
        // Reset form data
        setFormData({
          name: '',
          email: '',
          phone: '',
          altPhone: '',
          formSelect: '',
          address: '',
          city: '',
          district: '',
          state: '',
          PIN: '',
          country: '',
          formMsg: '',
          keepInfoSecret: false,
        });
        setIsVerified(false);
      } else {
        setSubmissionStatus(`Error: ${result.message}`);
      }
    } catch (error) {
      setSubmissionStatus('Failed to Send your Request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = (verified) => {
    setModalOpen(false); // Close the modal
    if (verified) {
      setIsVerified(true); // Set the verified status
    }
  };

  const handleVerifyEmail = async (e) => {
    const email = formData.email;
    // Check if email is blank
    if (!email) {
      alert('Please enter your email address before verifying.');
      return;
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/contactFrm/send-email/verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });


      setLoading(false);
      if (response.status === 409) {
        handleWarning("Email is already verified")
        setIsVerified(true); // Set the verified status

      }
      if (response.ok) {
        const data = await response.json();
        console.log(data);

        handleSuccess('OTP Sent successful!');
        setModalOpen(true); // Show email verification modal


      } else {
        const errorData = await response.json();
        handleError(`Verification failed: ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      setLoading(false);
      alert('An error occurred. Please try again later.');
    }


  };


  const handleModalVerify = () => {
    // Simulate email verification logic here
    setIsVerified(true);
    setModalOpen(false); // Close the modal after verification
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value); // Update the selected option state
    setFormData((prev) => ({
      ...prev,
      formSelect: value, // Update the formSelect field in formData
    }));
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target; // Use name instead of id
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    //send Info to database
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/contactFrm/contactInfo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log(formData);
        setLoading(false);
        setSubmissionStatus('Your information has been submitted successfully!');
        // Reset form data
        setFormData({
          name: '',
          email: '',
          phone: '',
          altPhone: '',
          formSelect: '',
          address: '',
          city: '',
          district: '',
          state: '',
          PIN: '',
          country: '',
          formMsg: '',
          keepInfoSecret: false,
        });
        setIsVerified(false);
      } else {
        setSubmissionStatus(`Error: ${result.message}`);
      }
    } catch (error) {
      setSubmissionStatus('Failed to submit your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-us-container">
      <div className="contact-image"></div>
      <Card className="contact-form-card">
        <Card.Body>
          <h3 className="text-center">Contact Us</h3>
          {submissionStatus && <div className="alert alert-success">{submissionStatus}</div>}
          <Form onSubmit={(e) => {
            e.preventDefault();
            isQuickContact ? handleQuickContact() : handleSubmit();
          }}
          >
            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Please Type your Name!</Tooltip>}>
              <Form.Group as={Col} >
                <Form.Control
                  name='name'
                  type="text"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </OverlayTrigger>

            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled"> Enter your Email & Verify it for Quick Response </Tooltip>} >

              <Form.Group className="mb-3 mt-3">
                <div className="d-flex align-items-center border border-primary rounded">
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your Email"
                    aria-label="Enter your Email"
                    aria-describedby="basic-verify"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{ flex: 1 }}
                  />
                  <span
                    onClick={!isVerified && !loading ? handleVerifyEmail : null}
                    style={{
                      cursor: isVerified || loading ? 'not-allowed' : 'pointer',
                      padding: '0px 10px',
                      color: isVerified ? 'green' : 'blue',
                      pointerEvents: isVerified || loading ? 'none' : 'auto',
                    }}
                  >
                    {isVerified ? (
                      'Verified'
                    ) : loading ? (
                      <span>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        Sending...
                      </span>
                    ) : (
                      'Verify'
                    )}
                  </span>


                </div>

                {isVerified && (
                  <div className="d-flex justify-content-center align-items-center mb-2">
                    <input
                      type="checkbox"
                      name="quickContact"
                      checked={formData.isQuickContact}
                      onChange={handleCheckboxChange}
                    />
                    <label className="ms-3">Send information via Email</label>
                  </div>
                )}

              </Form.Group>
            </OverlayTrigger>





            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Enter your Phone & Alternate Ph.No.</Tooltip>}>
              <Row className="mb-3 mt-3">
                <Form.Group as={Col} >
                  <Form.Control
                    name='phone'
                    type="tel"
                    placeholder="Enter Phone No."
                    value={formData.phone}
                    onChange={handleInputChange}
                    required />
                </Form.Group>

                <Form.Group as={Col} >
                  <Form.Control name='altPhone' type="tel" placeholder="Alternate Ph. No" value={formData.altPhone}
                    onChange={handleInputChange} />
                </Form.Group>
              </Row>
            </OverlayTrigger>


            <Form.Group className="mb-3" >
              <Form.Select
                name='formSelect'
                aria-label="Default select example"
                onChange={handleSelectChange}
                value={selectedOption}>
                <option value="">Choose any one...</option>
                <option value="indainHindu">Hindu From India</option>
                <option value="gobalHindu">Hindu From Outside India</option>
              </Form.Select>
            </Form.Group>
            {/* Additional form logic */}

            {selectedOption === 'indainHindu' && (
              <div id="addressIn">
                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Enter your Address, like- Village, Area</Tooltip>}>
                  <Form.Group className="mb-3" >
                    <Form.Control
                      name='address'
                      placeholder="Your Current Address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required />
                  </Form.Group></OverlayTrigger>
                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Enter your City and District</Tooltip>}>
                  <Row className="mb-3">
                    <Form.Group as={Col} >
                      <Form.Control name='city'
                        placeholder='Enter City' value={formData.city} onChange={handleInputChange} required />
                    </Form.Group>
                    <Form.Group as={Col} >
                      <Form.Control name='district' placeholder='District' value={formData.district} onChange={handleInputChange} />
                    </Form.Group>
                  </Row>
                </OverlayTrigger>



                <Row className="mb-3">
                  <Form.Group as={Col} >
                    {/* <Form.Label>State</Form.Label> */}
                    <Form.Select name='state' value={formData.state} onChange={handleInputChange}>
                      <option>State...</option>
                      <option>Andhra Pradesh</option>
                      <option>Arunachal Pradesh</option>
                      <option>Assam</option>
                      <option>Bihar</option>
                      <option>Chhattisgarh</option>
                      <option>Goa</option>
                      <option>Gujarat</option>
                      <option>Haryana</option>
                      <option>Himachal</option>
                      <option>Dharamshala</option>
                      <option>Jharkhand</option>
                      <option>Karnataka</option>
                      <option>Kerala</option>
                      <option>Madhya Pradesh</option>
                      <option>Maharashtra</option>
                      <option>Nagpur</option>
                      <option>Manipur</option>
                      <option>Meghalaya</option>
                      <option>Mizoram</option>
                      <option>Nagaland</option>
                      <option>Odisha</option>
                      <option>Punjab</option>
                      <option>Rajasthan</option>
                      <option>Sikkim</option>
                      <option>Tamil Nadu</option>
                      <option>Telangana</option>
                      <option>Tripura</option>
                      <option>Uttar Pradesh</option>
                      <option>Uttarakhand</option>
                      <option>Dehradun</option>
                      <option>West Bengal</option>
                      <option>Andaman and Nicobar Islands</option>
                      <option>Chandigarh</option>
                      <option>Dadra and Nagar Haveli and Daman and Diu</option>
                      <option>Delhi</option>
                      <option>Jammu and Kashmir</option>
                      <option>Jammu</option>
                      <option>Ladakh</option>
                      <option>Kargil</option>
                      <option>Lakshadweep</option>
                      <option>Puducherry</option>

                      {/* Add remaining states */}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col} >
                    {/* <Form.Label>PIN or Zip</Form.Label> */}
                    <Form.Control name='PIN' placeholder='Pin or Zip' value={formData.PIN} onChange={handleInputChange} />
                  </Form.Group>
                </Row>
              </div>
            )}

            {selectedOption === 'gobalHindu' && (
              <div id="addOutIn">

                <Form.Group className="mb-3" >
                  {/* <Form.Label>Address</Form.Label> */}
                  <Form.Control
                    name='address'
                    placeholder="Your Current Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Write the name of your City!</Tooltip>}>
                  <Row className="mb-3">
                    <Form.Group as={Col} >
                      {/* <Form.Label>City</Form.Label> */}
                      <Form.Control
                        name='city'
                        placeholder="The City you live in"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Row>
                </OverlayTrigger>
                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Write your Country or Territory!</Tooltip>}>
                  <Row className="mb-3">
                    <Form.Group as={Col} >
                      {/* <Form.Label>Country</Form.Label> */}
                      <Form.Control
                        name='country'
                        placeholder="Name your Country or Territory or Region"
                        value={formData.country}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Row>
                </OverlayTrigger>
              </div>
            )}
            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Please write something so that we can easily understand your language!</Tooltip>}>
              <Form.Group className="mb-3" >
                {/* <Form.Label>Message</Form.Label> */}
                <Form.Control name='formMsg' as="textarea" placeholder="Type your Short Message" type="text" value={formData.formMsg}
                  onChange={handleInputChange} />
              </Form.Group>
            </OverlayTrigger>

            <div className="d-flex justify-content-center align-items-center mb-2">
              <input
                type="checkbox"
                name="keepInfoSecret"
                checked={formData.keepInfoSecret}
                onChange={handleChange}
              />
              <label className="ms-3">Keep my Information Secret</label>
            </div>

            
            <Button type="submit" style={{ width: '100%' }} disabled={loading}>
              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" style={{ marginRight: '8px' }}></span> {/* Spinner */}
                  {isQuickContact ? 'Sending...' : 'Submitting...'}
                </span>
              ) : (
                isQuickContact ? 'Send Mail' : 'Submit'
              )}
            </Button>


          </Form>

          {/* Email Verification Modal */}
          <EmailVerify
            show={isModalOpen}
            onClose={(verified) => handleModalClose(verified)}
            onHide={() => setModalOpen(false)}
            onVerify={handleModalVerify}
            userEmail={formData.email}
          />
        </Card.Body>
      </Card>
      <ToastContainer /> {/* Toast Notifications */}
    </div>
  );
};

export default ContactUs;

