import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Col, Form, FormControl, FormGroup, OverlayTrigger, Tooltip, Row, Spinner, Button, InputGroup, Modal } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError, handleWarning } from '../../Components/Util';
import "./JoinUs.css"; // Include your custom styles here
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { BsPencilSquare } from "react-icons/bs";
import AuthContext from "../../Context/AuthContext";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { FaEyeSlash, FaEye, FaCamera } from "react-icons/fa";




const JoinUs = () => {
  const { user } = useContext(AuthContext);
  const currentUser = user;
  const isAuthenticated = !!user;
  const userId = user?.id;
  const [selectedImage, setSelectedImage] = useState(null); // State for preview image
  const placeholderImage = "/user.png";
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [formError, setFormError] = useState({});
  const [alertShown, setAlertShown] = useState(false); // Track if the alert has been shown
  const [showUpdateField, setShowUpdateField] = useState(false); // Control visibility of the update field
  const [userData, setUserData] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const cropperRef = useRef(null); // Use `useRef` for the Cropper instance

  const [isEditable, setIsEditable] = useState(false);
  const [showMobInput, setShowMobInput] = useState(false);
  const [dobPicker, setDobPicker] = useState(false); // Store the date of birth value
  const [nm, setNM] = useState(false); // Store the date of birth value
  const [sex, setSex] = useState(false); // Store the date of birth value
  const [bgOco, setBgOco] = useState(false); // Store the date of birth value
  const [mail, setMail] = useState(false); // Store the Email value
  const [isModalOpen, setIsModalOpen] = useState(false); // Track if modal is open
  const [showPassword, setShowPassword] = useState(false);
  const [uwNM, setUwNM] = useState(false);




  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    updateFullName: "",    
    fathersName: "",
    maritalStatus: "",
    spouseName: "",
    partnerName: "",
    haveAnyChild: "",    
    numberOfChildren: "",
    mobile: "",
    dob: "",
    age: "",
    gender: "",    
    bloodGroup: "",
    occupation: "",
    moreAboutOccupation: "",
    address: '',
    origin: '',
    city: '',
    district: '',
    state: '',
    PIN: '',
    country: '',
    joiningFor: "",
    qualification: "",
    giveAterJoin: "",
    userImage: "",
    agreedTerms: false,
  });

  useEffect(() => {
    CheckUserProfileBeforeProcced();

  }, []);

  const CheckUserProfileBeforeProcced = async () => {
    try {
      setLoading(true); // Optional loading state for better UX

      // Step 1: Check if the user's profile is updated
      const isProfileUpdated = await checkUserProfile(); // Ensure `checkUserProfile` is async

      if (isProfileUpdated) {
        const userResponse = window.confirm(
          "Your profile is Completed. Do you want to Update your profile? Press Cencel to stay here and update your profile or Ok to Procced Next."
        );

        if (userResponse) {
          navigateToProfileUpdate();
        }
        return; // Stop further execution if the profile isn't updated
      }


    } catch (error) {
      console.error("Error checking user profile or follow status:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  //navigate for Update profile
  const navigateToProfileUpdate = () => {
    // Use React Router for navigation
    if (userId) throw new Error("Missing user authentication details.");
    navigate('/joinUs/volunteer', {
      state: { from: window.location.pathname },
    });

  };


  //check user Profile
  const checkUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      // Decode the token (DO NOT VERIFY IN FRONTEND)
      const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      console.log("Decoded Token:", decoded);

      const email = decoded?.id || "No email found";
      console.log("User Email:", email);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/joinUs/volunteer/profile`, {
        method: "GET",
        credentials: "include", // Necessary for cookies/session handling
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();

        console.log("res", userData);
        localStorage.setItem("volunteer", JSON.stringify(userData.user));


        return userData.isProfileCompleted; // Return the profile status
      } else {
        throw new Error("Failed to fetch user profile.");
      }
    } catch (error) {
      console.error("Error in checkUserProfile:", error);
      navigate("/joinUs"); // Redirect to a fallback route if needed
      return false; // Default to false if there's an error
    }
  };


  const location = useLocation();
  const navigate = useNavigate();
  // Get the referring page from state

  const from = location.state?.from; // Fallback to a default page  

  // Check authentication status and fetch user data
  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
            credentials: 'include', // Important for cookies or sessions
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache',
            },
          });
          if (response.ok) {
            const data = await response.json();

            setUserData(data);  // Set the fetched user data
            setFormData({

              email: data?.email || '',
              fathersName: data?.fathersName || '',
              username: data?.updateFullName || '',
              mobile: data?.mobile || '',
              dob: data?.dob || '',
              age: data?.age || '',
              gender: data?.gender || '',
              bloodGroup: data?.bloodGroup || '',
              occupation: data?.occupation || '',
              userImage: data?.userImage, // Set user image from userData to formData
            });

          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data", error);
        } finally {
          setLoading(false)
        }
      };

      fetchUserData();
    }
  }, [isAuthenticated, userId]);


  const handleNameClick = () => {
    if (currentUser?.id && !isEditable) {
      handleSuccess("Now You can Update Name")
      setNM(true); // Allow editing only if there's a currentUser and the field is not already editable
    }
  };

  const handleMobileClick = () => {
    if (currentUser?.id && !isEditable) {
      handleSuccess("Update your Mobile with Country Code ie. +91")
      setShowMobInput(true); // Allow editing only if there's a currentUser and the field is not already editable


    }
  };

  const handleDobClick = () => {
    if (currentUser?.id && !isEditable) {
      handleSuccess("Update your Date of Birth");
      setDobPicker(true);
    }
  };

  const handleSexClick = () => {
    if (currentUser?.id && !isEditable) {
      handleSuccess("Update your Gender");
      setSex(true);
    }
  };

  const handleBgOcoClick = () => {
    if (currentUser?.id && !isEditable) {
      handleSuccess("Update your Blood Gr. and Occupation");
      setBgOco(true);
    }
  };

  // drop down option as select
  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value); // Update the selected option state
    setFormData((prev) => ({
      ...prev,
      origin: value, // Update the formSelect field in formData
    }));
  };

  // calculate Age (current date - dob)
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  //mobile number validation
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

  //any type of change in form
  const handleChange = (e, value = null, countryCode = null, isPhoneInput = false) => {
    if (isPhoneInput) {
      const isValid = validatePhoneNumber(value, countryCode); // Validate using dynamic country code
      if (isValid) {

        console.log('Phone number is valid:', value);
        setFormData((prevData) => ({ ...prevData, mobile: value }));
        setFormError((prevError) => ({ ...prevError, mobile: '' })); // Clear error
      } else {
        console.error('Invalid phone number:', value);
        setFormError((prevError) => ({ ...prevError, mobile: 'Invalid phone number' })); // Set error
      }
    } else if (e) {
      const { name, value, type, checked } = e.target;
      if (type === "checkbox") {
        setFormData((prevData) => ({ ...prevData, [name]: checked }));
      } else if (name === "dob") {
        setFormData((prevData) => ({ ...prevData, dob: value, age: calculateAge(value) }));

      } else {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
    }
  };

  // Handle image change (when a new image is selected)
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a URL for previewing the image
      setSelectedImage(imageUrl); // Update the image preview
      setCroppedImage(null); // Reset the cropped image
      setFormData({ ...formData, userImage: file }); // Store the file in formData for submission
      setIsModalOpen(true); // Open the modal for cropping
    } else {
      handleWarning("No image selected.");
    }
  };

  const handleCrop = () => {
    const cropperInstance = cropperRef.current?.cropper; // Access Cropper instance
    if (cropperInstance) {
      const croppedData = cropperInstance.getCroppedCanvas({
        width: 400,
        height: 400,
      }).toDataURL(); // Get cropped image
      setCroppedImage(croppedData); // Save cropped image
      setNewImage(croppedData)
      setSelectedImage(null); // Close the cropper

    } else {
      console.error("Cropper instance is not available.");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, userImage, username, gender, mobile } = formData;

    if (!userImage) {
      handleWarning("Please upload a profile image before submitting.");
      return;
    }

    if (!email) {
      return handleError("Email address field is mandatory.");
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return handleWarning("Please enter a valid email address.");
    }

    if (!username) {
      return handleWarning("Full Name Update is mandatory! even if Update Re-enter !");
    }

    if (!currentUser?.id) {
      if (password.length < 6) {
        return handleWarning("Password must be at least 6 characters long.");
      } else if (!/[A-Z]/.test(password)) {
        return handleWarning("Password At least one uppercase letter.");
      } else if (!/[a-z]/.test(password)) {
        return handleWarning("Password At least one lowercase letter.");
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return handleWarning("Password At least one special character.");
      } else if (!password) {
        return handleWarning("Password is mandatory!");
      }
    }

    if (mobile === "") {
      handleWarning("Please enter your Mobile No.");
      return;
    }

    if (formData.gender === "") {
      handleWarning("Please select Gender.");
      return;
    }

    if (formData.qualification === "") {
      handleWarning("Please select Qualification.");
      return;
    }
    if (formData.giveAterJoin === "") {
      handleWarning("Please select What will you give after joining?");
      return;
    }

    setLoading(true)

    try {
      const formDataToSend = new FormData();

      // Add JSON data as a string
      formDataToSend.append("formData", JSON.stringify(formData));

      // Append cropped image as Blob
      if (croppedImage) {
        const blob = await fetch(croppedImage).then((res) => res.blob());
        formDataToSend.append("userUpload", blob, "croppedImage.png");
      }

      console.log("sending data", formDataToSend);


      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/joinUs`, {
        method: "POST",
        body: formDataToSend, // FormData handles headers automatically
      });

      // if (response.ok) {
      //   const data = await response.json();
      //   console.log("Server Response:", data);
      //   handleSuccess("Profile update successful!");
      //   navigate('/joinUs/volunteer');

      // }
      if (response.ok) {
        const data = await response.json();
        console.log("Server Response:", data);

        // Store token in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("volunteer", JSON.stringify(data.joinData));

        // Automatically set user session (if using Redux, update state)


        handleSuccess("Profile update successful!");
        navigate('/joinUs/volunteer');
      }

      else {
        const errorData = await response.json();
        handleError(`Update failed: ${errorData.message || "Please try again."}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      handleError(`Failed to update profile: ${error.message}`);
    } finally {
      setLoading(false)
    }
  };


  console.log("formData in join ->", formData);


  //date format
  const formatDate = (dob) => {
    if (!dob) return '';

    const date = new Date(dob);

    // Get day with ordinal suffix
    const day = date.getDate();
    const ordinalSuffix = (n) => {
      const suffix = ['th', 'st', 'nd', 'rd'];
      const value = n % 100;
      return suffix[(value - 20) % 10] || suffix[value] || suffix[0];
    };

    const dayWithSuffix = `${day}${ordinalSuffix(day)}`;

    // Get month name (abbreviated)
    const month = date.toLocaleString('default', { month: 'short' });

    // Get full year
    const year = date.getFullYear();

    return `${dayWithSuffix} ${month} ${year}`;
  };

  //fornmated DOB
  const formatedDob = formatDate(userData?.dob);
  // Image preview (will show selectedImage or userData?.userImage or placeholder)
  const imagePreview = croppedImage ? croppedImage : selectedImage ? selectedImage : userData?.userImage ? userData.userImage : placeholderImage ? placeholderImage : "";


  if (loading) {
    return (
      <div className="loading-container"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1050,
        }}
      >
        <Spinner animation="border" role="status" >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }


  return (
    <div className="form-container-join">
      <h3 id="txto" title="to serve our Community" className="text-center mt-2 mb-4">Join Us</h3>

      <Card className="shadow-sm profile-card-join">
        <Card.Body>
          <form onSubmit={handleSubmit}>           
            {/* Profile Image */}
            <div className="d-flex justify-content-center align-items-center">
              <div className="image-upload-container">
                {/* Image Preview / Placeholder */}
                <div
                  onClick={() => document.getElementById("imageInput").click()} // Trigger file input click
                  style={{
                    cursor: "pointer", width: "120px", height: "120px", borderRadius: "50%", border: "1px dashed gray", display: "flex", alignItems: "center", justifyContent: "center", backgroundSize: "cover",
                    backgroundPosition: "center", backgroundImage: `url(${imagePreview})`
                  }}
                >
                  {/* Select Image Button */}
                  <>
                    <FaCamera
                      size={24}
                      color="LightGray"
                      style={{
                        position: "relative",
                        top: "42%",
                        left: "55%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  </>

                </div>

                {/* Hidden File Input */}
                <input
                  id="imageInput" type="file" name="userImage" accept="image/*" style={{ display: "none" }} onChange={handleImageChange}
                />
              </div>

              {/* Modal for Cropping */}
              {selectedImage && isModalOpen && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                  }}
                >
                  <div
                    className="join-crop"
                    style={{
                      backgroundColor: "#fff",
                      padding: "20px",
                      borderRadius: "8px",
                      width: "90%",
                      maxWidth: "400px",
                      textAlign: "center",
                    }}
                  >
                    <h5>Crop Image</h5>
                    <Cropper
                      className="join-crop"
                      src={selectedImage}
                      style={{ width: "100%", height: "auto" }}
                      initialAspectRatio={1}
                      aspectRatio={1}
                      guides={false}
                      background={true}
                      rotatable={true}
                      dragMode="move" // Allows moving the image
                      ref={cropperRef}
                    />
                    <div style={{ marginTop: "10px" }}>
                      <button
                        onClick={handleCrop}
                        style={{
                          marginRight: "10px",
                          backgroundColor: "#007bff",
                          color: "#fff",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        style={{
                          backgroundColor: "gray",
                          color: "#fff",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>


            {/* Email */}
            {currentUser?.id && !mail && (
              <div className="mb-3">
                <FormGroup>
                  <Form.Label>Email id of Voluntear</Form.Label>
                  <div className="d-flex align-items-center border border-primary rounded">
                    <FormControl
                      name="mmmail"
                      id="mmmail"
                      value={userData?.email || ""} // Display both dob and age with a separator
                      readOnly
                      aria-describedby="basic-verify"
                      style={{ flex: 1 }}
                    />
                  </div>
                </FormGroup>
              </div>
            )}

            {(mail || !currentUser?.id) && (
              <div className="mb-3">
                <FormGroup>
                  <Form.Label>Email id of Voluntear</Form.Label>
                  <div className="d-flex align-items-center border border-primary rounded">
                    <FormControl title={"Enter your Email Id"} placeholder="Enter your email its mandatory" type="email" name="email" autoFocus value={formData.email || ""} required onChange={handleChange} />
                  </div>
                </FormGroup>
              </div>

            )}

            {/* password for new user*/}
            {(!currentUser?.id) && (
              <Form.Group controlId="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <div className="d-flex align-items-center border border-primary rounded">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Enter your password its mandatory"
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

            )}


            {/* Full Name */}
            {currentUser?.id && !nm && (
              <div className="mb-3">
                <FormGroup>
                  <Form.Label>Full Name of Voluntear</Form.Label>
                  <div className="d-flex align-items-center border border-primary rounded">
                    <FormControl
                      name="nm"
                      id="nm"
                      value={userData?.updateFullName || userData?.username || userData?.displayName || ""} // Display both dob and age with a separator                      
                      readOnly
                      aria-describedby="basic-verify"
                      style={{ flex: 1 }}
                    />

                    <button
                      type="button" // Prevent form submission
                      variant="outline-primary"
                      title="Update Full Name"
                      id="basic-verify"
                      onClick={handleNameClick}
                      className="basic-verify"
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'blue',
                        cursor: 'pointer',
                        padding: '0px 10px',
                      }}
                    >
                      <BsPencilSquare />
                    </button>
                  </div>
                </FormGroup>
              </div>
            )}

            {(nm || !currentUser?.id) && (
              <div className="mb-3">
                <Form.Group className="mb-2">
                  <Form.Label>Full Name of Voluntear</Form.Label>
                  <div className="d-flex align-items-center border border-primary rounded">
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Enter your Full Name its mandatory"
                      required
                      value={formData.username || ""}
                      onChange={handleChange}
                      style={{ flex: 1 }}
                    />
                  </div>
                </Form.Group>
              </div>
            )}

            {/* father's name */}
              <div className="mb-3">
                <Form.Group className="mb-2">
                  <Form.Label>Father's Name</Form.Label>
                  <div className="d-flex align-items-center border border-primary rounded">
                    <Form.Control
                      type="text"
                      name="fathersName"
                      placeholder="Enter your father's Name its mandatory"
                      required
                      value={formData.fathersName || ""}
                      onChange={handleChange}
                      style={{ flex: 1 }}
                    />
                  </div>
                </Form.Group>
              </div>       


            {/* MObile */}        
            {/* For users without an ID (Fresh User) */}
            {!currentUser?.id && (
              <div className="mb-3">
                <FormGroup>
                  <Form.Label>Mobile Number</Form.Label>
                  <div
                    className="d-flex align-items-center border border-primary rounded"
                    title="Enter your Mobile, it's mandatory"
                  >
                    <PhoneInput
                      name="mobile"
                      country="in" // Default country is India
                      value={formData.mobile || ''} // Controlled component for phone number
                      onChange={(value, data) => handleChange(null, value, data.countryCode, true)} // Pass value and country code
                      inputProps={{
                        name: 'mobile',
                        required: true,
                      }}
                      style={{ flex: 1 }}
                    />
                  </div>
                  {formError.mobile && <div className="text-danger">{formError.mobile}</div>}
                </FormGroup>
              </div>
            )}

            {/* For users with ID and mobile data */}
            {currentUser?.id && userData?.mobile && !showMobInput && (
              <div className="mb-3">
                <FormGroup>
                  <Form.Label>Mobile Number</Form.Label>
                  <div
                    className="d-flex align-items-center border border-primary rounded"
                    title="Click this Button to Update"
                  >
                    <FormControl
                      name="mobile"
                      value={`+${userData?.mobile}` || ''} // Ensure controlled component
                      readOnly
                      aria-describedby="basic-verify"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      variant="outline-primary"
                      title="Edit Mobile Number"
                      id="basic-verify"
                      onClick={handleMobileClick}
                      className="basic-verify"
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'blue',
                        cursor: 'pointer',
                        padding: '0px 10px',
                      }}
                    >
                      <BsPencilSquare />
                    </button>
                  </div>
                </FormGroup>
              </div>
            )}

            {/* For users with ID but no mobile data */}
            {(showMobInput || (currentUser?.id && !userData?.mobile)) && (
              <div className="mb-3">
                <FormGroup>
                  <Form.Label>Mobile Number</Form.Label>
                  <div
                    className="d-flex align-items-center border border-primary rounded"
                    title="Enter your Mobile, it's mandatory"
                  >
                    <PhoneInput
                      name="mobile"
                      country="in" // Default country is India
                      value={formData.mobile || ''} // Controlled component for phone number
                      onChange={(value, data) => handleChange(null, value, data.countryCode, true)} // Pass value and country code
                      inputProps={{
                        name: 'mobile',
                        required: true,
                      }}
                      style={{ flex: 1 }}
                    />
                  </div>
                  {formError.mobile && <div className="text-danger">{formError.mobile}</div>}
                </FormGroup>
              </div>
            )}





            {/* dob and age*/}
            {/* current user who have data  */}
            {currentUser?.id && !dobPicker && formatedDob && (
              <div className="mb-3">
                <FormGroup>
                  <Form.Label>Date of Birth & Age of the Voluntear</Form.Label>
                  <div className="d-flex align-items-center border border-primary rounded" title="Click this Button to Update">
                    <Row>
                      <Col>
                        <FormControl
                          name="dtPick"
                          id="dtPick"
                          value={formatedDob || ''} // Display both dob and age with a separator 
                          readOnly
                          style={{ flex: 1 }}
                        />
                      </Col>
                      <Col>

                        <FormControl
                          name="uAg"
                          id="uAg"
                          value={userData?.age || ''} // Display both dob and age with a separator
                          readOnly
                          style={{ flex: 1 }}
                        />
                      </Col>
                    </Row>


                    <button
                      type="button" // Prevent form submission
                      variant="outline-primary"
                      title="Edit Mobile Number"
                      id="basic-verify"
                      onClick={handleDobClick}
                      className="basic-verify"
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'blue',
                        cursor: 'pointer',
                        padding: '0px 10px',
                      }}
                    >
                      <BsPencilSquare />
                    </button>
                  </div>
                </FormGroup>
              </div>
            )}

            {/* current user but  who have no data */}
            {(dobPicker || ( currentUser?.id && !formatedDob)) && (
              <div className="mb-3">
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control title="Select your DOB its mandatory" type="date" name="dob" value={formData.dob || ''} onChange={handleChange}
                        required />
                    </Form.Group>
                  </Col>

                  {/* Age */}
                  <Col>
                    <Form.Group>
                      <Form.Label>Age</Form.Label>
                      <Form.Control type="number" name="age" value={formData.age || ''} readOnly />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            )} 

            {/* no current user */}
            {(!currentUser?.id) && (
              <div className="mb-3">
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control title="Select your DOB its mandatory" type="date" name="dob" value={formData.dob || ''} onChange={handleChange}
                        required />
                    </Form.Group>
                  </Col>

                  {/* Age */}
                  <Col>
                    <Form.Group>
                      <Form.Label>Age</Form.Label>
                      <Form.Control type="number" name="age" value={formData.age || ''} readOnly />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            )}
            {/* dob */}



            {/* Gender */}
            {currentUser?.id && !sex && userData?.gender && (
              <div className="mb-3">
                <FormGroup>
                  <Form.Label>Gender</Form.Label>
                  <div className="d-flex align-items-center border border-primary rounded">
                    <FormControl
                      name="sex"
                      id="sex"
                      value={userData?.gender || ''} // Display both dob and age with a separator
                      readOnly
                      aria-describedby="basic-verify"
                      style={{ flex: 1 }}
                    />

                    <button
                      type="button" // Prevent form submission
                      variant="outline-primary"
                      title="Edit Gender"
                      id="basic-verify"
                      onClick={handleSexClick}
                      className="basic-verify"
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'blue',
                        cursor: 'pointer',
                        padding: '0px 10px',
                      }}
                    >
                      <BsPencilSquare />
                    </button>
                  </div>
                </FormGroup>
              </div>

            )}

            {(sex || (currentUser?.id && !userData?.gender)) && (
              <div className="mb-3">
                <label id='gen'>Gender of Voluntear</label>
                <div className="radio-group" title="Select Gender its mandatory">
                  <label> <input type="radio" name="gender" value="Male" onChange={handleChange} /> Male</label>
                  <label> <input type="radio" name="gender" value="Female" onChange={handleChange} />Female</label>
                  <label> <input type="radio" name="gender" value="Other" onChange={handleChange} />Other</label>
                </div>
              </div>

            )}
            {(!currentUser?.id) && (
              <div className="mb-3">
                <label id='gen'>Gender of Voluntear</label>
                <div className="radio-group" title="Select Gender its mandatory">
                  <label> <input type="radio" name="gender" value="Male" onChange={handleChange} /> Male</label>
                  <label> <input type="radio" name="gender" value="Female" onChange={handleChange} />Female</label>
                  <label> <input type="radio" name="gender" value="Other" onChange={handleChange} />Other</label>
                </div>
              </div>

            )}
            {/* Gender */}


            {/* Blood Group // Ocopation */}
            {currentUser?.id && !bgOco && userData?.bloodGroup && userData?.occupation && (
              <div className="mb-3">
                <FormGroup>
                  <Form.Label>Blood Group & Occupation</Form.Label>
                  <div className="d-flex align-items-center border border-primary rounded">
                    <Row>
                      <Col>
                        <FormControl
                          name="bgOco"
                          id="bgOco"
                          value={userData?.bloodGroup || ''} // Display both dob and age with a separator 
                          readOnly
                          style={{ flex: 1 }}
                        />
                      </Col>
                      <Col>

                        <FormControl
                          name="uAg"
                          id="uAg"
                          value={userData?.occupation || ''} // Display both dob and age with a separator
                          readOnly
                          style={{ flex: 1 }}
                        />
                      </Col>
                    </Row>


                    <button
                      type="button" // Prevent form submission
                      variant="outline-primary"
                      title="Edit Mobile Number"
                      id="basic-verify"
                      onClick={handleBgOcoClick}
                      className="basic-verify"
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'blue',
                        cursor: 'pointer',
                        padding: '0px 10px',
                      }}
                    >
                      <BsPencilSquare />
                    </button>
                  </div>
                </FormGroup>
              </div>
            )}

            {(bgOco || (currentUser?.id && !userData?.bloodGroup && !userData?.occupation)) && (
              <div className="mb-3">
                <Row>
                  {/* Blood Group */}
                  <Col>
                    <div className="form-group">
                      <label className="mb-2">Blood Group</label>
                      <select
                        className="form-select"
                        name="bloodGroup"
                        value={formData.bloodGroup || ''}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </Col>

                  {/* Occupation */}
                  <Col >
                    <div className="form-group">
                      <label className="mb-2">Occupation</label>
                      <select
                        className="form-select"
                        name="occupation"
                        value={formData.occupation || ''}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="Student">Student</option>
                        <option value="Professional">Professional</option>
                        <option value="GovernmentJob">Government Job</option>
                        <option value="PrivateJob">Private Job</option>
                        <option value="Business">Business</option>
                        <option value="SmallBusiness">Small Business</option>
                        <option value="Artist">Artist</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </Col>
                </Row>
              </div>
            )}

            {(!currentUser?.id) && (
              <div className="mb-3">
                <Row>
                  {/* Blood Group */}
                  <Col>
                    <div className="form-group">
                      <label className="mb-2">Blood Group</label>
                      <select
                        className="form-select"
                        name="bloodGroup"
                        value={formData.bloodGroup || ''}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </Col>

                  {/* Occupation */}
                  <Col >
                    <div className="form-group">
                      <label className="mb-2">Occupation</label>
                      <select
                        className="form-select"
                        name="occupation"
                        value={formData.occupation || ''}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="Student">Student</option>
                        <option value="Professional">Professional</option>
                        <option value="GovernmentJob">Government Job</option>
                        <option value="PrivateJob">Private Job</option>
                        <option value="Business">Business</option>
                        <option value="SmallBusiness">Small Business</option>
                        <option value="Artist">Artist</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
            {/* Blood Group // Ocopation */}

            {/* Conditional Rendering */}
            {["Other", "Professional", "GovernmentJob", "Business", "Artist"].includes(formData.occupation) && (
              <div className="mb-3">
                <label className="mb-2">
                More About Your Occupation {formData.occupation && `(${formData.occupation})`}

                </label>
                <textarea
                  className="form-control" name="moreAboutOccupation" value={formData.moreAboutOccupation} onChange={handleChange} rows="1" placeholder={`Tell us about your occupation (${formData.occupation})...`} required={formData.occupation === "Other" || "Professional" || "GovernmentJob" || "Business" || "Artist"} />
              </div>
            )}

            {/* marital status */}
            <div className="mb-3">
              <div className="form-group">
                <label className="mb-2">Marital Status</label>
                <select
                  className="form-select"
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Living common law">Living common law</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                  <option value="Divorced">Divorced</option>                  
                </select>
              </div>
            </div>

            {/* Conditional Rendering for Married */}
            {["Married"].includes(formData.maritalStatus) && (
              <div className="mb-3">
                <label className="mb-2">
                Your Spouse name:

                </label>
                <textarea
                  className="form-control" name="spouseName" value={formData.spouseName} onChange={handleChange} rows="1" placeholder={"Your Spouse Name"} required={formData.maritalStatus === "Married"} />
              </div>
            )}

            {/* Conditional Rendering for Living common law */}
            {["Living common law"].includes(formData.maritalStatus) && (
              <div className="mb-3">
                <label className="mb-2">
                Your Partner name:

                </label>
                <textarea
                  className="form-control" name="partnerName" value={formData.partnerName} onChange={handleChange} rows="1" placeholder={"Your Partner Name"} required={formData.maritalStatus === "Living common law"} />
              </div>
            )}


            {/* Conditional Rendering for looking for children */}
            {["Married", "Widowed", "Separated", "Divorced"].includes(formData.maritalStatus) && (
              <div className="mb-3">
                <label id="gen" className="mb-2">
                  Do you have any children?
                </label>
                <div className="radio-group" title="Have any children?">
                  <label>
                    <input
                      required={["Married", "Widowed", "Separated", "Divorced"].includes(formData.maritalStatus)}
                      type="radio"
                      name="haveAnyChild"
                      value="yes"
                      checked={formData.haveAnyChild === "yes"}
                      onChange={handleChange}
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      required={["Married", "Widowed", "Separated", "Divorced"].includes(formData.maritalStatus)}
                      type="radio"
                      name="haveAnyChild"
                      value="no"
                      checked={formData.haveAnyChild === "no"}
                      onChange={handleChange}
                    />{" "}
                    No
                  </label>
                </div>
              </div>
            )}

            {/* Conditional Rendering for number of children */}
            {formData.haveAnyChild === "yes" && (formData.maritalStatus == "Married" || "Widowed" || "Separated"  || "Divorced") && (
              <div className="mb-3">
                <label className="mb-2">How many children do you have?</label>
                <textarea
                  className="form-control"
                  name="numberOfChildren"
                  value={formData.numberOfChildren || ""}
                  onChange={handleChange}
                  rows="1"
                  disabled={formData.maritalStatus === "Single"}
                  placeholder="Enter the number of children"
                  required={["Married", "Widowed", "Separated", "Divorced"].includes(formData.maritalStatus)}
                />
              </div>
            )}

            {/* joining for  */}
            <div className="mb-3">
              <div className="form-group">
                <label className="mb-2">What do you want to do, by Joining Us?</label>
                <select
                  className="form-select"
                  name="joiningFor"
                  value={formData.joiningFor}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="Uniting Hindus">Uniting Hindus</option>
                  <option value="Strengthening the Hindu community">Strengthening the Hindu community</option>
                  <option value="To make Hindu society aware">To make Hindu society aware</option>
                  <option value="Working towards creating a Hindu Rashtra">Working towards creating a Hindu Rashtra</option>
                  <option value="TechnolTechnologically uplifting Hindu youthogy">Technologically uplifting Hindu Youth</option>
                  <option value="Environmental protection">Environmental Protection</option>
                  <option value="Entry of common people into politics">Entry of Common People into Politics</option>
                  <option value="Corruption-free Nation">Corruption-Free Nation</option>
                  <option value="Improved education system for society">Improved Education system for Society</option>
                  <option value="Better health care for society">Better Health Care for society</option>
                </select>
              </div>

            </div>

            {/* Qualification and Give after Participating */}
            <div className="mb-3">
              <Row>
                {/* Qualification*/}
                <Col>
                  <div className="form-group">
                    <label className="mb-2">Qualification</label>
                    <select
                      className="form-select"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="10th">10th</option>
                      <option value="12th">12th</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Honors Graduate">Honors Graduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                      <option value="PhD scholar">PhD scholar</option>
                      <option value="MD">MD</option>
                      <option value="MBBS">MBBS</option>
                    </select>
                  </div>
                </Col>

                {/* Give after Participating */}
                <Col >
                  <div className="form-group">
                    <label className="mb-2">Give after Joining?</label>
                    <select
                      className="form-select"
                      name="giveAterJoin"
                      value={formData.giveAterJoin}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="Time">Time</option>
                      <option value="Knowledge">Knowledge</option>
                      <option value="Source">Source</option>

                    </select>
                  </div>
                </Col>
              </Row>
            </div>


            {/* Address */}
            <Form.Group className="mb-3" >
              <Form.Label>Residential status</Form.Label>
              <Form.Select
                name='origin'
                aria-label="Default select example"
                required
                onChange={handleSelectChange}
                value={selectedOption}>
                <option value="">Choose any one...</option>
                <option value="Indain_Hindu">Hindus Living in India</option>
                <option value="Gobal_Hindu">Hindus Living Outside India</option>
              </Form.Select>
            </Form.Group>


            {/* Additional form logic */}
            {selectedOption === 'Indain_Hindu' && (
              <div id="addressIn">
                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Enter your Address, like- Village, Area</Tooltip>}>
                  <Form.Group className="mb-3" >
                    <Form.Label>Your Current Address</Form.Label>
                    <Form.Control
                      name='address'
                      placeholder="House No, St. No, Locality"
                      value={formData.address}
                      onChange={handleChange}
                      required />
                  </Form.Group></OverlayTrigger>

                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Enter your City and District</Tooltip>}>
                  <Row className="mb-3">

                    <Form.Group as={Col} >
                      <Form.Label>City</Form.Label>
                      <Form.Control name='city'
                        placeholder='Enter City' value={formData.city} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group as={Col} >
                      <Form.Label>District</Form.Label>
                      <Form.Control name='district' placeholder='District' value={formData.district} required={selectedOption === "Indain_Hindu"} // Required for Indian Hindus
                        onChange={handleChange} />
                    </Form.Group>
                  </Row>
                </OverlayTrigger>



                <Row className="mb-3">
                  <Form.Group as={Col} >
                    <Form.Label>State</Form.Label>
                    <Form.Select name='state' value={formData.state} onChange={handleChange} required={selectedOption === "Indain_Hindu"} // Required for Indian Hindus
                    >
                      <option value="">Choose One..</option>
                      <option>Andhra Pradesh</option>
                      <option>Arunachal Pradesh</option>
                      <option>Assam</option>
                      <option>Bihar</option>
                      <option>Chhattisgarh</option>
                      <option>Goa</option>
                      <option>Gujarat</option>
                      <option>Haryana</option>
                      <option>Himachal</option>
                      <option>Dharamshala</option>
                      <option>Jharkhand</option>
                      <option>Karnataka</option>
                      <option>Kerala</option>
                      <option>Madhya Pradesh</option>
                      <option>Maharashtra</option>
                      <option>Nagpur</option>
                      <option>Manipur</option>
                      <option>Meghalaya</option>
                      <option>Mizoram</option>
                      <option>Nagaland</option>
                      <option>Odisha</option>
                      <option>Punjab</option>
                      <option>Rajasthan</option>
                      <option>Sikkim</option>
                      <option>Tamil Nadu</option>
                      <option>Telangana</option>
                      <option>Tripura</option>
                      <option>Uttar Pradesh</option>
                      <option>Uttarakhand</option>
                      <option>Dehradun</option>
                      <option>West Bengal</option>
                      <option>Andaman and Nicobar Islands</option>
                      <option>Chandigarh</option>
                      <option>Dadra and Nagar Haveli and Daman and Diu</option>
                      <option>Delhi</option>
                      <option>Jammu and Kashmir</option>
                      <option>Jammu</option>
                      <option>Ladakh</option>
                      <option>Kargil</option>
                      <option>Lakshadweep</option>
                      <option>Puducherry</option>

                      {/* Add remaining states */}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col} >
                    <Form.Label>PIN Code</Form.Label>
                    <Form.Control name='PIN' placeholder='PIN Code' value={formData.PIN} onChange={handleChange} required={selectedOption === "Indain_Hindu"} // Required for Indian Hindus
                    />
                  </Form.Group>
                </Row>
              </div>
            )}

            {selectedOption === 'Gobal_Hindu' && (
              <div id="addOutIn">

                <Form.Group className="mb-3" >
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    name='address'
                    placeholder="Your Current Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Write the name of your City!</Tooltip>}>
                  <Row className="mb-3">
                    <Form.Group as={Col} >
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        name='city'
                        placeholder="The City you live in"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Row>
                </OverlayTrigger>
                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Write your Country or Territory!</Tooltip>}>
                  <Row className="mb-3">
                    <Form.Group as={Col} >
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        name='country'
                        placeholder="Name your Country or Territory or Region"
                        value={formData.country}
                        onChange={handleChange}
                        required={selectedOption === "Gobal_Hindu"} // Required for Global Hindus
                      />
                    </Form.Group>
                  </Row>
                </OverlayTrigger>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="form-check mb-3 d-flex justify-content-center align-items-center">
              <input
                type="checkbox"
                className="form-check-input me-2"
                name="agreedTerms"
                required
                onChange={handleChange} />

              <label className="form-check-label">
                I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>
              </label>
            </div>

            {submissionStatus && <div className="alert alert-success">{submissionStatus}</div>}

            {/* Submit Button Wrapper */}
            <div
              onClick={() => {
                if (!formData.agreedTerms) {
                  handleError("Please check the Terms and Conditions checkbox first.");
                }
              }}
              style={{ display: "inline-block", width: "100%" }}
            >
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading || !formData.agreedTerms}
              >
                {loading ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </span>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>


          </form>
        </Card.Body>
      </Card>
      <ToastContainer />
    </div>
  )
}

export default JoinUs