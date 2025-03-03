import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { handleSuccess, handleError } from '../../Components/Util';
import ToastContainer from 'react-bootstrap/ToastContainer';


const ForgotPasswordModal = ({ show, onClose, userEmail }) => {
    const [formData, setFormData] = useState({ email: '', confirmEmail: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    console.log(formData);


    const sendResetLink = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.email !== formData.confirmEmail) {
            setError("Emails do not match");
            handleError("Emails do not match. Please check again.");
            setLoading(false);
            return;
        }
        if (!formData.email) {
            setError("Enter a valid email address.");
            setLoading(false);
            handleError("Please enter a valid email address.");
            return;
        }
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Email must use @email.com");
            handleError("Email must use @email.com");
            setLoading(false);
            return;
        }
        const email = formData.email;
        setError('');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();
            setLoading(false)
            if (response.ok) {
                handleSuccess(result.msg || "Password reset link sent to your email.");
                setIsSubmitted(true); // Show success message and Resend button
                setSuccess(true);
            } else {
                setLoading(false);
                handleError(result.msg || "Failed to send password reset link.");

            }
        } catch (err) {
            handleError(err.message || "Network error.");
            setError(err.message);
        } finally {
            setLoading(false); // Stop the spinner
        }
    }

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="w-100 text-center">Confirm Email to Send Reset Link</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {success ? (
                    <Alert variant="success">
                        Your Password Reset Link has been sent successfully in your Email, to create New Password Click that Link.
                    </Alert>
                ) : (
                    <>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form>
                            <Form.Group controlId="email" className='mb-2'>
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    autoFocus
                                    type="email"
                                    name="email" // Add this line
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your registered email"
                                />
                            </Form.Group>
                            {/* Other fields or buttons */}
                            <Form.Group controlId="confirmEmail" className='mb-4'>
                                <Form.Label>Re-Enter Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="confirmEmail" // Add this line
                                    required
                                    value={formData.confirmEmail}
                                    onChange={handleChange}
                                    placeholder="Re-Enter your registered email"
                                />
                            </Form.Group>
                            <Button type="submit" variant="primary" className="w-100 mb-3" disabled={loading} onClick={sendResetLink}>


                                {loading ? (
                                    <span>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Submitting...
                                    </span>
                                ) : (
                                    'Submit'
                                )}
                            </Button>
                        </Form>
                    </>)}
            </Modal.Body>
            <ToastContainer />
        </Modal>
    )
}

export default ForgotPasswordModal