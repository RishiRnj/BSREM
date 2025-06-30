import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Form, Button, Container, Spinner, Modal, InputGroup, Card } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { GoVerified, } from "react-icons/go";

import MobileVerification from './LogIn/MobileVerification';
import UsernameInput from '../Components/Common/UsernameInput ';
import { handleSuccess } from "../Components/Util";



const AuthProxy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    username: "",
    mobile: "",
    religion: ""
  });

  const [showModal, setShowModal] = useState(false);  // State to control modal visibility
    const [onVerified, setOnVerified] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get("token");
    
    if (!token) {
      console.warn("No token in URL. Checking session storage...");
      token = localStorage.getItem("token");
    }

    if (token) {
      try {
        const decodedUser = jwtDecode(token); // Decode token
        localStorage.setItem("token", token); // Ensure token is stored
        localStorage.setItem("user", JSON.stringify(decodedUser));

        console.log("Token stored successfully:", token);
        console.log("Decoded user:", decodedUser);

        setToken(token);
        setUser(decodedUser);
        setProfileData({
          username: decodedUser.username || "",
          mobile: decodedUser.mobile || "",
          religion: decodedUser.religion || ""
        });

        // Redirect to the intended page or fallback to a default (forum) but in not worked shows error          
        // navigate("/forum"); // Redirect to forum (works)
        // Redirect user to previous page or fallback to "/forum"
        // const redirectPath = localStorage.getItem("redirectAfterLogin") || "/user/profile";
        
        // navigate(redirectPath);
        // // localStorage.removeItem("redirectAfterLogin"); // Clear after use

        // If profile is complete, redirect immediately
        if (decodedUser.username && decodedUser.mobile && decodedUser.religion) {
          const redirectPath = localStorage.getItem("redirectAfterLogin") || "/user/profile";
          navigate(redirectPath);
        } else {
          setLoading(false); // Show profile form
        }
       

        
      } catch (error) {
        console.error("Invalid token:", error);
        alert("Authentication failed. Redirecting to login.");
        navigate("/"); // Redirect to login on error
      }
    } else {
      console.error("No token found in URL or session storage.");
      alert("Authentication failed. Redirecting to login.");
      navigate("/"); // Redirect to login
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };


 const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submitting profile data:", profileData);

  try {
    setLoading(true);

    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 400 && result.message?.toLowerCase().includes("mobile")) {
        alert("Mobile number already exists. Please enter a different number.");
        setProfileData(prev => ({ ...prev, mobile: "" }));
        setProfileData(prev => ({ ...prev, username: "" }));
        setOnVerified(false); // Reset verification state
      } else {
        alert(result.message || "Something went wrong.");
      }
      return;
    }

    // Success
    localStorage.setItem("user", JSON.stringify(result));
    handleSuccess(result.message || "Pertial Profile update successfull.");
    const redirectPath = localStorage.getItem("redirectAfterLogin") || "/user/profile";
    navigate(redirectPath);
  } catch (error) {
    console.error("Profile update failed:", error);
    alert("An error occurred. Please try again.");
  } finally {
    setLoading(false);
  }
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
    setProfileData((prevData) => ({ ...prevData, mobile: phoneNumber }));
    setOnVerified(true);
    handleCloseModal();  // Close modal after phone verification
  };





  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status" />
        <span className="ms-3">Authenticating...</span>
      </Container>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: `calc(100vh - 65px)`
    }}>

      <Container className="p-3" style={{ maxWidth: 600 }}>
      <h3 className="text-center mb-5">Input mendatory Profile Date</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username" className="mb-2">

              <UsernameInput
                value={profileData?.username || ''}
                onChange={handleChange}
                disabled={profileData.username }

              />
            </Form.Group>


         {profileData?.mobile ? (
              // If mobile exists, render the Mobile number with Verification mark

              <InputGroup className="mb-2">
                <div className="d-flex align-items-center w-100">
                  <InputGroup.Text>Mobile</InputGroup.Text>
                  <PhoneInput
                    name="mobile"
                    placeholder='Enter Phone Number'
                    disabled={onVerified}
                    country={'in'}
                    value={profileData.mobile || ''}
                    inputProps={{ name: 'mobile' }}
                    inputStyle={{ width: '100%', borderRadius: '5px' }}
                  />
                  {(onVerified) && (
                    <GoVerified
                      className="position-absolute"
                      style={{
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "green",
                      }}
                    />
                  )} </div>
              </InputGroup>




            ) : (

              <InputGroup className="mb-2" onClick={handleInputFocus}>
                <div className="d-flex align-items-center w-100">
                  <InputGroup.Text>Mobile</InputGroup.Text>
                  {/* <Form.Group controlId="mobile" className="mb-2" onClick={handleInputFocus}>
                <Form.Label>Mobile</Form.Label> */}

                  <PhoneInput
                    name="mobile"
                    placeholder='Enter Phone Number'
                    disabled={onVerified}
                    country={'in'}
                    value={profileData.mobile  || ''}
                    inputProps={{ name: 'mobile' }}
                    inputStyle={{ width: '100%', borderRadius: '5px' }}
                  /></div>
              </InputGroup>
            )}

            <InputGroup className="mb-2 align-items-center">

              <InputGroup.Text style={{ fontWeight: "bold" }}>Religion</InputGroup.Text>
              <Form.Control
                as="select"
                name="religion"
                placeholder="Enter your email"
                required
                value={profileData.religion}
                onChange={handleChange}
              >


                <option value="">Select Religion</option>
                <option value="Hinduism">Hinduism</option>
                <option value="Jainism">Jainism</option>
                <option value="Sikhism">Sikhism</option>
                <option value="Buddhism">Buddhism</option>
                <option value="Christianity">Christianity</option>
                <option value="Islam">Islam</option>
              </Form.Control>

            </InputGroup>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </Form>
    </Container>

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
    </div>
  );
};

export default AuthProxy;

