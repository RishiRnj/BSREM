import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Form, InputGroup, Modal, OverlayTrigger, Tooltip, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import './Test.css';
import Hero from '../../Components/Background/Hero';
import ImageUploader from '../../Components/ImageUploader';
import { handleSuccess, handleWarning, handleError } from '../../Components/Util';
import { BsPencilSquare } from "react-icons/bs";
import MobileVerification from '../../LandingPage/LogIn/MobileVerification';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { GoVerified, GoDotFill, GoDot } from "react-icons/go";
import { GrNext } from "react-icons/gr";
import { BsFillSendFill, BsFillSendArrowUpFill, BsBracesAsterisk } from "react-icons/bs";
import AuthContext from "../../Context/AuthContext";
import { BiSolidEdit } from "react-icons/bi";


const Test = () => {

  const { user } = useContext(AuthContext);
  const userId = user?.id;
  console.log("update", userId);


  const location = useLocation();
  const navigate = useNavigate();


  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // State for preview image
  const placeholderImage = "/user.png";
  const [profileImage, setProfileImage] = useState(null);
  const [alertShown, setAlertShown] = useState(false); // Track if the alert has been shown
  const [showUpdateField, setShowUpdateField] = useState(false); // Control visibility of the update field
  const [showModal, setShowModal] = useState(false);  // State to control modal visibility
  const [onVerified, setOnVerified] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showConfirmN, setShowConfirmN] = useState(false);
  const [savedDataLS, setSavedDataLS] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [complete, setComplete] = useState(null);
  const [error, setError] = useState(false);
  const [errorN, setErrorN] = useState(false);




  const [formData, setFormData] = useState({
    religion: "",
    email: "",
    fullName: "",
    updateFullName: "",
    mobile: "",
    dob: "",
    age: "",
    gender: "",
    hobby: "",
    bloodGroup: "",
    occupationCategory: "",
    occupation: "",
    moreAboutOccupation: "",
    origin: '',
    address: '',
    city: '',
    district: '',
    state: '',
    PIN: '',
    country: '',
    agreedTerms: false,
  });

  useEffect(() => {
    // Retrieve form data from local storage
    const savedData = localStorage.getItem("savedFormData");
    const savedStep = localStorage.getItem("currentStep");

    if (savedData) {
      setFormData(JSON.parse(savedData));
      setSavedDataLS(true);
    }

    if (savedStep) {
      setStep(parseInt(savedStep)); // Convert to number
    }
  }, []);

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


  //Function to check if user profile is updated 
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
      const userD = userData.user;
      setFormData((prevData) => ({
        ...prevData,
        ...userD, // Merge parsed user data into formData       
      }));
      if (userD.userImage) {
        setProfileImage(userD.userImage);
      }
      if (userD.mobile) {
        setSavedDataLS(true);
        setOnVerified(true);
      }

      console.log(profileImage, "formData from API");

      return userData.isProfileCompleted; // Ensure this key exists in API response

    } catch (error) {
      console.error("Error in checkUserProfile:", error);
      navigate("/dashboard"); // Redirect to a fallback route if needed
      return false; // Default to false if there's an error
    }
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

  const handleNameClick = () => {
    if (!alertShown) {
      handleSuccess("Update Name field is enable now, where you can update the Name.");
      setAlertShown(true);
      setShowUpdateField(true); // Make the update field visible
    }
    handleSuccess("New Name field is now editable.");
  };
  const EditMobile = () => {
    setSavedDataLS(false);
    setFormData((prevData) => ({ ...prevData, mobile: "" }));
    handleSuccess("Mobile field is now editable.");
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
    setFormData((prevData) => ({ ...prevData, mobile: phoneNumber }));
    setOnVerified(true);
    handleCloseModal();  // Close modal after phone verification
  };

  const occupations = {
    healthcare: ["Doctor", "Nurse", "Pharmacist", "Dentist", "Psychologist", "Caregiver", "Yoga Instructor", "Therapist"],
    technology: ["Software Developer", "Web Developer", "IT Support", "Data Scientist", "SEO Specialist"],
    business: ["Entrepreneur", "Salesperson", "Marketing", "Business Analyst", "HR Manager", "Wholesaler", "Retailer", "Small business"],
    education: ["Student", "Home Tutor", "Primary School Teacher", "High School Teacher", "Professor", "Principal", "Researcher"],
    engineering: ["Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Chemical Engineer", "Aerospace Engineer"],
    legal: ["Judge", "Lawyer", "Paralegal", "Legal Advisor", "Notary", "Accountant"],
    creative: ["Designer", "Artist", "Musician", "Photographer", "Writer", "Content Creater", "Influencer", "News Reporter", "News Anchor"],
    service: ["Chef", "Bartender", "Waiter", "Event Planner", "Public Relations", "Hairdresser", "Shopkeeper", "Housekeeper"],
    skilledTrades: ["Plumber", "Electrician", "Mechanic", "Construction Worker", "Farmer", "Driver"],
    government: ["St. Govt. Employee", "Cnt. Govt. Employee"],
    other: ["Freelancer", "Homemaker", "Retired", "Social Worker", "Unemployed"]
  };

  // Function to update sub-category options
  const updateOccupationOptions = (category) => {
    if (category && occupations[category]) {
      return occupations[category];
    }
    return [];
  };

  const handleChange = (e) => {
    if (e) {
      const { name, value, type, checked } = e.target;
      if (type === "checkbox") {
        setFormData((prevData) => ({ ...prevData, [name]: checked }));
      } else if (name === "dob") {
        setFormData((prevData) => ({ ...prevData, dob: value, age: calculateAge(value) }));
      } else if (name === "updateFullName") {
        setErrorN(false);
        setFormData((prevData) => ({ ...prevData, updateFullName: value }));
      }
      else {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
    }
  };

  const handleNameChangeAlart = (e) => {
    if (!showUpdateField) {
      handleWarning("This field is disabled, to enable Click the Pencil icon.");
      return; // Exit the function if the field is disabled
    }

  }

  // step change
  const handleSettingStep1 = () => {
    setStep(1); // Proceed to the next step
  };

  const handleSettingStep2 = () => {
    setStep(2); // Proceed to the next step
  };

  const handleSettingStep3 = () => {
    setStep(3); // Proceed to the next step
  };

  const handleNext = (e) => {
    e.preventDefault(); // Prevent form submission

    // Validate Full Name
    if (showUpdateField && (!formData.updateFullName || formData.updateFullName.trim() === "")) {
      handleWarning("You Click the edit Icon, now Name is required. If dont want to update, reload this page");
      return;
    }

    // Validate Mobile Number (empty or not verified)
    if (!formData.mobile || !onVerified) {
      handleWarning("Mobile number is required and must be verified");
      return;
    }
    // Validate age (empty )
    if (!formData.age) {
      handleWarning("Age is not define! Select your Date of Birth its required!");
      return;
    }

    if (formData.gender === "") {
      handleWarning("Please select Gender.");
      return;
    }

    if (!formData.updateFullName) {
      setShowConfirmN(true); // Show confirmation modal
    } else {
      setStep(2); // Proceed to the next step
      setComplete(1)
      // Store form data in localStorage before proceeding
      localStorage.setItem("savedFormData", JSON.stringify(formData));
      localStorage.setItem("currentStep", "2"); // Save current step
    }
  };

  const handleNext2 = (e) => {
    e.preventDefault(); // Prevent form submission

    if (!formData.hobby) {
      handleWarning("Please select your Interest.");
      return;
    }
    if (!formData.bloodGroup) {
      handleWarning("Please select your Blood Group.");
      return;
    }
    if (!formData.occupationCategory) {
      handleWarning("Please select Occupation Category.");
      return;
    }
    if (!formData.occupation) {
      handleWarning("Please select Occupation.");
      return;
    }

    if (!formData.moreAboutOccupation) {
      setShowConfirm(true); // Show confirmation modal
    } else {
      setStep(3); // Proceed to the next step
      setComplete(2)
      // Store form data in localStorage before proceeding
      localStorage.setItem("savedFormData", JSON.stringify(formData));
      localStorage.setItem("currentStep", "3"); // Save current step
    }
    // if (!formData.moreAboutOccupation) {
    //   const userResponse = window.confirm(
    //     "You have not mentioned Occupation Details. Do you want to add?"
    //   );

    //   if (userResponse) {
    //     return; // Stay on the same page
    //   }
    // }

    // setStep(3); // Proceed to the next step
  };

  const handleConfirmYesN = () => {
    setShowConfirmN(false); // Stay on the same page
  };

  const handleConfirmNoN = () => {
    setShowConfirmN(false);
    setStep(2); // Proceed to the next step
    setComplete(1);
    // Store form data in localStorage before proceeding
    localStorage.setItem("savedFormData", JSON.stringify(formData));
    localStorage.setItem("currentStep", "2"); // Save current step
  };

  const handleConfirmYes = () => {
    setShowConfirm(false); // Stay on the same page
  };

  const handleConfirmNo = () => {
    setShowConfirm(false);
    setStep(3); // Proceed to the next step
    setComplete(2);
    // Store form data in localStorage before proceeding
    localStorage.setItem("savedFormData", JSON.stringify(formData));
    localStorage.setItem("currentStep", "3"); // Save current step
  };

  const handleSubmit = async (e) => {
    if (showUpdateField && !formData.updateFullName) {
      handleWarning("Update Name is required now!");
      setStep(1);
      setErrorN(true);

      return;

    }
    if (!formData.mobile) {
      handleWarning("Mobile No is required!")
      setStep(1);
      setError(true);
      return;
    }
    if (!formData.age) {
      handleWarning("Select Your Date of Birth!")
      setStep(1);
      return;
    }

    if (Number(formData.age) < 15) {
      handleWarning("You are too young to proceed!");
      navigate("/dashboard");
      return;
    }

    if (!formData.gender) {
      handleWarning("Select Your Gender!")
      setStep(1);
      return;
    }
    if (!formData.hobby) {
      handleWarning("Select your topic of Interest!")
      setStep(2);
      return;
    }
    if (!formData.bloodGroup) {
      handleWarning("Select your Bloog Group!")
      setStep(2);
      return;
    }
    if (!formData.occupation) {
      handleWarning("Select your Occupation!")
      setStep(2);
      return;
    }


    if (!profileImage) {
      handleWarning("Please upload or Update a profile image before submitting!");
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

        // Clear stored form data after submission
        localStorage.removeItem("savedFormData");
        localStorage.removeItem("currentStep");
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
  }

  const handleImageUpload = (croppedImage) => {
    setProfileImage(croppedImage); // Store cropped image in state  
    // setFormData({ ...formData, userImage: croppedImage }); // Store the file in formData for submission  
    console.log("Uploaded Image:", croppedImage); // You can upload it to the server here
  };

  const renderTooltip = (props, tooltipText) => (
    <Tooltip id="button-tooltip" {...props}>
      {tooltipText}
    </Tooltip>
  );


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
    <>
      <Hero />

      <div className="update-us-container">

        <div className="update-image"></div>

        <Card className="update-form-card" >
          <h1 className="hero__title ">Update & Edit Profile</h1>

          <ImageUploader onImageUpload={handleImageUpload} defaultImage={imagePreview} />

          <Card.Body>
            {/* {submissionStatus && <div className="alert alert-success">{submissionStatus}</div>} */}
            <Form
              onSubmit={(e) => {
                e.preventDefault(); handleSubmit();
              }}>


              {step === 1 && (
                <>
                  <Row>
                    <Col sm>
                      <InputGroup className="mb-2" >
                        <InputGroup.Text style={{ fontWeight: "bold" }}>User Email</InputGroup.Text>
                        <Form.Control aria-label="User Email" type="email" name="email" value={formData.email} readOnly disabled />
                      </InputGroup>
                    </Col>

                    <Col sm>
                      <InputGroup className="mb-2" >
                        <InputGroup.Text style={{ fontWeight: "bold" }}>Full Name</InputGroup.Text>
                        <Form.Control aria-label="Full Name"
                          type="text" name="fullName" value={formData.fullName}
                          onClick={handleNameClick} // Show alert on first click
                          disabled
                          readOnly
                          aria-describedby="basic-verify"
                        />

                        <Button
                          type="submit"
                          variant='light'
                          title='Update Name'
                          id="basic-verify"
                          onClick={handleNameClick} // Show alert on first click
                          className="basic-verify"
                          style={{
                            border: 'none',
                            // backgroundColor: 'transparent',
                            color: loading ? 'green' : 'blue',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            padding: '0px 10px',
                          }} >
                          <BsPencilSquare />
                        </Button>
                      </InputGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm>
                      <div onClick={handleNameChangeAlart}>
                        <InputGroup className="mb-2"  >
                          <InputGroup.Text style={{ fontWeight: "bold" }}>New Full Name</InputGroup.Text>
                          <Form.Control aria-label="New Full Name" type="text"
                            name="updateFullName"
                            placeholder="Enter your Updated Name..."
                            value={formData.updateFullName}
                            onChange={handleChange}
                            readOnly={!showUpdateField}
                            required={showUpdateField} />
                          {errorN ? <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={props => renderTooltip(props, "You Clicked Update Name Icon, Now its Mendatory")}
                          ><InputGroup.Text><BsBracesAsterisk /></InputGroup.Text></OverlayTrigger> : ""}
                        </InputGroup>
                      </div>

                    </Col>

                    <Col sm>
                      {formData?.mobile ? (
                        // If mobile exists, render the Mobile number with Verification mark
                        <div className="position-relative mb-2">
                          <PhoneInput
                            name="mobile"
                            placeholder='Enter Phone Number'
                            disabled={onVerified || savedDataLS}
                            country={'in'}
                            value={formData.mobile}
                            inputProps={{ name: 'mobile' }}
                            inputStyle={{ width: '100%', borderRadius: '5px' }}
                          />
                          {(onVerified || savedDataLS) && (
                            <GoVerified
                              className="position-absolute"
                              style={{
                                right: savedDataLS ? 30 : 10,
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "green",
                              }}
                            />
                          )}

                          {savedDataLS && (
                            <BiSolidEdit
                              onClick={EditMobile}
                              className="position-absolute"
                              style={{ right: 10, top: "50%", transform: "translateY(-50%)", color: "blue", cursor: 'pointer' }}
                            />
                          )}
                        </div>

                      ) : (

                        // If mobile does not exist, show the mobile number in InputGroup
                        <InputGroup className="mb-2" onClick={handleInputFocus}>
                          <InputGroup.Text style={{ fontWeight: "bold" }}>Mobile No.</InputGroup.Text>
                          <Form.Control
                            aria-label="Mobile No."
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            placeholder="Enter your Mobile No"
                          />
                          {error ? <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={props => renderTooltip(props, "Mobile No is Mendatory, Enter your Mobile No")}
                          ><InputGroup.Text><BsBracesAsterisk /></InputGroup.Text></OverlayTrigger> : ""}
                        </InputGroup>
                      )}
                    </Col>
                  </Row>

                  <Row>
                    <Col sm>
                      <div className="position-relative mb-2">
                        <InputGroup className="mb-2" >
                          <InputGroup.Text style={{ fontWeight: "bold" }}>Date of Birth</InputGroup.Text>
                          <Form.Control type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                        </InputGroup>

                        {formData.dob && (
                          <Badge
                            className="position-absolute"
                            style={{ right: 40, top: "50%", transform: "translateY(-50%)", color: "white" }}
                          > {formData.age} years</Badge>
                        )}
                      </div>
                    </Col>

                    <Col sm> 
                      <InputGroup className="mb-2">
                        <InputGroup.Text id="basic-addon1" style={{ fontWeight: "bold" }}>Gender</InputGroup.Text>
                        <Form.Control as="select" aria-label="Gender" name="gender" 
                          value={formData.gender} required
                          onChange={(e) => {
                            handleChange(e);
                            
                          }}
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          
                        </Form.Control>
                        
                      </InputGroup>
                    </Col>

                    <Col sm>
                    <InputGroup className="mb-2">
                        <InputGroup.Text id="basic-addon1" style={{ fontWeight: "bold" }}>Religion</InputGroup.Text>
                        <Form.Control as="select" aria-label="Religion" name="religion" 
                          value={formData.religion} required
                          onChange={(e) => {
                            handleChange(e);
                            
                          }}
                        >
                          <option value="">Select Religion</option>
                          <option value="Hinduism">Hinduism</option>
                          <option value="Christianity">Christianity</option>
                          <option value="Islam">Islam</option>
                          
                        </Form.Control>
                        
                      </InputGroup>
                    </Col>

                  </Row>


                  {/* Next Button */}
                  <Row>
                    <Col>
                      <div className='d-flex justify-content-center'>
                        <Button className="w-80" onClick={handleNext} variant="primary" type='submit'>
                          Next <GrNext />
                        </Button>
                      </div>
                    </Col>
                  </Row>

                </>
              )}

              {step === 2 && (
                <>
                  <Row>
                    <Col sm>
                      <InputGroup className="mb-3" >
                        <InputGroup.Text style={{ fontWeight: "bold" }}>Interested in</InputGroup.Text>
                        <Form.Control
                          as="select"
                          aria-label="Interested in"
                          name="hobby"
                          value={formData.hobby}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Interest</option>
                          <option value="Spirituality">Spirituality</option>
                          <option value="Sanatan Culture">Sanatan Culture</option>
                          <option value="Hindu Unity">Hindu Unity</option>
                          <option value="History">Vedic History</option>
                          <option value="Technology">Technology</option>
                          <option value="Environment">Environment</option>
                          <option value="Politics">Politics</option>
                          <option value="News & Event">News & Event</option>
                          <option value="Geopolitics">Geopolitics</option>
                          <option value="Yoga">Yoga</option>
                        </Form.Control>
                      </InputGroup>

                    </Col>

                    <Col sm>
                      <InputGroup className="mb-3" >
                        <InputGroup.Text style={{ fontWeight: "bold" }}>Blood Group</InputGroup.Text>
                        <Form.Control
                          as="select"
                          aria-label="Blood Group"
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </Form.Control>
                      </InputGroup>
                    </Col>
                  </Row>

                  <Row>
                    {/* Occupation Category Select */}
                    <Col sm>
                      <InputGroup className="mb-3">
                        <InputGroup.Text style={{ fontWeight: "bold" }}>Occupation Category</InputGroup.Text>
                        <Form.Control
                          as="select"
                          aria-label="Occupation Category"
                          name="occupationCategory"
                          value={formData.occupationCategory}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Occupation Category</option>
                          <option value="healthcare">Health Care</option>
                          <option value="technology">Technology</option>
                          <option value="business">Business</option>
                          <option value="education">Education</option>
                          <option value="engineering">Engineering</option>
                          <option value="legal">Legal</option>
                          <option value="creative">Creative</option>
                          <option value="service">Service</option>
                          <option value="skilledTrades">Skilled Trades</option>
                          <option value="government">Government Employee</option>
                          <option value="other">Others</option>
                        </Form.Control>
                      </InputGroup>
                    </Col>

                    {/* Occupation Select (Only shown when category is selected) */}
                    {formData.occupationCategory && (
                      <Col sm>
                        <InputGroup className="mb-3">
                          <InputGroup.Text style={{ fontWeight: "bold" }}>Occupation</InputGroup.Text>
                          <Form.Control
                            as="select"
                            aria-label="Occupation"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select Occupation</option>
                            {updateOccupationOptions(formData.occupationCategory).map((occupationOption, index) => (
                              <option key={index} value={occupationOption}>
                                {occupationOption}
                              </option>
                            ))}
                          </Form.Control>
                        </InputGroup>
                      </Col>
                    )}



                  </Row>

                  <Row>
                    <Col sm>
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={props => renderTooltip(props, "Share your Occupation Details like, *If select Doctor then about speciality, *If Govt. Employee then tell us your Department, *If Survice or Business then tell us your Sector!")}
                      >
                        <InputGroup className="mb-3" >
                          <InputGroup.Text style={{ fontWeight: "bold" }}>Occupation Details</InputGroup.Text>
                          <Form.Control aria-label="More About Occupation"
                            name="moreAboutOccupation"
                            value={formData.moreAboutOccupation}
                            onChange={handleChange}
                            type="text"
                            placeholder="Tell us about your Occupation..."
                          />
                        </InputGroup>
                      </OverlayTrigger>

                    </Col>
                  </Row>

                  {/* Next Button */}

                  <Row>
                    <Col >
                      <div className='d-flex justify-content-center'>
                        <Button className="w-80" onClick={handleNext2} variant="primary" type='submit'>
                          Next <GrNext />
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </>

              )}

              {step === 3 && (
                <>
                  <Row>
                    <Col sm>
                      <InputGroup className="mb-2" >
                        <InputGroup.Text style={{ fontWeight: "bold" }}>Residential status</InputGroup.Text>
                        <Form.Control
                          as="select"
                          aria-label="Residential status"
                          name='origin'
                          value={formData.origin}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Choose Origin</option>
                          <option value="Indian Hindu">Hindus Living in India</option>
                          <option value="Gobal Hindu">Hindus Living Outside India</option>
                        </Form.Control>
                      </InputGroup>

                    </Col>

                    <Col sm>
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={props => renderTooltip(props, "Enter your local Address, like- Street Addres, Village, Near by place")}
                      >
                        <InputGroup className="mb-2" >
                          <InputGroup.Text style={{ fontWeight: "bold" }}>Locality</InputGroup.Text>
                          <Form.Control
                            name='address'
                            placeholder="House No, St. No, Locality"
                            value={formData.address}
                            onChange={handleChange}
                            required />
                        </InputGroup>
                      </OverlayTrigger>

                    </Col>
                  </Row>

                  <Row>
                    <Col sm>
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={props => renderTooltip(props, "Enter your City")}
                      >
                        <InputGroup className="mb-2" >
                          <InputGroup.Text style={{ fontWeight: "bold" }}>City</InputGroup.Text>
                          <Form.Control name='city'
                            placeholder='Enter City'
                            value={formData.city}
                            onChange={handleChange}
                            required />
                        </InputGroup>
                      </OverlayTrigger>

                    </Col>

                    <Col sm>
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={props => renderTooltip(props, "Enter your District")}
                      >
                        <InputGroup className="mb-2" >
                          <InputGroup.Text style={{ fontWeight: "bold" }}>District</InputGroup.Text>
                          <Form.Control
                            name='district'
                            placeholder='Enter District Name'
                            value={formData.district}
                            onChange={handleChange}
                            disabled={formData.origin === "Gobal Hindu"}
                            required={formData.origin === "Indian Hindu"}
                          />
                        </InputGroup>
                      </OverlayTrigger>

                    </Col>
                  </Row>

                  <Row>
                    <Col sm>
                      {formData.origin === "Indian Hindu" ? (
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 250, hide: 400 }}
                          overlay={props => renderTooltip(props, "Select your State")}
                        >
                          <InputGroup className="mb-2" >
                            <InputGroup.Text style={{ fontWeight: "bold" }}>State</InputGroup.Text>
                            <Form.Control
                              as="select"
                              aria-label="State"
                              name='state'
                              placeholder='Choose State'
                              value={formData.state}
                              onChange={handleChange}
                              required={formData.origin === "Indian Hindu"}
                            >
                              <option value="">Choose State</option>
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
                            </Form.Control>
                          </InputGroup>
                        </OverlayTrigger>
                      ) : (
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 250, hide: 400 }}
                          overlay={props => renderTooltip(props, "Enter your State")}
                        >
                          <InputGroup className="mb-2" >
                            <InputGroup.Text style={{ fontWeight: "bold" }}>State</InputGroup.Text>
                            <Form.Control
                              name='state'
                              placeholder='Enter State'
                              value={formData.state}
                              onChange={handleChange}
                              required={formData.origin === "Gobal Hindu"} />
                          </InputGroup>
                        </OverlayTrigger>


                      )}


                    </Col>

                    {(formData.origin === "Gobal Hindu") && (
                      <Col sm>
                        <>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={props => renderTooltip(props, "Enter your Country")}
                          >
                            <InputGroup className="mb-2" >
                              <InputGroup.Text style={{ fontWeight: "bold" }}>Country</InputGroup.Text>
                              <Form.Control
                                name='country'
                                placeholder="Name your Country or Territory or Region"
                                value={formData.country}
                                onChange={handleChange}
                                required={formData.origin === "Gobal Hindu"} />
                            </InputGroup>
                          </OverlayTrigger>

                          {/* {formData.origin === "Indian Hindu" || formData.origin === "" ? (

                          <InputGroup className="mb-2" >
                            <InputGroup.Text style={{ fontWeight: "bold" }}>Country</InputGroup.Text>
                            <Form.Control
                              name='country'
                              placeholder="Name your Country or Territory or Region"
                              value={formData.origin === "Indian Hindu" ? "India" : formData.country} // Set value to 'India' if origin is "Indian Hindu"
                              disabled={formData.origin === "Indian Hindu" || formData.origin === ""} />
                          </InputGroup>


                        ) : (
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={props => renderTooltip(props, "Enter your Country")}
                          >
                            <InputGroup className="mb-2" >
                              <InputGroup.Text style={{ fontWeight: "bold" }}>Country</InputGroup.Text>
                              <Form.Control
                                name='country'
                                placeholder="Name your Country or Territory or Region"
                                value={formData.country}
                                onChange={handleChange}
                                required={formData.origin === "Gobal Hindu"} />
                            </InputGroup>
                          </OverlayTrigger>
                        )} */}
                        </>
                      </Col>
                    )}


                    <Col sm>
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={props => renderTooltip(props, "Enter your PIN or ZIP Code. If you are located outside India and there is no specific code for your area, then write N/A.")}
                      >
                        <InputGroup className="mb-2" >
                          <InputGroup.Text style={{ fontWeight: "bold" }}>{formData.origin === "Indian Hindu" ? 'PIN Code' : "ZIP Code"}</InputGroup.Text>
                          <Form.Control name='PIN' placeholder={formData.origin === "Indian Hindu" ? 'PIN Code' : "ZIP Code"} value={formData.PIN} onChange={handleChange} required
                          />
                        </InputGroup>
                      </OverlayTrigger>

                    </Col>


                  </Row>

                  <Row>
                    <Col>
                      {/* Terms and Conditions */}
                      <div className="form-check mb-1 d-flex justify-content-center align-items-center">
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
                    </Col>


                  </Row>



                  <div className='d-flex justify-content-center'>
                    <Button type="submit" className="w-80" disabled={loading} variant='secondary'>
                      {loading ? (
                        <span>
                          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" style={{ marginRight: '8px' }}></span>
                          Submitting... <BsFillSendArrowUpFill />
                        </span>
                      ) : (
                        <>Submit <BsFillSendFill /></>  // Correctly rendered as a React component
                      )}
                    </Button>
                  </div>

                </>
              )}

              <div className='d-flex justify-content-center' style={{ fontSize: "30px" }}>
                <div onClick={handleSettingStep1} style={{ cursor: "pointer" }}> {step === 1 ? (<GoDotFill />) : (<GoDot />)} </div>
                <div onClick={handleSettingStep2} style={{ cursor: "pointer" }}> {step === 2 ? (<GoDotFill />) : (<GoDot />)} </div>
                <div onClick={handleSettingStep3} style={{ cursor: "pointer" }}> {step === 3 ? (<GoDotFill />) : (<GoDot />)} </div>


              </div>
            </Form>
          </Card.Body>
        </Card>

        <ToastContainer />

        {/* Custom Modal for Mobile Verification */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Phone Number Verification</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Render the MobileVerification component inside the modal */}
            <MobileVerification onPhoneVerified={handlePhoneNumber} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>


        {/* Custom Modal for Confirmation occupation details */}
        <Modal show={showConfirm} onHide={handleConfirmNo} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Action</Modal.Title>
          </Modal.Header>
          <Modal.Body> You have not mentioned Occupation Details. Do you want to add?</Modal.Body>
          <Modal.Footer>

            <Button variant="primary" onClick={handleConfirmYes}>Yes</Button>
            <Button variant="secondary" onClick={handleConfirmNo}>No</Button>
          </Modal.Footer>
        </Modal>


        {/* Custom Modal for Confirmation update name */}
        <Modal show={showConfirmN} onHide={handleConfirmNoN} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Action</Modal.Title>
          </Modal.Header>
          <Modal.Body> You have not Update Full Name yet. Do you want to Update?</Modal.Body>
          <Modal.Footer>

            <Button variant="primary" onClick={handleConfirmYesN}>Yes</Button>
            <Button variant="secondary" onClick={handleConfirmNoN}>No</Button>
          </Modal.Footer>
        </Modal>

      </div>








    </>






  )
}

export default Test