import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Col, Form, FormControl, FormGroup, OverlayTrigger, Tooltip, Row, Spinner, Button, InputGroup } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError, handleWarning } from '../../Components/Util';
import "./UpdateProfile.css"; // Include your custom styles here
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { BsPencilSquare } from "react-icons/bs";
import AuthContext from "../../Context/AuthContext";
import ImageUploader from "../../Components/ImageUploader";
import MobileVerification from "../../LandingPage/LogIn/MobileVerification";



const UpdateProfile = () => {
  const { user } = useContext(AuthContext);  
  const userId = user?.id;

  const location = useLocation();
  const navigate = useNavigate();
  // Get the referring page from state

  const from = location.state?.from; // Fallback to a default page  
  const [selectedImage, setSelectedImage] = useState(null); // State for preview image
  const placeholderImage = "/user.png";
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');  
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [formError, setFormError] = useState({});  
  const [profileImage, setProfileImage] = useState(null);
  const [alertShown, setAlertShown] = useState(false); // Track if the alert has been shown
  const [showUpdateField, setShowUpdateField] = useState(false); // Control visibility of the update field

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    updateFullName: "",
    mobile: "",
    dob: "",
    age: "",
    gender: "",
    hobby: "",
    bloodGroup: "",
    occupation: "",
    moreAboutOccupation: "",
    address: '',
    city: '',
    district: '',
    state: '',
    PIN: '',
    country: '',
    agreedTerms: false,
  });

  useEffect(() => {
    try {
      // Retrieve user data from localStorage
      const user = localStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user); // Parse the JSON string

        if (!parsedUser.userImage) {
          console.log("no User Image");

        } else {
          const image = parsedUser.userImage;
          setSelectedImage(image)
        }



        // Merge username and displayName into a single name field
        const fullName = parsedUser.username || parsedUser.displayName || ""; // Prioritize username, fallback to displayName
        // Update formData with the retrieved user data
        setFormData((prevData) => ({
          ...prevData,
          ...parsedUser, // Merge parsed user data into formData
          fullName, // Update fullName field
        }));
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      // Redirect to login on error      
    }
  }, []);


  const handlePhoneNumber = (phoneNumber) => {
    setFormData((prevData) => ({ ...prevData, mobile: phoneNumber }));
  };

  const handleImageUpload = (croppedImage) => {
    setProfileImage(croppedImage); // Store cropped image in state  
    // setFormData({ ...formData, userImage: croppedImage }); // Store the file in formData for submission  
    console.log("Uploaded Image:", croppedImage); // You can upload it to the server here
  };

  useEffect(() => {
    const checkProfileAndRedirect = async () => {
      const isProfileUpdated = await checkUserProfile();
      console.log("Profile update check result:", isProfileUpdated);
  
      if (isProfileUpdated) {
        // Get the redirect path from localStorage
        const redirectPath = localStorage.getItem("redirectAfterUpdate");
        const redirectSection = localStorage.getItem("redirectAfterUpdateSEC");
  
        if (redirectPath) {
          console.log("Navigating to:", redirectPath, "Section:", redirectSection);
  
          setTimeout(() => {
            navigate(redirectPath);
            
            // Clear localStorage *only after* navigation
            localStorage.removeItem("redirectAfterUpdate");
            localStorage.removeItem("redirectAfterUpdateSEC");
  
            // Now scroll to section after navigation completes
            setTimeout(() => {
              if (redirectSection) {
                const element = document.getElementById(redirectSection);
                if (element) {
                  window.scrollTo({
                    top: element.offsetTop,
                    behavior: "smooth",
                  });
                }
              }
            }, 500); // Small delay to ensure DOM is loaded
          }, 100); // Ensure localStorage is read before clearing
        }
      }
    };
  
    checkProfileAndRedirect();
  }, [navigate]);
  

  // Function to check if user profile is updated
  const checkUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
        method: "GET",
        credentials: "include", // Necessary for cookies/session handling
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile.");
      }

      const userData = await response.json();
      console.log(userData);
      
      return userData.isProfileCompleted; // Ensure this key exists in API response

    } catch (error) {
      console.error("Error in checkUserProfile:", error);
      navigate("/forum"); // Redirect to a fallback route if needed
      return false; // Default to false if there's an error
    }
  };




  const handleNameClick = () => {
    if (!alertShown) {
      alert("A new Name field Appear, where you can update the Name.");
      setAlertShown(true);
      setShowUpdateField(true); // Make the update field visible
    }
    handleSuccess("New Name field is now editable.");
  };




  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value); // Update the selected option state
    setFormData((prev) => ({
      ...prev,
      origin: value, // Update the formSelect field in formData
    }));
  };

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




  const handleChange = (e) => {
     if (e) {
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



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.gender === "") {
      handleWarning("Please select Gender.");
      return;
    }

    if (formData.updateFullName === "") {
      handleWarning("Click to edit Button to Update Full Name")
      return;
    }



    if (!profileImage) {
      handleWarning("Please upload a profile image before submitting.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. Redirecting to login.');
      window.location.href = '/login';
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('formData', JSON.stringify(formData)); // Add form data

      // Append cropped image as Blob
      if (profileImage) {
        const blob = await fetch(profileImage).then((res) => res.blob());
        formDataToSend.append("userUpload", blob, "croppedImage.png");
      }
      console.log("fromdata update", formDataToSend);
      

      console.log("sending data", formDataToSend);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
        credentials: 'include', // Important for cookies or sessions
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      setLoading(false);

      if (response.ok) {
        const data = await response.json();
        handleSuccess('Profile Update successful!');
        setSubmissionStatus('Your Profile has been Updated successfully!');
        //window.location.href = '/user/survey';
        const redirectPath = localStorage.getItem("redirectAfterUpdate") || `/user/${userId}/profile`;
        
          navigate(redirectPath);
       
      } else {
        const errorData = await response.json();
        handleError(`Update failed: ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error updating profile:', error);
      handleError(`Failed to update profile: ${error.message}`);
    }
  };


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


  const imagePreview = profileImage ? profileImage : selectedImage ? selectedImage : placeholderImage ? placeholderImage : "";

  return (
    <div className="update-profile-container">
      <div className="content-container">
        {/* Left Image */}
        <div className="image-container"></div>

        {/* Card Section */}
        <div className="form-container">
          <h2 className="text-center mt-2 mb-4">Update User Profile</h2>


          <Card className="shadow-sm profile-card">
            <Card.Body>
              <form onSubmit={handleSubmit}>
                <ImageUploader onImageUpload={handleImageUpload} defaultImage={imagePreview} />

                {/* Email */}
                <div className="mb-3">
                  <FormGroup>
                    <Form.Label>Email</Form.Label>
                    <FormControl type="email" name="email" value={formData.email} readOnly />
                  </FormGroup>
                </div>

                {/* Full Name */}
                <div className="mb-3">
                  <Form.Group className="mb-2">
                    <Form.Label>Full Name</Form.Label>
                    <div className="d-flex align-items-center border border-primary rounded">
                      {/* Input Field */}
                      <Form.Control
                        type="text" name="fullName" value={formData.fullName}
                        onClick={handleNameClick} // Show alert on first click
                        readOnly


                        aria-describedby="basic-verify"
                        
                      />

                      {/* Send Button */}
                      <button
                        type="submit"
                        variant='outline-primary'
                        title='Update Name'
                        id="basic-verify"
                        onClick={handleNameClick} // Show alert on first click

                        className="basic-verify"
                        style={{
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: loading ? 'green' : 'blue',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          padding: '0px 10px',
                        }} >
                        <BsPencilSquare />
                      </button>
                    </div>
                  </Form.Group>


                  
                </div>

                {/* Update Name */}
                {showUpdateField && (
                  <div className="mb-3">
                    <FormGroup>
                      <Form.Label>Update Full Name</Form.Label>
                      <FormControl
                        type="text"
                        name="updateFullName"
                        placeholder="Enter your Updated Name..."
                        value={formData.updateFullName}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </div>
                )}

                {/* Mobile No */}
                <div className="mb-3">
                  {/* <FormGroup>
                    <Form.Label>Mobile Number</Form.Label>
                    <PhoneInput
                      name="mobile"
                      country={'in'} // Default country is India
                      value={formData.mobile || ''} // Ensure controlled component
                      onChange={(value, data) => handleChange(null, value, data.countryCode, true)} // Pass value and country code
                      inputProps={{
                        name: 'mobile',
                      }}
                    />
                    {formError.mobile && <div className="text-danger">{formError.mobile}</div>}
                  </FormGroup> */}
                  <MobileVerification onPhoneVerified={handlePhoneNumber}/>
                </div>

                {/* Date of Birth */}
                <div className="mb-3">
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                      </Form.Group>
                    </Col>

                    {/* Age */}
                    <Col>
                      <Form.Group>
                        <Form.Label>Age</Form.Label>
                        <Form.Control type="number" name="age" value={formData.age} readOnly />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                {/* Gender */}
                <div className="mb-3">
                  <label id='gen'>Gender</label>
                  <div className="radio-group">
                    <label> <input type="radio" name="gender" value="Male" onChange={handleChange} /> Male</label>
                    <label> <input type="radio" name="gender" value="Female" onChange={handleChange} />Female</label>
                    <label> <input type="radio" name="gender" value="Other" onChange={handleChange} />Other</label>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-group">
                    <label className="mb-2">Passionate for or Interested in</label>
                    <select
                      className="form-select"
                      name="hobby"
                      value={formData.hobby}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="Spirituality">Spirituality</option>
                      <option value="Sanatan Culture">Sanatan Culture</option>
                      <option value="Hindu Unity">Hindu Unity</option>
                      <option value="History">Vedic History</option>
                      <option value="Technology">Technology</option>
                      <option value="Environment">Environment</option>
                      <option value="Politics">Politics</option>
                      <option value="News & Event">News & Event</option>
                      <option value="Geopolitics">Geopolitics</option>
                    </select>
                  </div>

                </div>

                {/* Blood Group and Occupation */}
                <div className="mb-3">
                  <Row>
                    {/* Blood Group */}
                    <Col>
                      <div className="form-group">
                        <label className="mb-2">Blood Group</label>
                        <select
                          className="form-select"
                          name="bloodGroup"
                          value={formData.bloodGroup}
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
                          value={formData.occupation}
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

                {/* Conditional Rendering */}
                {["Other", "Professional", "GovernmentJob", "Business", "Artist"].includes(formData.occupation) && (
                  <div className="mb-3">
                    <label className="mb-2">More About Occupation</label>
                    <textarea
                      className="form-control" name="moreAboutOccupation" value={formData.moreAboutOccupation} onChange={handleChange} rows="1" placeholder="Tell us about your Occupation..." required={formData.occupation === "Other" || "Professional" || "GovernmentJob" || "Business" || "Artist"} />
                  </div>
                )}

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
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateProfile;
