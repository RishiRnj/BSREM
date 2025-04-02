import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, Col, Form, FormGroup, InputGroup, Row, Spinner, Badge, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import ConferencePass from "./ConferencePass";
import ImageUploader from '../../Components/ImageUploader';
import AuthContext from "../../Context/AuthContext";

import MobileVerification from '../../LandingPage/LogIn/MobileVerification';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { GoVerified, GoDotFill, GoDot } from "react-icons/go";
import { GrNext } from "react-icons/gr";
import { BsBracesAsterisk } from "react-icons/bs";
import { BiSolidEdit } from "react-icons/bi";
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess, handleWarning } from '../../Components/Util';



const RegistrationForm = ({ venue, place, date, id, selectedConference }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDOB] = useState('');
  const [age, setAge] = useState('');
  const [qualification, setQualification] = useState('');
  const [locality, setlocality] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [gender, setGender] = useState('');
  const [category, setCategory] = useState('');
  const [religion, setReligion] = useState('');
  const [occupation, setOccupation] = useState('');
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false); // Track if user is registered
  const [registerd, setRegisterd] = useState(false); // Track if user is registered
  const [participant, setParticipant] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const placeholderImage = "/user.png";
  const { user } = useContext(AuthContext);
  const currentUser = user;
  const isAuthenticated = !!user;
  const userId = user?.id;

  const [showModal, setShowModal] = useState(false);  // State to control modal visibility
  const [onVerified, setOnVerified] = useState(false);
  const [error, setError] = useState(false);
  const [errorN, setErrorN] = useState(false);
  const [errorE, setErrorE] = useState(false);
  const [errorR, setErrorR] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showConfirmL, setShowConfirmL] = useState(false);
  const [step, setStep] = useState(1);
  const [imageSelected, setImageSelected] = useState(false);


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


            setProfileImage(data.userImage);


            setEmail(data?.email || '');
            setFullName(data?.updateFullName || '');
            setPhone(data?.mobile || '');
            setDOB(data?.dob || '');
            setAge(data?.age || '');
            setGender(data?.gender || '');
            setBloodGroup(data?.bloodGroup || '');
            setOccupation(data?.occupation || '');
            setCategory(data.occupationCategory || '');


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
    other: ["Freelancer", "Homemaker", "Retired", "Social Worker"]
  };

  // Function to update sub-category options
  const updateOccupationOptions = (category) => {
    if (category && occupations[category]) {
      return occupations[category];
    }
    return [];
  };

  // Set the default date picker value to 18 years ago
  useEffect(() => {
    const today = new Date();
    const eighteenYearsAgo = new Date(today.setFullYear(today.getFullYear() - 19));
    const formattedDate = eighteenYearsAgo.toISOString().split('T')[0]; // format as YYYY-MM-DD
    setDOB(formattedDate);
  }, []);

  // Calculate age from the selected date of birth
  const handleDOBChange = (e) => {
    const selectedDOB = new Date(e.target.value);
    setDOB(e.target.value);

    // Calculate age
    const today = new Date();
    const ageCalculated = today.getFullYear() - selectedDOB.getFullYear();
    const monthDiff = today.getMonth() - selectedDOB.getMonth();
    const dayDiff = today.getDate() - selectedDOB.getDate();

    // Adjust age if the birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      setAge(ageCalculated - 1);
    } else {
      setAge(ageCalculated);
    }
  };

  const handleImageUpload = (croppedImage) => {
    setProfileImage(croppedImage); // Store cropped image in state 
    setImageSelected(true)

    // setFormData({ ...formData, userImage: croppedImage }); // Store the file in formData for submission  
    console.log("Uploaded Image:", croppedImage); // You can upload it to the server here
  };

  const handleConfirmYes = () => {
    setShowConfirm(false); // Stay on the same page to allow the user to upload the image
    setProfileImage(null); // Allow the user to upload a new image (you can use an upload dialog here)
  };

  const handleConfirmNo = () => {
    setShowConfirm(false); // Proceed with submission, without the image
    handleSubmitWithoutImage(); // You can create a helper function to proceed with the submit
  };

  //bypass the image upload and proceed with submitting the form using
  const handleSubmitWithoutImage = async () => {
    const formDataToSend = new FormData();

    // Append form fields
    formDataToSend.append('fullName', fullName);
    formDataToSend.append('email', email);
    formDataToSend.append('phone', phone);
    formDataToSend.append('dob', dob);
    formDataToSend.append('age', age);
    formDataToSend.append('gender', gender);
    formDataToSend.append('qualification', qualification);
    formDataToSend.append('locality', locality);
    formDataToSend.append('bloodGroup', bloodGroup);
    formDataToSend.append('occupation', occupation);
    formDataToSend.append('category', category);
    formDataToSend.append('religion', religion);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/conference/add-participant/${id}`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.status === 400) {
        alert(data.error); // Show alert if user is already registered
        setIsAlreadyRegistered(true);
      } else {
        alert(data.message);
        setRegisterd(true);
      }
    } catch (error) {
      // Catch any errors that occur during the fetch request
      console.error("Error during submission:", error);
      alert("An error occurred while submitting the form. Please try again.");
    }
  };


  // handle submit
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!fullName) {
  //     handleWarning("Full Name is required!");
  //     // setStep(1);
  //     setErrorN(true);
  //     return;
  //   }

  //   if (!email) {
  //     handleWarning("Email is required!");
  //     // setStep(1);
  //     setErrorE(true);
  //     return;
  //   }

  //   if (!phone) {
  //     handleWarning("Mobile No is required!")
  //     // setStep(1);
  //     setError(true);
  //     return;
  //   }

  //   if (!profileImage) {
  //     setShowConfirm(true)
  //   }


  //   const formDataToSend = new FormData();

  //   // Append form fields one by one
  //   formDataToSend.append('fullName', fullName);
  //   formDataToSend.append('email', email);
  //   formDataToSend.append('phone', phone);
  //   formDataToSend.append('dob', dob);
  //   formDataToSend.append('age', age);
  //   formDataToSend.append('qualification', qualification);
  //   formDataToSend.append('locality', locality);
  //   formDataToSend.append('bloodGroup', bloodGroup);
  //   formDataToSend.append('occupation', occupation);
  //   formDataToSend.append('category', category);

  //   // Append cropped image as Blob
  //   if (profileImage) {
  //     const blob = await fetch(profileImage).then((res) => res.blob());
  //     formDataToSend.append("userUpload", blob, "croppedImage.png");
  //   }

  //   console.log("formData update", formDataToSend);

  //   try {
  //     const response = await fetch(`${process.env.REACT_APP_API_URL}/api/conference/add-participant/${id}`, {
  //       method: 'POST',
  //       body: formDataToSend,
  //     });

  //     const data = await response.json();

  //     if (response.status === 400) {
  //       alert(data.error); // Show alert if user is already registered
  //       setIsAlreadyRegistered(true);
  //     } else {
  //       alert(data.message);
  //       setRegisterd(true);
  //     }
  //   } catch (error) {
  //     // Catch any errors that occur during the fetch request
  //     console.error("Error during submission:", error);
  //     alert("An error occurred while submitting the form. Please try again.");
  //   }
  // };

  // handle submit with alart if no profile Image
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!fullName) {
  //     handleWarning("Full Name is required!");
  //     setErrorN(true);
  //     return;
  //   }

  //   if (!email) {
  //     handleWarning("Email is required!");
  //     setErrorE(true);
  //     return;
  //   }

  //   if (!phone) {
  //     handleWarning("Mobile No is required!");
  //     setError(true);
  //     return;
  //   }

  //   if (!age) {
  //     handleWarning("Select Your Date of Birth!")
  //     return;
  //   }

  //   if (!gender) {
  //     handleWarning("Select Your Gender!")
  //     return;
  //   }

  //   if (!bloodGroup) {
  //     handleWarning("Select your Bloog Group!")
  //     return;
  //   }
  //   if (!category) {
  //     handleWarning("Select your Occupation Category!")
  //     return;
  //   }
  //   if (!occupation) {
  //     handleWarning("Select your Occupation!")
  //     return;
  //   }


  //   if (!profileImage) {
  //     // If there is no profile image, show the confirmation modal
  //     setShowConfirm(true);
  //     return;
  //   }

  //   if (!religion) {
  //     handleWarning("Select your Religion!")
  //     return;
  //   }

  //   // Check if the religion is not "christian"
  //   if (religion !== "christian") {
  //     handleWarning("This conference is not for people of your Religion!");
  //     return;
  //   }

  //   const formDataToSend = new FormData();

  //   // Append form fields one by one
  //   formDataToSend.append('fullName', fullName);
  //   formDataToSend.append('email', email);
  //   formDataToSend.append('phone', phone);
  //   formDataToSend.append('dob', dob);
  //   formDataToSend.append('age', age);
  //   formDataToSend.append('gender', gender);
  //   formDataToSend.append('qualification', qualification);
  //   formDataToSend.append('locality', locality);
  //   formDataToSend.append('bloodGroup', bloodGroup);
  //   formDataToSend.append('occupation', occupation);
  //   formDataToSend.append('category', category);
  //   formDataToSend.append('religion', religion);

  //   // Append cropped image as Blob
  //   if (profileImage) {
  //     const blob = await fetch(profileImage).then((res) => res.blob());
  //     formDataToSend.append("userUpload", blob, "croppedImage.png");
  //   }

  //   console.log("formData update", formDataToSend);

  //   try {
  //     const response = await fetch(`${process.env.REACT_APP_API_URL}/api/conference/add-participant/${id}`, {
  //       method: 'POST',
  //       body: formDataToSend,
  //     });

  //     const data = await response.json();

  //     if (response.status === 400) {
  //       alert(data.error); // Show alert if user is already registered
  //       setIsAlreadyRegistered(true);
  //     } else {
  //       alert(data.message);
  //       setRegisterd(true);
  //     }
  //   } catch (error) {
  //     // Catch any errors that occur during the fetch request
  //     console.error("Error during submission:", error);
  //     alert("An error occurred while submitting the form. Please try again.");
  //   }

  // };

  // handle submit with alart if no profile Image
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if religion is not selected
    if (!religion) {
      handleWarning("Select your Religion!");
      setErrorR(true)
      return;
    }

    if (!fullName) {
      handleWarning("Full Name is required!");
      setErrorN(true);
      return;
    }

    if (!email) {
      handleWarning("Email is required!");
      setErrorE(true);
      return;
    }

    if (!phone) {
      handleWarning("Mobile No is required!");
      setError(true);
      return;
    }

    if (!age) {
      handleWarning("Select Your Date of Birth!")
      return;
    }

    if (!gender) {
      handleWarning("Select Your Gender!")
      return;
    }

    if (!bloodGroup) {
      handleWarning("Select your Bloog Group!")
      return;
    }
    if (!category) {
      handleWarning("Select your Occupation Category!")
      return;
    }
    if (!occupation) {
      handleWarning("Select your Occupation!")
      return;
    }

    if (!profileImage) {
      // If there is no profile image, show the confirmation modal
      setShowConfirm(true);
    } else {
      const formDataToSend = new FormData();

      // Append form fields one by one
      formDataToSend.append('fullName', fullName);
      formDataToSend.append('email', email);
      formDataToSend.append('phone', phone);
      formDataToSend.append('dob', dob);
      formDataToSend.append('age', age);
      formDataToSend.append('gender', gender);
      formDataToSend.append('qualification', qualification);
      formDataToSend.append('locality', locality);
      formDataToSend.append('bloodGroup', bloodGroup);
      formDataToSend.append('occupation', occupation);
      formDataToSend.append('category', category);
      formDataToSend.append('religion', religion);

      // // Append cropped image as Blob
      // if (profileImage) {
      //   const blob = await fetch(profileImage).then((res) => res.blob());
      //   formDataToSend.append("userUpload", blob, "croppedImage.png");
      // }

      // Append image based on the type (Blob vs string)
      if (!imageSelected) {
        console.log("image", profileImage);

        formDataToSend.append("userImage", profileImage);
      } else {
        // If the profileImage is a Blob or file object (e.g., cropped image), convert it and append
        const blob = await fetch(profileImage).then((res) => res.blob());
        formDataToSend.append("userUpload", blob, "croppedImage.png");
      }



      console.log("formData update", formDataToSend);

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/conference/add-participant/${id}`, {
          method: 'POST',
          body: formDataToSend,
        });

        const data = await response.json();

        if (response.status === 400) {
          alert(data.error); // Show alert if user is already registered
          setIsAlreadyRegistered(true);
        } else {
          alert(data.message);
          setRegisterd(true);
        }
      } catch (error) {
        // Catch any errors that occur during the fetch request
        console.error("Error during submission:", error);
        alert("An error occurred while submitting the form. Please try again.");
      }
    }
  };

  // Function to generate pass
  // const generatePass = async (userEmail, id) => {
  //   if (!userEmail) return; // Skip if no email provided
  //   try {
  //     const response = await fetch(`${process.env.REACT_APP_API_URL}/api/conference/check-registration/${id}?email=${userEmail}`);
  //     const data = await response.json();
  //     if (data.isRegistered) {

  //       setParticipant(data.participant); // Store participant details


  //     } else {
  //       alert('User is not registered for this conference.');
  //     }
  //   } catch (error) {
  //     console.error('Error checking registration:', error);
  //   }
  // };


  // new gen pass

  const generatePass = async (userEmail, id) => {
    if (!userEmail) return; // Skip if no email provided
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/conference/check-registration/${id}?email=${userEmail}`);
      const data = await response.json();
  
      if (data.isRegistered) {
       
        setParticipant(data.participant); // Store participant details
      } else {
        if (data.message === "Participant is not Hindu.") {
          handleError('This conference is only for Hindu participants.');
        } else {
          handleError('User is not registered for this conference.');
        }
      }
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  };

  // Open modal
  const handleInputFocus = () => {
    setShowModal(true);
  };

  const EditMobile = () => {
    // setSavedDataLS(false);
    setPhone('');
    alert("Mobile field is now editable.");
  };

  const renderTooltip = (props, tooltipText) => (
    <Tooltip id="button-tooltip" {...props}>
      {tooltipText}
    </Tooltip>
  );

  // Close modal manually (can be done from inside MobileVerification if needed)
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePhoneNumber = (phoneNumber) => {
    setPhone(phoneNumber);
    setOnVerified(true);
    handleCloseModal();  // Close modal after phone verification
  };

  const handleNext = (e) => {
    e.preventDefault(); // Prevent form submission

    // Check if religion is not selected
    if (!religion) {
      handleWarning("Select your Religion!");
      setErrorR(true)
      return;
    }

    if (!fullName) {
      handleWarning("Full Name is required!");
      setErrorN(true);
      return;
    }

    if (!email) {
      handleWarning("Email is required!");
      setErrorE(true);
      return;
    }

    // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return handleWarning("Please enter a valid email address.");
        }

    if (!phone) {
      handleWarning("Mobile No is required!");
      setError(true);
      return;
    }

    if (!locality) {
      setShowConfirmL(true); // Show confirmation modal
    } else {
      setStep(2); // Proceed to the next step
      //   setComplete(1)
      //   // Store form data in localStorage before proceeding
      //   localStorage.setItem("savedFormData", JSON.stringify(formData));
      //   localStorage.setItem("currentStep", "2"); // Save current step
    }
  };

  // step change
  const handleSettingStep1 = () => {
    setStep(1); // Proceed to the next step
  };

  const handleSettingStep2 = () => {
    setStep(2); // Proceed to the next step
  };

  const handleConfirmYesL = () => {
    setShowConfirmL(false); // Stay on the same page
  };

  const handleConfirmNoL = () => {
    setShowConfirmL(false);
    setStep(2); // Proceed to the next step    
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

  const imagePreview = profileImage ? profileImage : placeholderImage ? placeholderImage : "";

  return (
    <>
      {isAlreadyRegistered ? (
        // JSX to render if isRegistered is true

        <div className='text-center'>
          <h4>Sorry, You have already registered for this conference!</h4>
          <p>You can now proceed to generate your conference pass.</p>
          <Button
            variant="outline-primary"
            id="button-addon2"
            onClick={() => generatePass(email, selectedConference._id)} // Pass function reference
          > Generate Pass</Button>

        </div>

      ) : (
        registerd ? (

          // JSX to render if registration is successful
          <div className="text-center">
            <h4>Thank you, registration for this conference is successful!</h4>
            <p>You can now proceed to generate your conference pass.</p>
            <Button
              variant="outline-primary"
              id="button-addon2"
              onClick={() => generatePass(email, selectedConference._id)} // Pass function reference
            > Generate Pass</Button>

          </div>

        ) : (

          <FormGroup >
            <Card className='py-2 px-3 m-2'>
              <h3 className='text-center'>Register for Conference at <br /> <strong> Venue- {venue} </strong></h3>
              <h6 className='text-center'> {place}, {new Date(date).toLocaleDateString()}</h6>

              <div className='m-1'>
                <ImageUploader onImageUpload={handleImageUpload} defaultImage={imagePreview} />
              </div>
              {step === 1 && (
                <>

                  <Row>
                    <Col sm>
                      <InputGroup className="mb-3" >
                        <InputGroup.Text style={{ fontWeight: "bold" }}>Religion</InputGroup.Text>

                        <Form.Control
                          as="select"
                          aria-label="Religion"
                          value={religion}
                          onChange={(e) => setReligion(e.target.value)}
                          required
                        >
                          <option value="">Select Religion</option>
                          <option value="Hinduism">Hinduism</option>
                          <option value="Christianity">Christianity</option>
                          <option value="Islam">Islam</option>
                        </Form.Control>

                        {errorR ? <OverlayTrigger
                          placement="top"
                          delay={{ show: 250, hide: 400 }}
                          overlay={props => renderTooltip(props, "Select Religion is Mendatory!")}
                        ><InputGroup.Text><BsBracesAsterisk /></InputGroup.Text></OverlayTrigger> : ""}
                      </InputGroup>

                    </Col>
                    <Col sm>
                      <InputGroup className="mb-3" >
                        <InputGroup.Text style={{ fontWeight: "bold" }}>Full Name</InputGroup.Text>
                        <Form.Control aria-label="Full Name" type="text"
                          placeholder="Enter Full Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required />

                        {errorN ? <OverlayTrigger
                          placement="top"
                          delay={{ show: 250, hide: 400 }}
                          overlay={props => renderTooltip(props, "Name is Mendatory!")}
                        ><InputGroup.Text><BsBracesAsterisk /></InputGroup.Text></OverlayTrigger> : ""}
                      </InputGroup>
                    </Col>

                    <Col sm>

                      <InputGroup className="mb-3" >
                        <InputGroup.Text style={{ fontWeight: "bold" }}>Email</InputGroup.Text>
                        <Form.Control aria-label="Email" type="email"
                          placeholder="Enter your Email id"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required />

                        {errorE ? <OverlayTrigger
                          placement="top"
                          delay={{ show: 250, hide: 400 }}
                          overlay={props => renderTooltip(props, "Email is Mendatory!")}
                        ><InputGroup.Text><BsBracesAsterisk /></InputGroup.Text></OverlayTrigger> : ""}

                      </InputGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm>
                      {phone ? (
                        // If mobile exists, render the Mobile number with Verification mark
                        <div className="position-relative mb-3">
                          <PhoneInput
                            name="mobile"
                            placeholder='Enter Phone Number'
                            disabled={onVerified || phone}
                            country={'in'}
                            value={phone}
                            inputProps={{ name: 'mobile' }}
                            className="w-100"
                          />
                          {(onVerified || phone) && (
                            <>
                              <GoVerified
                                className="position-absolute"
                                style={{
                                  right: phone ? 30 : 10,
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  color: "green",
                                }}
                              />

                            </>
                          )}


                          <BiSolidEdit
                            onClick={EditMobile}
                            className="position-absolute"
                            style={{ right: 10, top: "50%", transform: "translateY(-50%)", color: "blue", cursor: 'pointer' }}
                          />

                        </div>

                      ) : (

                        // If mobile does not exist, show the mobile number in InputGroup
                        <InputGroup className="mb-3" onClick={handleInputFocus}>
                          <InputGroup.Text style={{ fontWeight: "bold" }}>Mobile No.</InputGroup.Text>
                          <Form.Control
                            aria-label="Mobile No."
                            type="tel"
                            name="mobile"
                            value={phone}
                            placeholder="Enter your Mobile No"
                            required
                          />
                          {error ? <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={props => renderTooltip(props, "Mobile No is Mendatory, Enter your Mobile No")}
                          ><InputGroup.Text><BsBracesAsterisk /></InputGroup.Text></OverlayTrigger> : ""}
                        </InputGroup>
                      )}
                      {/* <InputGroup className="mb-3" >
                    <InputGroup.Text style={{ fontWeight: "bold" }}>Mobile No.</InputGroup.Text>
                    <Form.Control aria-label="Mobile"
                      type="tel"
                      placeholder="Enter your Mobile No"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required />


                  </InputGroup> */}

                    </Col>
                    <Col sm>
                      <InputGroup className="mb-3" >
                        <InputGroup.Text style={{ fontWeight: "bold" }}>Locality</InputGroup.Text>
                        <Form.Control aria-label="Locality"
                          type="text"
                          placeholder="Enter the street name, colony name, etc."
                          value={locality}
                          onChange={(e) => setlocality(e.target.value)}
                          required />


                      </InputGroup>

                    </Col>
                  </Row>
                  {/* Next Button */}
                  <Row>
                    <Col>
                      <Button className="w-100" onClick={handleNext} variant="primary" type='submit'>
                        Next <GrNext />
                      </Button>
                    </Col>
                  </Row>
                </>
              )}

              {step === 2 && (
                <>
                  <Row>
                    <Col sm>

                      <div className="position-relative mb-3">
                        <InputGroup className="mb-3" >
                          <InputGroup.Text style={{ fontWeight: "bold" }}>DOB</InputGroup.Text>
                          <Form.Control type="date" aria-label="DOB" name="dob" value={dob} onChange={handleDOBChange} required />
                        </InputGroup>

                        {dob && (
                          <Badge
                            className="position-absolute"
                            style={{ right: 40, top: "50%", transform: "translateY(-50%)", color: "white" }}
                          > {age} years</Badge>
                        )}
                      </div>

                    </Col>

                    <Col sm>
                      <div className='bg-light border rounded mb-3'>
                        <InputGroup className="">
                          <InputGroup.Text style={{ fontWeight: 'bold' }}>Gender</InputGroup.Text>
                          <Form.Control
                            as="select"
                            aria-label="Gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </InputGroup>
                      </div>

                    </Col>

                    <Col sm>

                      <InputGroup className="mb-3" >
                        <InputGroup.Text style={{ fontWeight: "bold" }}>Qualification</InputGroup.Text>

                        <Form.Control
                          as="select"
                          aria-label="Qualification"
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                          required
                        >
                          <option value="">Select Qualification</option>
                          <option value="belowTenth">Below Tenth</option>
                          <option value="tenth">Tenth</option>
                          <option value="twelfth">Twelfth</option>
                          <option value="undergraduate">Undergraduate</option>
                          <option value="graduate">Graduate</option>
                          <option value="postgraduate">Postgraduate</option>
                          <option value="other">Other</option>
                        </Form.Control>



                      </InputGroup>
                    </Col>

                  </Row>
                  <Row>
                    <Col sm>

                      <InputGroup className="mb-3" >
                        <InputGroup.Text style={{ fontWeight: "bold" }}>Blood Group</InputGroup.Text>

                        <Form.Control
                          as="select"
                          aria-label="Blood Group"
                          value={bloodGroup}
                          onChange={(e) => setBloodGroup(e.target.value)}
                          required
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </Form.Control>



                      </InputGroup>
                    </Col>


                    <Col sm>

                      <InputGroup className="mb-3">
                        <InputGroup.Text style={{ fontWeight: "bold" }}>Occupation Category</InputGroup.Text>
                        <Form.Control
                          as="select"
                          aria-label="Occupation Category"
                          value={category}
                          onChange={(e) => {
                            setCategory(e.target.value);
                            setOccupation(''); // Reset occupation on category change
                          }}
                          required
                        >
                          <option value="">Select Occupation Category</option>
                          <option value="healthcare">Healthcare</option>
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
                    {category && (
                      <Col sm>
                        <InputGroup className="mb-3">
                          <InputGroup.Text style={{ fontWeight: "bold" }}>Occupation</InputGroup.Text>
                          <Form.Control
                            as="select"
                            aria-label="Occupation"
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                            required
                          >
                            <option value="">Select Occupation</option>
                            {updateOccupationOptions(category).map((occupationOption, index) => (
                              <option key={index} value={occupationOption}>
                                {occupationOption}
                              </option>
                            ))}
                          </Form.Control>
                        </InputGroup>

                      </Col>
                    )}

                  </Row>

                  <Button type="submit" onClick={handleSubmit}>Register</Button>
                </>)}
              <div className='d-flex justify-content-center' style={{ fontSize: "30px" }}>
                <div onClick={handleSettingStep1} style={{ cursor: "pointer" }}> {step === 1 ? (<GoDotFill />) : (<GoDot />)} </div>
                <div onClick={handleSettingStep2} style={{ cursor: "pointer" }}> {step === 2 ? (<GoDotFill />) : (<GoDot />)} </div>


              </div>
            </Card>
          </FormGroup>
        )
      )}

      {participant && (
        <>
          <div style={{ height: "68vh" }}>
            <ConferencePass participant={participant} selectedConference={selectedConference} />

          </div>
        </>
      )}

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
        <Modal.Body> You have not uploaded your photo, which is not mandatory but it is good to have a photo on the conference pass, it helps to identify you. Do you want to upload it?</Modal.Body>
        <Modal.Footer>

          <Button variant="primary" onClick={handleConfirmYes}>Yes</Button>
          <Button variant="secondary" onClick={handleConfirmNo}>No</Button>
        </Modal.Footer>
      </Modal>

      {/* Custom Modal for Confirmation update name */}
      <Modal show={showConfirmL} onHide={handleConfirmNoL} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body> You have not Update Full Name yet. Do you want to Update?</Modal.Body>
        <Modal.Footer>

          <Button variant="primary" onClick={handleConfirmYesL}>Yes</Button>
          <Button variant="secondary" onClick={handleConfirmNoL}>No</Button>
        </Modal.Footer>
      </Modal>


    </>

  );
};

export default RegistrationForm;