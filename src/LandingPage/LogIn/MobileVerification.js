import React, { useContext, useState, useEffect } from 'react';
import { Card, Button, Form, InputGroup, FormGroup } from 'react-bootstrap';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "./firebase";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { GoVerified } from "react-icons/go";


const MobileVerification = ({ onPhoneVerified }) => {

  // const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [showOtpField, setShowOtpField] = useState(false);
  const [formData, setFormData] = useState({

    mobile: "",

  });

  const [formError, setFormError] = useState({});

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(40); // 40 seconds countdown
  const [isDisabled, setIsDisabled] = useState(false);
  const [verified, setVerified] = useState(false);
  const [onVerified, setOnVerified] = useState(false);


  useEffect(() => {
    // Make sure recaptcha container exists before initializing RecaptchaVerifier
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => console.log("Recaptcha verified"),
    });
  }, []); // Empty array ensures this runs only once when the component mounts


  const validatePhoneNumber = (phone, countryCode) => {
    console.log('Validating phone:', phone, 'Country code:', countryCode);

    // Ensure phone number starts with '+' (for E.164 format)
    if (!phone.startsWith('+')) {
      phone = `+${phone}`;
    }

    const phoneNumber = parsePhoneNumberFromString(phone, countryCode);
    console.log('Parsed phone number:', phoneNumber);

    return phoneNumber?.isValid() || false;
  };

  const handleChange = (e, value = null, countryCode = null, isPhoneInput = false) => {
    if (isPhoneInput) {
      const isValid = validatePhoneNumber(value, countryCode); // Validate using dynamic country code
      if (isValid) {
        console.log('Phone number is valid:', value);
        setFormData((prevData) => ({ ...prevData, mobile: value }));
        setVerified(true)
        setFormError((prevError) => ({ ...prevError, mobile: '' })); // Clear error
      } else {
        console.error('Invalid phone number:', value);
        setFormError((prevError) => ({ ...prevError, mobile: 'Invalid phone number' })); // Set error
      }
    }
  }


  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => console.log("Recaptcha verified"),
    });
  };




  // const handleSendOTP = async () => {
  //   const fullPhoneNumber = `+${formData.mobile}`;
  //   //`+91${phone}`; // Prepend +91 when sending the phone number

  //   console.log("phone ", fullPhoneNumber);


  //   setupRecaptcha();
  //   try {
  //     const result = await signInWithPhoneNumber(auth, fullPhoneNumber, window.recaptchaVerifier);
  //     setConfirmationResult(result);
  //     setShowOtpField(true);

  //     alert("OTP sent!");
  //   } catch (error) {
  //     console.error("Error sending OTP:", error);
  //   }
  // };


  // const handleSendOTP = async () => {
  //   const fullPhoneNumber = `+${formData.mobile}`;
  //   //`+91${phone}`; // Prepend +91 when sending the phone number

  //   console.log("phone ", fullPhoneNumber);

  //   if (!formData.mobile || formData.mobile == "") {
  //    return alert("valid mobile no required")
  //   }


  //   setupRecaptcha();
  //   try {
  //     const result = await signInWithPhoneNumber(auth, fullPhoneNumber, window.recaptchaVerifier);
  //     setConfirmationResult(result);
  //     setShowOtpField(true);

  //     alert("OTP sent!");

  //     setIsOtpSent(true);  // Set OTP as sent
  //     setIsDisabled(true);  // Disable the button
  //     let countdown = 40;   // Set initial countdown to 40 seconds
  //     setTimer(countdown);

  //     // Start the countdown
  //     const interval = setInterval(() => {
  //       countdown -= 1;
  //       setTimer(countdown);
  //       if (countdown <= 0) {
  //         clearInterval(interval);  // Clear the interval when countdown reaches 0
  //         setIsDisabled(false);  // Enable the button again
  //         setIsOtpSent(false);   // Reset OTP sent state
  //       }
  //     }, 1000);
  //   } catch (error) {
  //     console.error("Error sending OTP:", error);
  //   }
  // };


  const handleSendOTP = async () => {
    const fullPhoneNumber = `+${formData.mobile}`; // Prepend country code to phone number
    console.log("phone ", fullPhoneNumber);

    // Validate phone number before sending OTP
    const isValidPhone = validatePhoneNumber(fullPhoneNumber, 'IN');  // 'IN' is the country code for India, modify as needed
    if (!isValidPhone) {
      return alert("Please enter a valid mobile number.");
    }
    console.log("ph.", fullPhoneNumber);


    if (!formData.mobile || formData.mobile === "") {
      return alert("Valid mobile number is required.");
    }

    // Setup recaptcha
    setupRecaptcha();

    try {
      const result = await signInWithPhoneNumber(auth, fullPhoneNumber, window.recaptchaVerifier);
      setConfirmationResult(result);
      setShowOtpField(true);

      alert("OTP sent!");

      setIsOtpSent(true);  // Set OTP as sent
      setIsDisabled(true);  // Disable the button
      let countdown = 40;   // Set initial countdown to 40 seconds
      setTimer(countdown);

      // Start the countdown
      const interval = setInterval(() => {
        countdown -= 1;
        setTimer(countdown);
        if (countdown <= 0) {
          clearInterval(interval);  // Clear the interval when countdown reaches 0
          setIsDisabled(false);  // Enable the button again
          setIsOtpSent(false);   // Reset OTP sent state
        }
      }, 1000);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };


  const handleVerifyOTP = async () => {
    const fullPhoneNumber = `+${formData.mobile}`;
    // const fullPhoneNumber = `+91${phone}`; // Prepend +91 when sending the phone number
    try {
      const credential = await confirmationResult.confirm(otp);
      console.log("User Verified:", credential.user);
      alert("Phone verified successfully!");
      // Call onPhoneVerified to pass the phone number to the parent component
      onPhoneVerified(fullPhoneNumber); // Pass the phone number to the parent component
      setOnVerified(true)
      setVerified(false);
      setShowOtpField(false);
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };



  return (

    <>
      <div>


        <div className="position-relative">
          <PhoneInput
            name="mobile"
            placeholder='Enter Phone Number'
            disabled={onVerified}
            country={'in'}
            value={formData.mobile || ''}
            onChange={(value, data) => handleChange(null, value, data.countryCode, true)}
            inputProps={{ name: 'mobile' }}
            className="w-100"
          />
          {onVerified && (
            <GoVerified
              className="position-absolute"
              style={{ right: 10, top: "50%", transform: "translateY(-50%)", color: "green" }}
            />
          )}
        </div>




      </div>
      {verified && (
        <div className='d-flex justify-content-end'>
          <Button variant="outline-secondary" size='sm' className="mb-3" onClick={handleSendOTP} disabled={isDisabled}>
            {isOtpSent ? `Resend OTP  (${timer}s)` : 'Send OTP'}
          </Button>
        </div>

      )}


      {showOtpField && ( // Conditional rendering of OTP input
        <div>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              aria-label="Enter OTP"
            />
            <Button
              variant="outline-primary"
              id="button-addon2"
              onClick={handleVerifyOTP}
            >
              Verify OTP
            </Button>
          </InputGroup>
        </div>

      )}

      <div id="recaptcha-container"></div>
    </>


  )
}

export default MobileVerification