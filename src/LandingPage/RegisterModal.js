import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { handleSuccess, handleError, handleWarning } from '../Components/Util';
import EmailVerificationModal from './EmailVerificationModal';

import { FaEyeSlash, FaEye  } from "react-icons/fa";
import { ToastContainer } from 'react-toastify';

function RegisterModal({ show, onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);



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


  const handleRegister = async (event) => {
    event.preventDefault();
    const { username, email, password, agreed } = formData;
    if (username.length < 3) {
      return handleError("Use at least 3 characters for Name.");
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

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return handleError("Please enter a valid email address.");
    }

    // Check if terms are agreed
    if (!agreed) {
      return handleError("You must agree to the terms and conditions.");
    }


    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      setLoading(false);

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        handleSuccess('Registration successful!');
        setShowVerificationModal(true); // Show email verification modal
        onClose(); // Close registration modal

      } else {
        const errorData = await response.json();
        handleError(`Registration failed: ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      setLoading(false);
      handleError('An error occurred. Please try again later.');
    }
  };

  return (

    <>
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRegister}>
            <Form.Group controlId="username" className="mb-3">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                required
                onChange={handleChange} autoFocus
              />
            </Form.Group>
            <Form.Group controlId="email" className="mb-3">
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
            <Form.Group controlId="password" className="mb-3">
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
            <div className="form-check mb-3 d-flex justify-content-center align-items-center">
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

    </>





  );
}

export default RegisterModal;
