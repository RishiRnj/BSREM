import React, { useState } from 'react';
import { Modal, Button, Form, Card } from 'react-bootstrap';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { handleSuccess, handleError, handleWarning } from '../Components/Util';
import EmailVerificationModal from './EmailVerificationModal';

import { FaEyeSlash, FaEye } from "react-icons/fa";
import { ToastContainer } from 'react-toastify';
import { GoVerified, } from "react-icons/go";
import MobileVerification from './LogIn/MobileVerification';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import UsernameInput from '../Components/Common/UsernameInput ';


function RegisterModal({ show, onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', mobile: '' });
  const [loading, setLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const [showModal, setShowModal] = useState(false);  // State to control modal visibility
  const [onVerified, setOnVerified] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showConfirmS, setShowConfirmS] = useState(false);





  const handleChange = (e) => {
    //     // setFormData({ ...formData, [e.target.name]: e.target.value });

    const { name, value, type, checked } = e.target;

    // Validation for fName and lName fields
    if ((name === "username") && !/^[a-zA-Z\s]*$/.test(value)) {
      handleError("Please enter a valid name (alphabets only).");
      return; // Prevent updating the state with invalid input
    }

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    //
  };
  console.log("formData ->", formData);


  const handleConfirmYes = async () => {
    setShowConfirm(false);
    setShowConfirmS(true); // Optional: track confirmation

    setLoading(true);
    const { username, email, password, mobile } = formData;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, mobile }),
      });

      setLoading(false);

      if (response.ok) {
        const data = await response.json();
        handleSuccess('Registration successful!');
        setShowVerificationModal(true);
        onClose();
      } else {
        const errorData = await response.json();
        handleError(`Registration failed: ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      setLoading(false);
      handleError('An error occurred. Please try again later.');
    }
  };



  const handleConfirmNo = () => {
    setShowConfirm(false);

  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const { username, email, password, mobile, agreed } = formData;
    if (username.length < 3) {
      return handleError("Use at least 3 characters for Name.");
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return handleError("Please enter a valid email address.");
    }

    if (password.length < 6) {
      return handleError("Password must be at least 6 characters long.");
    } else if (!/[A-Z]/.test(password)) {
      return handleError("Password At least one uppercase letter.");
    } else if (!/[a-z]/.test(password)) {
      return handleError("Password At least one lowercase letter.");
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return handleError("Password At least one special character.");
    }

    // Validate Mobile Number (empty or not verified)
    if (!mobile || !onVerified) {
      handleWarning("Mobile number is required and must be verified");
      return;
    }

    // Check if terms are agreed
    if (!agreed) {
      return handleError("You must agree to the terms and conditions.");
    }

    // Show confirmation modal instead of submitting
    setShowConfirm(true);
  };


  // Open modal
  const handleInputFocus = () => {
    setShowModal(true);
  };

  // Close modal manually (can be done from inside MobileVerification if needed)
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePhoneNumber = (phoneNumber) => {
    setFormData((prevData) => ({ ...prevData, mobile: phoneNumber }));
    setOnVerified(true);
    handleCloseModal();  // Close modal after phone verification
  };


  return (

    <>
      <Modal show={show} onHide={onClose} centered className='sign-card p-4'>
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">Register</Modal.Title>
        </Modal.Header>
        <Modal.Body className='m-4'>
          <Form onSubmit={handleRegister}
          >
            <Form.Group controlId="username" className="mb-2">
              
              <UsernameInput
                        value={formData.username}
                        onChange={handleChange}
                        disabled={formData.fullName}
                        readOnly={formData.fullName}
                      />
            </Form.Group>


            <Form.Group controlId="email" className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="password" className="mb-2">
              <Form.Label>Password</Form.Label>
              <div className="d-flex align-items-center border border-primary rounded">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ flex: 1 }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer", padding: "0px 20px" }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </Form.Group>


            {formData?.mobile ? (
              // If mobile exists, render the Mobile number with Verification mark
              <div className="position-relative mb-2">
                <Form.Group controlId="mobile" className="mb-2">
                  <Form.Label>Mobile</Form.Label>
                  <PhoneInput
                    name="mobile"
                    placeholder='Enter Phone Number'
                    disabled={onVerified}
                    country={'in'}
                    value={formData.mobile}
                    inputProps={{ name: 'mobile' }}
                    inputStyle={{ width: '100%', borderRadius: '5px' }}
                  />
                  {(onVerified) && (
                    <GoVerified
                      className="position-absolute"
                      style={{
                        right: 10,
                        top: "70%",
                        transform: "translateY(-50%)",
                        color: "green",
                      }}
                    />
                  )}
                </Form.Group>


              </div>

            ) : (
              <Form.Group controlId="mobile" className="mb-2" onClick={handleInputFocus}>
                <Form.Label>Mobile</Form.Label>

                <PhoneInput
                  name="mobile"
                  placeholder='Enter Phone Number'
                  disabled={onVerified}
                  country={'in'}
                  value={formData.mobile}
                  inputProps={{ name: 'mobile' }}
                  inputStyle={{ width: '100%', borderRadius: '5px' }}
                />
              </Form.Group>
            )}

            <div className="form-check mb-2 d-flex justify-content-center align-items-center">
              <input
                type="checkbox"
                className="form-check-input me-2"
                name="agreed"
                required
                onChange={handleChange}

              />
              <label className="form-check-label">
                I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>
              </label>
            </div>


            <Button variant="primary" type="submit" className="w-100 " disabled={loading}>

              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Submitting...
                </span>
              ) : (
                'Register'
              )}
            </Button>


          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer /> {/* Toast Notifications */}

      <EmailVerificationModal
        show={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        userEmail={formData.email}
      />

      {/* Custom Modal for Mobile Verification */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Phone Number Verification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
                        <h6 className='text-center herO fw-bold'>Enter Valid Phone Number!</h6>
          {/* Render the MobileVerification component inside the modal */}
          <MobileVerification onPhoneVerified={handlePhoneNumber} />
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom Modal for Confirmation occupation details */}
      <Modal show={showConfirm} onHide={handleConfirmNo} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body> Are you sure you want to register with this information?</Modal.Body>
        <Modal.Footer>

          <Button variant="primary" onClick={handleConfirmYes}>Yes</Button>
          <Button variant="secondary" onClick={handleConfirmNo}>No</Button>
        </Modal.Footer>
      </Modal>

    </>

  );
}

export default RegisterModal;
