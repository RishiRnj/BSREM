// import React, { useContext, useState } from 'react';
// import { Form, Button, Card, Spinner } from 'react-bootstrap';
// import AuthContext from '../../Context/AuthContext';
// import '../BackgroundVideo.css';

// import { Google } from "react-bootstrap-icons";
// import EmailVerificationModal from '../EmailVerificationModal';
// import { useNavigate, useLocation } from "react-router-dom";
// import { handleSuccess, handleError, handleWarning } from '../../Components/Util';

// import ForgotPasswordModal from '../ForgotPassword/ForgotPasswordModal';
// import { jwtDecode } from "jwt-decode";
// import { FaEyeSlash, FaEye  } from "react-icons/fa";
// import { ToastContainer } from 'react-toastify';



// function LoginCard({ onRegisterClick }) {
//   const { login, googleLogin, loading } = useContext(AuthContext);
//   const [showPassword, setShowPassword] = useState(false);


//   const [formData, setFormData] = useState({ username: '', email: '', password: '' });
//   const [loadingl, setLoading] = useState(false);
//   const [step, setStep] = useState(1);
//   const [showVerificationModal, setShowVerificationModal] = useState(false);
//   const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();


//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async (event) => {
//     event.preventDefault();
//     const email = event.target.email.value;
//     const password = event.target.password.value;

//     await login(email, password); // Calls AuthContext login function

//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedUser = jwtDecode(token);
//         const currentTime = Date.now() / 1000;

//         if (decodedUser.exp > currentTime) {

//           // Retrieve the stored redirect path or default to "/forum"
//           const redirectPath = localStorage.getItem("redirectAfterLogin") || "/user/:id?/profile";


