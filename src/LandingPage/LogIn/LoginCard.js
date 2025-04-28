
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
import MobileVerification from './MobileVerification';

function LoginCard({ onRegisterClick }) {
  const { login, googleLogin, loading, mobileLogin } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loginOption, setLoninOption] = useState("");
  const [phone, setPhone] = useState("");
  


  // Function to update the phone number in the parent component
  const handlePhoneNumber = async (phoneNumber) => {
    setPhone(phoneNumber);

    try {
      await mobileLogin(phoneNumber); // 👈 Trigger mobile login from context
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
      }
    } catch (err) {
      console.error("Mobile login failed", err);
      handleError("Mobile login failed. Please try again.");
    }
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
    setLoninOption("Email & Password");
    setStep(2);
  }
  const handleMobileBtn = () => {
    setLoninOption("Mobile Number");
    setStep(3);
  }
  const handleLoginOpt = () => {
    setLoninOption("");
    setStep(1);
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-center crd-log" style={{ minHeight: 'calc(100vh - 115px)' }}>
        <Card className="login-card">
          <Card.Body>
            <h3 className="text-center">Log In with<br/> <span className='fs-4 herO'>{loginOption}</span>  </h3>
            <Form className="bd" //onSubmit={handleLogin}
            >
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
                  <Button type="submit" variant="primary" className="d-flex align-items-center justify-content-center w-100 mb-2" disabled={loading} onClick={handleLogin}>
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
                 <Card>
                                  
                <h6 className='text-center fw-bold'>Enter a valid Phone Number!</h6>
                  <MobileVerification onPhoneVerified={handlePhoneNumber} />
                  </Card>

                  <div className='d-flex justify-content-end mt-3'>
                    <Button className='d-flex justify-content-center align-items-center' onClick={handleLoginOpt}>
                      Back <FaBackspace className='ms-2' />
                    </Button>
                  </div>
                </>
              )}


            </Form>
          </Card.Body>
        </Card>
       
      </div>

      <ForgotPasswordModal show={showForgotPasswordModal} onClose={() => setShowForgotPasswordModal(false)} />
      {/* <EmailVerificationModal show={showVerificationModal} onClose={() => setShowVerificationModal(false)} userEmail={formData.email} /> */}
      {showVerificationModal && (       
        <EmailVerificationModal
          show={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          userEmail={formData.email || ''}
        />       
      )}
       <ToastContainer />

    </>
  );
}

export default LoginCard;

