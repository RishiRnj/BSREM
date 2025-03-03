import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
// import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { handleSuccess, handleError } from '../../Components/Util';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { FaEyeSlash, FaEye  } from "react-icons/fa";



const ResetPasswordModal = ({ show }) => {
  const { token } = useParams(); // Get the token from the route
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      handleError("Passwords do not match");

      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      handleError("Password must be at least 6 characters long.");

      return
    } else if (!/[A-Z]/.test(password)) {
      setError("Password At least one uppercase letter.");
      handleError("Password At least one uppercase letter.");
      return
    } else if (!/[a-z]/.test(password)) {
      setError("Password At least one lowercase letter.");
      handleError("Password At least one lowercase letter.");
      return
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setError("Password At least one special character.");
      handleError("Password At least one special character.");
      setLoading(false);
      return
    }

    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      setLoading(false);
      handleSuccess("Password reset successfully"); // Show success message and redirect to the login page

      setSuccess(true);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/'); // Redirect to the homepage after closing
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100">Reset Your Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success ? (
          <Alert variant="success">
            Your password has been successfully reset. You can now log in.
          </Alert>
        ) : (
          <>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="password" className="mb-3">
                <Form.Label>New Password</Form.Label>
                <div className="d-flex align-items-center border border-primary rounded">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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


              <Form.Group controlId="confirmPassword" className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <div className="d-flex align-items-center border border-primary rounded">
                  <Form.Control
                    name="confirmPassword"
                    type={showConPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ flex: 1 }}
                  />
                  <span
                    onClick={() => setShowConPassword(!showConPassword)}
                    style={{ cursor: "pointer", padding: "0px 20px" }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                {loading ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating New Password...
                  </span>
                ) : (
                  'Create Password'
                )}

              </Button>
            </Form>
          </>
        )}
      </Modal.Body>
      <ToastContainer />
    </Modal>
  );
};

export default ResetPasswordModal;
