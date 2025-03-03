// import React, { useState } from 'react';
// import { Modal, Button, Form } from 'react-bootstrap';
// import { handleSuccess, handleError } from '../Components/Util';
// import './BackgroundVideo.css';
// import { ToastContainer } from 'react-toastify';


// function EmailVerificationModal({ show, onClose, userEmail }) {
//   const [otp, setOtp] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [loadingR, setLoadingR] = useState(false);

//   const handleChange = (e) => {
//     const input = e.target.value;

//     // Allow only digits (0-9) and ensure the length is at most 4
//     if (/^\d{0,4}$/.test(input)) {
//       setOtp(input); // Update the state if valid
//     } else {
//       handleError("Please enter a valid number with up to 4 digits only.");
//     }
//   };

//   const handleVerify = async () => {
//     if (!otp) return handleError('Please enter the verification code.');

//     setLoading(true);
//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/verifyEmail`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email: userEmail, verificationCode: otp }),
//       });
//       console.log({ email: userEmail, verificationCode: otp });


//       setLoading(false);

//       if (response.ok) {
//         handleSuccess('Email verified successfully!');
//         onClose(); // Close the verification modal
//       } else {
//         const errorData = await response.json();
//         console.log(errorData);

//         handleError(errorData.message || 'Verification failed. Please try again.');
//       }
//     } catch (error) {
//       setLoading(false);
//       handleError('An error occurred. Please try again later.');
//     }
//   };

//   const handleResendCode = async () => {
//     setLoadingR(true);
//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/resend-verification-email`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email: userEmail }),
//       });

//       setLoadingR(false);

//       if (response.ok) {
//         handleSuccess('Verification code resent to your email!');
//       } else {
//         const errorData = await response.json();
//         handleError(errorData.message || 'Failed to resend verification code.');
//       }
//     } catch (error) {
//       setLoadingR(false);
//       handleError('An error occurred. Please try again later.');
//     }
//   };

//   return (
//     <Modal show={show} onHide={onClose} centered>
//       <Modal.Header closeButton>
//         <Modal.Title className="w-100 text-center">Verify Your Email</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <p>A verification code has been sent to your email: <b>{userEmail}</b></p>

//         <Form>
          
//           <Form.Group controlId="otp" className="mb-3 text-center">
//             <Form.Label>Verification Code</Form.Label>
//             <Form.Control id='inpOTP'
//               type="text" // Use "text" to handle input validation manually
//               placeholder="Enter the OTP "
//               value={otp}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>
//           <Button variant="primary" onClick={handleVerify} disabled={loading} className="w-100 mb-3">
//             {/* {loading ? 'Verifying...' : 'Verify Email'} */}
//             {loading ? (
//               <span>
//                 <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                 Verifying...
//               </span>
//             ) : (
//               'Verify Email'
//             )}


//           </Button>
//           <Button variant="secondary" className="w-100 btn btn-primary justify-content-center align-items-center secondary btn-sm" onClick={handleResendCode} disabled={loadingR}>
//             {/* {loading ? 'Sending...' : 'Resend Verification Code'}  */}
//             {loadingR ? (
//               <span>
//                 <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                 Sending.....
//               </span>
//             ) : (
//               'Resend Verification Code'
//             )}


//           </Button>
//         </Form>
//       </Modal.Body>
//       <ToastContainer /> {/* Toast Notifications */}
//     </Modal>

//   );
// }

// export default EmailVerificationModal;

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { handleSuccess, handleError } from '../Components/Util';
import './BackgroundVideo.css';
import { ToastContainer } from 'react-toastify';

function EmailVerificationModal({ show, onClose, userEmail }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingR, setLoadingR] = useState(false);
  const [manualEmail, setManualEmail] = useState(''); // State for manually entered email

  useEffect(() => {
    // If there is a userEmail, set it in the manualEmail field
    if (userEmail) {
      setManualEmail(userEmail);
    }
  }, [userEmail]);

  const handleChange = (e) => {
    const input = e.target.value;

    // Allow only digits (0-9) and ensure the length is at most 4
    if (/^\d{0,4}$/.test(input)) {
      setOtp(input); // Update the state if valid
    } else {
      handleError("Please enter a valid number with up to 4 digits only.");
    }
  };

  const handleVerify = async () => {
    const emailToVerify = manualEmail.trim(); // Use manualEmail for the email to verify
    if (!emailToVerify) return handleError('Please enter an email address.');
    if (!otp) return handleError('Please enter the verification code.');

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/verifyEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToVerify, verificationCode: otp }),
      });

      setLoading(false);

      if (response.ok) {
        handleSuccess('Email verified successfully!');
        onClose(); // Close the verification modal
      } else {
        const errorData = await response.json();
        handleError(errorData.message || 'Verification failed. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      handleError('An error occurred. Please try again later.');
    }
  };

  const handleResendCode = async () => {
    const emailToResend = manualEmail.trim(); // Use manualEmail for resending the code
    if (!emailToResend) return handleError('Please enter an email address.');

    setLoadingR(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/resend-verification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToResend }),
      });

      setLoadingR(false);

      if (response.ok) {
        handleSuccess('Verification code resent to your email!');
      } else {
        const errorData = await response.json();
        handleError(errorData.message || 'Failed to resend verification code.');
      }
    } catch (error) {
      setLoadingR(false);
      handleError('An error occurred. Please try again later.');
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">Verify Your Email</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className='text-center'>A verification code has been sent to your email: <b>{userEmail || ''}</b></p>
        <Form>
          {/* Conditionally render email input if userEmail doesn't exist */}
          {!userEmail && (
            <Form.Group controlId="manualEmail" className="mb-3 text-center">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
              style={{textAlign:"center"}}
                type="email"
                placeholder="Enter your email"
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
                required
              />
            </Form.Group>
          )}
          <Form.Group controlId="otp" className="mb-3 text-center">
            <Form.Label>Verification Code</Form.Label>
            <Form.Control
              id='inpOTP'
              type="text"
              placeholder="Enter the OTP"
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
          <Button
            variant="secondary"
            className="w-100 btn btn-primary justify-content-center align-items-center secondary btn-sm"
            onClick={handleResendCode}
            disabled={loadingR}
          >
            {loadingR ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Sending.....
              </span>
            ) : (
              'Resend Verification Code'
            )}
          </Button>
        </Form>
      </Modal.Body>
      <ToastContainer /> {/* Toast Notifications */}
    </Modal>
  );
}

export default EmailVerificationModal;

