import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { handleSuccess, handleError } from '../Components/Util';
import ToastContainer from 'react-bootstrap/ToastContainer';



function EmailVerify({ show, onClose, userEmail }) {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);    

    const handleChange = (e) => {
        const input = e.target.value;
        // Allow only digits (0-9) and ensure the length is at most 4
        if (/^\d{0,4}$/.test(input)) {
            setOtp(input); // Update the state if valid
        } else {
            alert("Please enter a valid number with up to 4 digits only.");
        }
    };

    
    const handleVerify = async () => {
        if (!otp) return alert('Please enter the verification code.');

        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/contactFrm/verifyEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail, otp }),
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                handleSuccess(data.msg || 'Email verified successfully!');
                onClose(true); // Indicate success
            } else {
                handleError(data.msg || 'Verification failed. Please try again.');
            }
        } catch (error) {
            setLoading(false);
            handleError('An error occurred. Please try again later.');
        }
    };


    const handleResendCode = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/resend-verification-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail }),
            });

            setLoading(false);

            if (response.ok) {
                handleSuccess('Verification code resent to your email!');
            } else {
                const errorData = await response.json();
                handleError(errorData.message || 'Failed to resend verification code.');
            }
        } catch (error) {
            setLoading(false);
            handleError('An error occurred. Please try again later.');
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="w-100 text-center">Verify Your Email</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>A verification code has been sent to your email: <b>{userEmail}</b></p>
                <Form>
                    <Form.Group controlId="otp" className="mb-3 text-center">
                        <Form.Label>Verification Code</Form.Label>
                        <Form.Control id='inpOTP'
                            type="text" // Use "text" to handle input validation manually
                            placeholder="Enter the OTP "
                            value={otp}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={handleVerify} disabled={loading} className="w-100 mb-3">
                        {loading ? (
                            <span>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Verifying...
                            </span>
                        ) : (
                            'Verify Email'
                        )}
                    </Button>
{/* 

                    <Button variant="secondary" className="w-100 btn btn-primary justify-content-center align-items-center secondary btn-sm" onClick={handleResendCode} disabled={loading}>
                        Resend Verification Code
                    </Button> */}
                </Form>
            </Modal.Body>
            <ToastContainer /> {/* Toast Notifications */}
        </Modal>
    );
}

export default EmailVerify;