//           navigate(redirectPath);
//           localStorage.removeItem("redirectAfterLogin"); // Clear after use
//           console.log("Redirecting to", redirectPath);
//         } else {
//           console.error("Token expired.");
//           localStorage.removeItem("token");
//         }
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     } else {
//       handleError("Login failed. Please try again.");
//     }
//   };


//   const onVerifyClick = (e) => {
//     setShowVerificationModal(true);
//   }

//   const onForgotPassword = async (e) => {
//     setShowForgotPasswordModal(true)
//   }



//   return (
//     <>

// <div
//   className="d-flex align-items-center justify-content-center crd-log"
//   style={{ minHeight: `calc(100vh - 115px)` }}> 
//         <Card className="login-card " >
//           <Card.Body className=''>
//             <h3 className="text-center">Log In</h3>
//             <Form className='bd' onSubmit={handleLogin}>
//               <Form.Group controlId="email" className="mb-3">
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control type="email" placeholder="Enter your email" name='email' required autoFocus value={formData.email} onChange={handleChange} />
//               </Form.Group>

//               <Form.Group controlId="password" className="mb-3">
//                 <Form.Label>Password</Form.Label>
//                 <div className="d-flex align-items-center border border-primary rounded">
//                   <Form.Control
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     placeholder="Enter your password"
//                     required
//                     value={formData.password}
//                     onChange={handleChange}
//                     style={{ flex: 1 }}
//                   />
//                   <span
//                     onClick={() => setShowPassword(!showPassword)}
//                     style={{ cursor: "pointer", padding: "0px 20px" }}
//                   >
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </span>
//                 </div>
//               </Form.Group>

//               <Button type="submit" variant="primary" className="d-flex align-items-center justify-content-center w-100" disabled={loading}>

//                 {loading ? (
//                 <span>
//                   <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                   Logging...
//                 </span>
//               ) : (
//                 'Log In'
//               )}
//               </Button>

//               {/* Forget Password Option */}
//               <div className="text-center py-1">
//                 <a href="#" onClick={onForgotPassword} className="text-decoration-none">
//                   Forgot Password?
//                 </a>
//               </div>


//               {/* Not Registered */}
//               <div className="text-center mt-1">
//                 <p>
//                   Not Registered?{" "}
//                   <a href="#" onClick={onRegisterClick} className="text-decoration-none">
//                     Create Account
//                   </a>
//                 </p>
//               </div>

//               {/* Divider */}
//               <div className="d-flex align-items-center ">
//                 <hr className="flex-grow-1" />
//                 <span className="">OR</span>
//                 <hr className="flex-grow-1" />
//               </div>

//               {/* Not Registered */}
//               <div className="text-center mt-1">
//                 <p>
//                   Not Verified?{" "}
//                   <a href="#" onClick={onVerifyClick} className="text-decoration-none">
//                     Click to Verify email
//                   </a>
//                 </p>
//               </div>


//               {/* Divider */}
//               <div className="d-flex align-items-center ">
//                 <hr className="flex-grow-1" />
//                 <span className="">OR</span>
//                 <hr className="flex-grow-1" />
//               </div>

//               {/* Google Sign-In */}
//               <div className="d-grid">

//                 <Button
//                   variant="outline-danger"
//                   onClick={googleLogin}
//                   className="d-flex align-items-center justify-content-center"
//                   disabled={loading} // Disable the button while loading
//                 >
//                   {loading ? (
//                     <>
//                       <Spinner
//                         as="span"
//                         animation="border"
//                         size="sm"
//                         role="status"
//                         aria-hidden="true"
//                         className="me-2"
//                       />
//                       Loading...
//                     </>
//                   ) : (
//                     <>
//                       <Google className="me-2" /> Sign in with Google
//                     </>
//                   )}
//                 </Button>





//               </div>



//             </Form>

//           </Card.Body>
//         </Card>
//         <ToastContainer />
//       </div>


//       <ForgotPasswordModal
//         show={showForgotPasswordModal}
//         onClose={() => setShowForgotPasswordModal(false)}

//       />

//       <EmailVerificationModal
//         show={showVerificationModal}
//         onClose={() => setShowVerificationModal(false)}
//         userEmail={formData.email}
//       />



//     </>
//   );
// }

// export default LoginCard;

import React, { useContext, useState } from 'react';
import { Card, Button, Form, InputGroup } from 'react-bootstrap';
import AuthContext from '../../Context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import ForgotPasswordLink from './ForgotPasswordLink';
import RegisterLink from './RegisterLink';
import GoogleLoginButton from './GoogleLoginButton';

import EmailVerificationModal from '../EmailVerificationModal';
import ForgotPasswordModal from '../ForgotPassword/ForgotPasswordModal';
import { handleError } from '../../Components/Util';
import { ToastContainer } from 'react-toastify';

import LogInEmail from './LogInEmail';
import LogInMobile from './LogInMobile';
import { FaBackspace } from "react-icons/fa";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "./firebase";
import MobileVerification from './MobileVerification';

function LoginCard({ onRegisterClick }) {
  const { login, googleLogin, loading } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [loginOption, setLoninOption] = useState("");

const [phone, setPhone] = useState("");
const [otp, setOtp] = useState("");
const [confirmationResult, setConfirmationResult] = useState(null);
const [showOtpField, setShowOtpField] = useState(false);


// Function to update the phone number in the parent component
const handlePhoneNumber = (phoneNumber) => {
  setPhone(phoneNumber); // This will set the phone number in the parent component's state
};



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const { email, password } = formData;
    await login(email, password);

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedUser.exp > currentTime) {
          const redirectPath = localStorage.getItem('redirectAfterLogin') || '/donate';
          navigate(redirectPath);
          localStorage.removeItem('redirectAfterLogin');
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      handleError('Login failed. Please try again.');
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);


  const handleNextBtn = () => {
    setLoninOption("with  Email & Password");
    setStep(2);
  }
  const handleMobileBtn = () => {
    setLoninOption("with Mobile Number");
    setStep(3);
  }
  const handleLoginOpt = () => {
    setStep(1);
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-center crd-log" style={{ minHeight: 'calc(100vh - 115px)' }}>
        <Card className="login-card">
          <Card.Body>
            <h3 className="text-center">Log In {loginOption} </h3>
            <Form className="bd" onSubmit={handleLogin}>
              {step === 1 && (
                <>
                  <LogInEmail onClick={handleNextBtn} />

                  <LogInMobile onClick={handleMobileBtn} />

                  <GoogleLoginButton onClick={googleLogin} loading={loading} />

                  <div className="d-flex align-items-center ">
                    <hr className="flex-grow-1" />
                    <span>OR</span>
                    <hr className="flex-grow-1" />
                  </div>

                  <RegisterLink onClick={onRegisterClick} />

                  <div className="d-flex align-items-center ">
                    <hr className="flex-grow-1" />
                    <span>OR</span>
                    <hr className="flex-grow-1" />
                  </div>

                  <div className="text-center mt-1">
                    <p className='verimail'>
                      Not Verified?{' '}
                      <a href="#" onClick={() => setShowVerificationModal(true)} className="text-decoration-none">
                        Click to Verify email
                      </a>
                    </p>
                  </div>
                </>

              )}

              {step === 2 && (
                <>
                  <EmailInput value={formData.email} onChange={handleChange} />
                  <PasswordInput
                    value={formData.password}
                    onChange={handleChange}
                    showPassword={showPassword}
                    togglePasswordVisibility={togglePasswordVisibility}
                  />
                  <Button type="submit" variant="primary" className="d-flex align-items-center justify-content-center w-100 mb-2" disabled={loading}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Logging...</> : 'Log In'}
                  </Button>



                  <ForgotPasswordLink onClick={() => setShowForgotPasswordModal(true)} />

                  <div className="d-flex align-items-center ">
                    <hr className="flex-grow-1" />
                    <span>OR</span>
                    <hr className="flex-grow-1" />
                  </div>

                  <div className="text-center mt-1">
                    <p>
                      Not Verified?{' '}
                      <a href="#" onClick={() => setShowVerificationModal(true)} className="text-decoration-none">
                        Click to Verify email
                      </a>
                    </p>
                  </div>

                  <div className='d-flex justify-content-end'>
                    <Button className='d-flex justify-content-center align-items-center' onClick={handleLoginOpt}>
                      Back <FaBackspace className='ms-2' />
                    </Button>
                  </div>



                </>


              )}

              
{step === 3 && (
  <>
    {/* <MobileVerification onPhoneVerified={handlePhoneNumber}/> */}
    <p> Log In with Mobile Number not Available at this moment </p>


    

    

    <div className='d-flex justify-content-end'>
      <Button className='d-flex justify-content-center align-items-center' onClick={handleLoginOpt}>
        Back <FaBackspace className='ms-2' />
      </Button>
    </div>
  </>
)}


            </Form>
          </Card.Body>
        </Card>
        <ToastContainer />
      </div>

      <ForgotPasswordModal show={showForgotPasswordModal} onClose={() => setShowForgotPasswordModal(false)} />
      <EmailVerificationModal show={showVerificationModal} onClose={() => setShowVerificationModal(false)} userEmail={formData.email} />
    </>
  );
}

export default LoginCard;

