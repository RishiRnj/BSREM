


import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation, data } from "react-router-dom";
import { Button, Card, Form, Spinner, ProgressBar, Row, Col } from "react-bootstrap";
import AuthContext from "../../Context/AuthContext";
import { handleError, handleSuccess, handleWarning } from "../../Components/Util";
import { ToastContainer } from "react-toastify";
import { FaEyeSlash, FaEye, FaCamera } from "react-icons/fa";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const Support = () => {
  const { user } = useContext(AuthContext);
  const isAuthenticated = !!user;
  const userId = user?.id;
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  const [formData, setFormData] = useState({
    moreAboutOccupationNew: "",
    fathersName: "",
    applyFor: "",
    //Books
    bookType: "",
    bookName: "",
    bookLanguage: "",
    bookOption: "",
    //Learning Meterial
    learningMaterialType: "",
    learningMaterialQuantity: "",
    // Learning Gadgets
    gadgetType: "",
    gadgetQuantity: "",
    //mentor type
    mentorType: "",
    //medication
    medicineName: "",
    //blood grp
    bloodGroupNeed: "",
    bloodGroupUnitNeed: "",
    //cloth
    clothFor: "",
    clothUnit: "",
    //food
    headCountForFood: "",
    anyChildHungry: "",
    childCountForFood: "",
    //essentials
    essentials: "",
    //fundraising
    fundraising: "",
    areParrentsReceiveGovtAssistance: "",
    expectedAmountOfMoney: "0",
    fundRaised: "",

    descriptionOfNeed: "",
    familyIncome: "",
    familyMembersNumber: "",
    agreedBenificialTerms: "",
    errorMessage: '', // Added for storing error message
  });

  const [warningMessage, setWarningMessage] = useState("");
  const [generalNotice, setGeneralNotice] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [cropperAspectRatio, setCropperAspectRatio] = useState(1);
  const [activeSlot, setActiveSlot] = useState(null);

  const [croppedImages, setCroppedImages] = useState([null, null, null]);
  const cropperRef = useRef(null);
  const requiredLabels = ["Aadhaar Card", "Voter ID Card", "Income Certificate"];
  const requiredprecription = ["Doctor's prescription"];
  const [imagePreviews, setImagePreviews] = useState({});

  const [onPress, setOnPress] = useState(false);
  const [support, setSupport] = useState(false);
  const [status, setShowStatus] = useState(false);

  const [moreInfo, setMoreInfo] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [donations, setDonations] = useState([]);
  const [showBeneData, setShowBeneData] = useState([]);





  // Aspect Ratios for different slots
  const aspectRatios = [8 / 6, 6 / 8, 6 / 8];

  const handleImageChange = (event, label) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);  // Set image for cropping
        setActiveSlot(label);  // Set active label for cropping
        setCropperAspectRatio(aspectRatios[labels.indexOf(label)]); // Set aspect ratio dynamically
      };
      reader.readAsDataURL(file);
    }
  };


  const handleCrop = () => {
    if (cropperRef.current) {
      cropperRef.current.cropper.getCroppedCanvas().toBlob((blob) => {
        const webpImage = new File([blob], `cropped-image-${activeSlot}.webp`, { type: "image/webp" });

        setImagePreviews((prev) => ({
          ...prev,
          [activeSlot]: URL.createObjectURL(webpImage), // Store preview by label
        }));

        setCroppedImages((prev) => ({
          ...prev,
          [activeSlot]: webpImage, // Store cropped file by label
        }));

        setSelectedImage(null);
      }, "image/webp"); // Convert to WEBP
    }
  };


  // Check authentication status and fetch user data
  useEffect(() => {
    if (isAuthenticated && userId) {
      localStorage.removeItem("redirectAfterLogin");
      localStorage.removeItem("redirectAfterUpdate");
      console.log('Fetching data for userId:', userId); // Debugging

      CheckUserProfileBeforeProcced();

      //fetchDoantionData();


    }
  }, [isAuthenticated, userId]);








  const CheckUserProfileBeforeProcced = async () => {
    try {
      setLoading(true);

      console.log("Checking user profile before proceeding...");
      const isProfileUpdated = await checkUserProfile();

      if (!isProfileUpdated) {
        console.warn("Profile is incomplete.");
        const userResponse = window.confirm(
          "Your profile is not updated. Update your profile to proceed. Press OK to update your profile or Cancel to stay here."
        );

        if (userResponse) {
          navigateToProfileUpdate();
        }
        return;
      }


      console.log("Profile is updated. Fetching user data...");
      fetchUserData();
    } catch (error) {
      console.error("Error checking user profile or fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };


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

      // ✅ Return an object with both values
      return userData.isProfileCompleted; // Renamed for consistency

    } catch (error) {
      console.error("Error in checkUserProfile:", error);
      navigate("/forum"); // Redirect to a fallback route if needed
      return false; // Default to false if there's an error
    }
  };


  const navigateToProfileUpdate = () => {
    // Use React Router for navigation
    if (!userId) throw new Error("Missing user authentication details.");
    localStorage.setItem("redirectAfterUpdate", location.pathname);
    navigate(`/user/${userId}/update-profile`);

  };

  const fetchUserData = async () => {
    if (!userId) {
      console.error("User ID is missing. Aborting fetch.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        credentials: 'include',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched user data:", data);
        setUserData(data);
        if (data.moreAboutOccupation) {
          setFormData({
            ...formData,
            moreAboutOccupationNew: data.moreAboutOccupation, // Set the existing data if available
          });
        }

      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => ({ ...prevData, [name]: checked }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

  };

  //handleApplyForChange
  const handleApplyForChange = (e) => {
    const selectedValue = e.target.value;

    setFormData({ ...formData, applyFor: selectedValue });

    // Show a warning if Medical service is selected
    if (["Medications", "Hospital Assistance", "Blood"].includes(selectedValue)) {
      setWarningMessage("⚠️ We are not available for emergency medical services at the moment.");
    } else {
      setWarningMessage(""); // Clear warning if another category is selected
    }
    if (selectedValue.trim() !== "") {
      // Show general notice for all selections
      setGeneralNotice("📢 Please note: Your application will go through scrutiny and verification before assistance is provided or getting live on Donor dashboard");
      setMoreInfo(true);
    } else {
      setGeneralNotice(""); // Clear general notice if no selection is made
      setMoreInfo(false); // Hide description area if no selection
    }


  };

  const handleChange = (e) => {
    const inputText = e.target.value;
    const words = inputText.trim().split(/\s+/); // Split by spaces
    // Check if word count is <= 200 before updating state
    if (words.length <= 10) {
      setFormData((prevData) => ({
        ...prevData,
        descriptionOfNeed: inputText,
        errorMessage: '', // Clear error message when word count is valid

      }));
      setWordCount(words.length);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        errorMessage: 'Word limit exceeded (200 words)', // Set error message
      }));
      setWordCount(words.length);
    }
  };

  const handleMoreAboutChange = (e) => {
    setFormData({ ...formData, moreAboutOccupationNew: e.target.value });
    setError(""); // Clear error when the user types
  };

  const formatFieldName = (field) => {
    // Convert camelCase or snake_case to words with proper capitalization
    return field
      .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
      .replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space between lowercase and uppercase
  };

  const checkBeforeSubmit = async () => {
    try {
      console.log("Checking user profile before proceeding...");
      const isBeneficiary = await checkBeneProfile();

      // If user has already applied for support, navigate to the dashboard
      if (isBeneficiary) {
        console.warn("User has already applied for support.");
        const userResponse = window.confirm(
          "You have already applied for Seeking Support, you can wait for our call or check your Application Status!"
        );

        if (userResponse) {
          navigateToBeneDashboard(); // Navigate to dashboard
          return false; // Prevent form submission
        }
      }

      console.log("Profile is updated. Proceeding to submit user data...");
      return true; // Allow form submission
    } catch (error) {
      console.error("Error checking user profile or fetching user data:", error);
      return false; // Prevent form submission in case of error
    }
  };

  const checkBeneProfile = async () => {
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
      return userData.isBeneficiary; // Return whether the user is a beneficiary
    } catch (error) {
      console.error("Error in checkUserProfile:", error);
      navigate("/forum"); // Redirect to a fallback route if needed
      return false; // Default to false if there's an error
    }
  };

  const navigateToBeneDashboard = () => {
    if (!userId) throw new Error("Missing user authentication details.");
    handleWarning("You have already applied for support");
    navigate("/donate"); // Replace with the actual route of your dashboard
  };

  // Handle submit
  const handleSubmit = async () => {
    // Required fields validation
    const requiredFields = [
      "fathersName",
      "moreAboutOccupationNew",
      "applyFor",
      "familyIncome",
      "familyMembersNumber",
      "agreedBenificialTerms",
      "descriptionOfNeed",
    ];

    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        const formattedField = formatFieldName(field);
        handleError(`${formattedField} is required!`);
        return;
      }
    }

    if (formData.applyFor === "Books") {
      if (!formData.bookType || formData.bookType.trim() === "") {
        handleError('Book type is required!');
        return;
      }
      if (!formData.bookName || formData.bookName.trim() === "") {
        handleError('Book Name is required!');
        return;
      }
      // Check if book language is required based on book type
      if (formData.bookType === "primaryLevel" || formData.bookType === "upperPrimaryLevel" || formData.bookType === "religiousTextsOfSanatan") {
        if (!formData.bookLanguage || formData.bookLanguage.trim() === "") {
          handleError('Book Language is required!');
          return;
        }
      }
      // Check if book option is selected for certain book types
      if (formData.bookType === "primaryLevel" || formData.bookType === "upperPrimaryLevel") {
        if (!formData.bookOption || formData.bookOption.trim() === "") {
          handleError('Please select "Single" or "Complete Set" of Book!');
          return;
        }
      }
    } else if (formData.applyFor === "Learning Material") {
      if (!formData.learningMaterialType || formData.learningMaterialType.trim() === "") {
        handleError('Learning Material Type is required!');
        return;
      }
      if (!formData.learningMaterialQuantity || formData.learningMaterialQuantity.trim() === "") {
        handleError('Learning Material Quantity is required!');
        return;
      }
    } else if (formData.applyFor === "Learning Gadgets") {
      if (!formData.gadgetType || formData.gadgetType.trim() === "") {
        handleError('Gadget Type is required!');
        return;
      }
      if (!formData.gadgetQuantity || formData.gadgetQuantity.trim() === "") {
        handleError('Gadget quantity is required!');
        return;
      }
    } else if (formData.applyFor === "Mentorship") {
      if (!formData.mentorType || formData.mentorType.trim() === "") {
        handleError('Mentorship Subject is required!');
        return;
      }
    } else if (formData.applyFor === "Medications") {
      if (!formData.medicineName || formData.medicineName.trim() === "") {
        handleError('Medication for what? or Medicine name Required!');
        return;
      }
      
      // Required images validation
      if (!imagePreviews["Doctor's prescription"]) {
        handleError("Please upload a Doctor's prescription.");
        return;
      }
    } else if (formData.applyFor === "Blood") {
      if (!formData.bloodGroupNeed || formData.bloodGroupNeed.trim() === "") {
        handleError('Which Blood Gr. you looking for, Required!');
        return;
      }
      if (!formData.bloodGroupUnitNeed || formData.bloodGroupUnitNeed.trim() === "") {
        handleError('Blood unit also Required!');
        return;
      }
    } else if (formData.applyFor === "Clothes for Underprivileged") {
      if (!formData.clothFor || formData.clothFor.trim() === "") {
        handleError('For whom you looking for clothes, Required!');
        return;
      }
      if (!formData.clothUnit || formData.clothUnit.trim() === "") {
        handleError('Cloth unit also Required!');
        return;
      }
    } else if (formData.applyFor === "Food for the Hungry") {
      if (!formData.headCountForFood || formData.headCountForFood.trim() === "") {
        handleError('Number of People is Required!');
        return;
      }
      if (!formData.anyChildHungry || formData.anyChildHungry.trim() === "") {
        handleError('Any Child there? response also Required!');
        return;
      }
      // If there are children, ensure the child count is provided
      if (formData.anyChildHungry === "yes") {
        if (!formData.childCountForFood || formData.childCountForFood.trim() === "") {
          handleError('Number of Child is Required!');
          return;
        }
      }
    } else if (formData.applyFor === "Essentials") {
      if (!formData.essentials || formData.essentials.trim() === "") {
        handleError('Type of Essential Need is Required!');
        return;
      }
    } else if (formData.applyFor === "Fundraising") {
      if (!formData.fundraising || formData.fundraising.trim() === "") {
        handleError('Need Monetory Support in which category is Required!');
        return;
      }
      if (formData.fundraising === "forParrents") {
        if (!formData.areParrentsReceiveGovtAssistance || formData.areParrentsReceiveGovtAssistance.trim() === "") {
          handleError('Are parrents receive any Govt. Assistance? is Required!');
          return;
        }
      }
    }



    // Required images validation
    const requiredLabels = ["Aadhaar Card", "Voter ID Card", "Income Certificate"];
    const missingImages = requiredLabels.filter((label) => !imagePreviews[label]);

    if (missingImages.length > 0) {
      handleError(`Please upload: ${missingImages.join(", ")}`);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const formDataToSend = new FormData();

    // Append existing user data
    Object.keys(userData).forEach((key) => {
      formDataToSend.append(key, userData[key]);
    });

    // Append form fields dynamically
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    // Append cropped images
    Object.keys(croppedImages).forEach((label) => {
      if (croppedImages[label]) {
        formDataToSend.append("images", croppedImages[label]); // Backend should handle multiple files as 'images'
      }
    });

    console.log("Data to send:");
    for (const pair of formDataToSend.entries()) {
      // console.log(pair[0], pair[1]); // Debugging key-value pairs
      console.log(pair[0], pair[1].name || pair[1].size || pair[1]);

    }


    setLoading(true);

    try {
      const shouldProceed = await checkBeforeSubmit();
      if (!shouldProceed) {
        return; // Stop if checkBeforeSubmit returns false
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/beneficiary/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // No Content-Type for FormData
        },
        body: formDataToSend,
      });

      if (response.ok) {
        navigate('/donate');
        console.log("Data and images uploaded successfully!");
      } else {
        console.error("Failed to update data");
      }
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setLoading(false);
    }
  };



  console.log('Fetched userData in Need Support:', userData);


  const labels = ["Aadhaar", "Voter ID", "Income Certificate"];

  const handleShowHide = () => {
    setOnPress(true);
    setSupport(true);
  };

  const fetchDonationData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/donate/donations/${userId}`);
      const data = await response.json();
      setDonations(data.donations);  // Set donation data in state
      console.log("res Dona", data);

    } catch (err) {
      console.error('Error fetching donations:', err);
    }
  }

  const fetchBeneData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/beneficiary/${userId}`);
      const data = await response.json();
      setShowBeneData(data.beneficiary);  // Set beneficiary data in state
      console.log("res", data);

    } catch (err) {
      console.error('Error fetching beneficiary data:', err);
    }
  }

  const handleShowStatus = async () => {
    await fetchDonationData();
    await fetchBeneData();
    setShowStatus(true);
    handleSuccess("status show");
  }




  useEffect(() => {
    console.log("dd", donations);
    console.log("bene", showBeneData);
  }, [donations, showBeneData]); // Logs will only fire when either `donations` or `showBeneData` changes



  const handleSurvey = () => {
    //
  }
  const handleFeedback = () => {
    //
  }




  const [showAddress, setShowAddress] = useState(false);
  // Function to toggle the state
  const displayAddress = () => {
    setShowAddress(!showAddress);
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

 




  return (

    <>

      {!onPress && (
        <div className="d-flex justify-content-center p-4">
          <Button className="m-2 me-3" size="lg" variant="outline-secondary" onClick={handleShowHide}>Apply for Support</Button>
          <Button className="m-2 ms-3" size="lg" variant="outline-info" onClick={handleShowStatus}>Applied! View Status</Button>

        </div>

      )}

      {status && (
        <div className="p-3">


          {showBeneData ? (
            <div className='d-flex justify-content-center flex-column'>
              <Card style={{ width: '100%', maxWidth: '600px', margin: 'auto' }}>
                <Card.Body>
                  {/* Your content goes here */}
                  <div className="">
                    <Row className="mb-3 text-center">
                      <Col>
                        <h5>Beneficiary Data</h5>
                      </Col>
                    </Row>

                    <Row className="mb-2">
                      <Col>
                        <p><strong>Beneficiary Name:</strong></p>
                      </Col>
                      <Col>
                        <p>{showBeneData?.updateFullName}</p>
                      </Col>
                    </Row>

                    <Row className="mb-2">
                      <Col>
                        <p><strong>Email:</strong></p>
                      </Col>
                      <Col>
                        <p>{showBeneData?.email}</p>
                      </Col>
                    </Row>

                    <Row className="mb-2">
                      <Col>
                        <p><strong>Applied For:</strong></p>
                      </Col>
                      <Col>
                        <p>{showBeneData?.applyFor}</p>
                      </Col>
                    </Row>

                    <Row className="mb-2">
                      <Col>
                        <p><strong>Verification Status:</strong></p>
                      </Col>
                      <Col>
                        <p>{showBeneData?.verificationStatus}</p>
                      </Col>
                    </Row>

                    <Row className="mb-2">
                      <Col>
                        <p><strong>Donation Status:</strong></p>
                      </Col>
                      <Col>
                        <p>{showBeneData?.donationStatus}</p>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>


            </div>

          ):(
            <div>
              <p className="text-center"> No Beneficiary Available</p>
            </div>
          )}          

          {donations && (
            <div className='d-flex justify-content-center flex-column' style={{ maxWidth: "100%" }}>
              <h5 className="text-center mb-4">Donations</h5>
              <ul className="list-unstyled d-flex flex-column align-items-center">
                {/* <ul className="list-unstyled d-flex flex-column align-items-center"> */}
                {donations.map((donation) => (
                  <li key={donation._id} className="mb-4">
                    <Card className="w-100 ms-auto" style={{ maxWidth: '550px', margin: 'auto' }}>
                      <Card.Header className="text-center">
                        <strong>{donation.type === 'Blood' ? 'Blood Donation' : 'Donation'}</strong>
                      </Card.Header>
                      <Card.Body>
                        {donation.type === 'Blood' && (
                          <div style={{ width: "400px" }}>
                            <Row className="mb-2">
                              <Col>
                                <p><strong>Blood Donation:</strong></p>
                              </Col>
                              <Col>
                                <p>{donation.bloodUnitsDonated} unit(s)</p>
                              </Col>
                            </Row>
                            <Row className="mb-2">
                              <Col>
                                <p><strong>Donor Name:</strong></p>
                              </Col>
                              <Col>
                                <p>{donation.donor?.updateFullName} </p>
                              </Col>
                            </Row>
                          </div>                         
                        )}
                        {donation.type === 'Mentorship' && (

                          <div style={{ width: "400px" }}>
                            <Row className="mb-2">
                              <Col>
                                <p><strong> Donation Via:</strong></p>
                              </Col>
                              <Col>
                                <p>{donation.donateVia} unit(s)</p>
                              </Col>
                            </Row>
                            <Row className="mb-2">
                              <Col>
                                <p><strong>Donor Name:</strong></p>
                              </Col>
                              <Col>
                                <p>{donation.donor?.updateFullName} </p>
                              </Col>
                            </Row>
                          </div>       
                        )}

                        {( donation.type === 'Books' || donation.type === 'Learning Material' || donation.type === 'Learning Gadgets' || donation.type === 'Medications' ||donation.type === 'Essentials'  || donation.type === 'Clothes for Underprivileged'  || donation.type === 'Food for the Hungry' || donation.type === 'Fundraising'  ) && (
                          <>  <div style={{ width: "400px" }}>
                          <Row className="mb-2">
                            <Col>
                              <p><strong> Donation Via:</strong></p>
                            </Col>
                            <Col>
                              <p>{donation.donateVia}</p>
                            </Col>
                          </Row>
                          {donation.amount && (
                            <Row className="mb-2">
                            <Col>
                              <p><strong>Amount:</strong></p>
                            </Col>
                            <Col>
                              <p>{donation.amount}/- </p>
                            </Col>
                          </Row>

                          )}
                          
                          <Row className="mb-2">
                            <Col>
                              <p><strong>Donor Name:</strong></p>
                            </Col>
                            <Col>
                              <p>{donation.donor?.updateFullName} </p>
                            </Col>
                          </Row>
                        </div>      
                          </>

                        )}

                        
                      </Card.Body>
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          )}


          <div className="d-flex justify-content-center p-4 mb-4">
            <Button className="m-2 me-3" size="lg" variant="outline-secondary" onClick={handleSurvey}>Perticipating Survey </Button>
            <Button className="m-2 ms-3" size="lg" variant="outline-info" onClick={handleFeedback}>Feedback</Button>

          </div>


          <ToastContainer />
        </div>
      )}




      {support && (
        <div className="support-From" style={{ display: "" }}>
          <div >
            <div className="d-flex justify-content-center pt-3">
              <Button className="m-2 ms-3" size="lg" variant="outline-success">Already Applied! View Status</Button>
            </div>

            <div> <h3 className="text-center p-3"> <strong> Information about the Person who need the Support! </strong>  </h3> </div>
          </div>

          <div className="d-flex justify-content-center" >
            <Card className="p-4 shadow-lg" style={{ width: "450px", marginBottom: "80px" }}>
              {/* <Card className="p-4 shadow-lg" style={{ width: "450px", overflow: "auto", maxHeight: `calc(100vh - 165px)`, marginBottom: "80px" }}> */}
              <div className="p-1">
                <div className="d-flex justify-content-center align-items-center mb-2">
                  <div

                    style={{
                      cursor: "pointer", width: "120px", height: "120px", borderRadius: "50%", border: "1px dashed gray", display: "flex", alignItems: "center", justifyContent: "center", backgroundSize: "cover",
                      backgroundPosition: "center", backgroundImage: `url(${userData?.userImage})`
                    }}
                  />
                </div>

                {/* Divider */}
                <div className="d-flex align-items-center ">
                  <hr className="flex-grow-1" />
                </div>

                <Row>
                  <Col>
                    <Form.Label >Email id:</Form.Label>
                    <Form.Control value={userData?.email || ""} readOnly />
                  </Col>

                  <Col>
                    <Form.Label >Name:</Form.Label>
                    <Form.Control value={userData?.updateFullName || userData?.displayName || ""} readOnly />
                  </Col>
                </Row>


                <Row className="mt-3">
                  <Col>
                    <Form.Label >Father's Name:</Form.Label>
                    <Form.Control value={formData.fathersName} type="text" name="fathersName" required placeholder="Enter your Father's name!" autoFocus onChange={handleInputChange}

                    />

                  </Col>

                  <Col>
                    <Form.Label >Mobile Number:</Form.Label>
                    <Form.Control value={`+ ${userData?.mobile}` || ""} readOnly />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col>
                    <Form.Label >Age:</Form.Label>
                    <Form.Control value={userData?.age || ""} readOnly />
                  </Col>

                  <Col>
                    <Form.Label >Blood Grp:</Form.Label>
                    <Form.Control value={userData?.bloodGroup || ""} readOnly />
                  </Col>

                  <Col>
                    <Form.Label >Gender:</Form.Label>
                    <Form.Control value={userData?.gender || ""} readOnly />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col>
                    <Form.Label >Occupation:</Form.Label>
                    <Form.Control value={userData?.occupation || ""} readOnly />
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label title="Please enter or update details about your occupation">More About:</Form.Label>
                      <Form.Control
                        title="Please enter or update details about your occupation"
                        type="text"
                        value={formData.moreAboutOccupationNew}
                        onChange={handleMoreAboutChange}
                        required
                        placeholder="Please enter details about your occupation"
                        isInvalid={!!error} // Highlight field in red if there's an error
                      />
                      <Form.Control.Feedback type="invalid">
                        {error}
                      </Form.Control.Feedback>
                    </Form.Group>

                  </Col>
                </Row>

                <Row className="mt-3">
                  <hr className="flex-grow-1" />
                  <Form.Label className="text-center">Origin:-  {userData?.origin}
                    {/* Toggle the icon based on showAddress state */}
                    {showAddress ? (
                      <FaEye onClick={displayAddress} className="ms-5" />
                    ) : (
                      <FaEyeSlash onClick={displayAddress} className="ms-5" />
                    )}
                  </Form.Label>

                  <hr className="flex-grow-1" />
                </Row>

                {/* Toggle address display */}
                {showAddress && (
                  <div >
                    <Row>
                      <Col>
                        <Form.Label >Village:</Form.Label>
                        <Form.Control value={userData?.address || ""} readOnly />
                      </Col>

                      <Col>
                        <Form.Label >City or Town:</Form.Label>
                        <Form.Control value={userData?.city || ""} readOnly />
                      </Col>

                    </Row>

                    <Row className="mt-3">
                      <Col>
                        <Form.Label >District:</Form.Label>
                        <Form.Control value={userData?.district || ""} readOnly />
                      </Col>

                      <Col>
                        <Form.Label >State:</Form.Label>
                        <Form.Control value={userData?.state || ""} readOnly />
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col>
                        <Form.Label >PIN:</Form.Label>
                        <Form.Control value={userData?.PIN || ""} readOnly />
                      </Col>

                      <Col>
                        <Form.Label >Country:</Form.Label>
                        <Form.Control value={userData?.country || ""} readOnly />
                      </Col>
                    </Row>
                  </div>
                )}

                {/* Divider */}
                <div className="d-flex align-items-center ">
                  <hr className="flex-grow-1" />
                </div>

                <Row >
                  <Col>
                    <Form.Label >What type of Assistance did you apply for?</Form.Label>
                    <Form.Select title="One Request at a time" aria-label="Default select example" onChange={handleApplyForChange} required name="applyFor" value={formData.applyFor}>
                      <option value="" >Select an option in which need Support!</option>

                      <optgroup label="Empower Skill & Knowledge">
                        <option value="Books">Books</option>
                        <option title="Not include any Book" value="Learning Material">Learning Material</option>
                        <option value="Learning Gadgets">Learning Gadgets</option>
                        <option value="Mentorship">Mentorship</option>
                      </optgroup>

                      <optgroup label="Health Care">
                        <option value="Medications">Medications</option>
                        <option value="Hospital Assistance">Hospital Assistance</option>
                        <option value="Blood">Blood</option>
                      </optgroup>

                      <optgroup label="Essential Services">
                        <option value="Clothes for Underprivileged">Clothes for Underprivileged </option>
                        <option value="Food for the Hungry">Food for the Hungry</option>
                        <option title="Whhich providing sustenance and maintaining basic health and sanitation." value="Essentials">Essentials</option>
                      </optgroup>

                      <optgroup label="Community Services">
                        <option value="Volunteering">Volunteering</option>
                      </optgroup>

                      <optgroup label="Monetary support">
                        <option value="Fundraising">Fundraising</option>
                      </optgroup>
                    </Form.Select>

                    {/* Show medical warning message */}
                    {warningMessage && (
                      <div className="alert alert-danger mt-2">
                        {warningMessage}
                      </div>
                    )}

                    {/* Show general notice message */}
                    {generalNotice && (
                      <div className="alert alert-info mt-2">
                        {generalNotice}
                      </div>
                    )}

                    {/* Conditional Rendering for if selected Book */}
                    {["Books"].includes(formData.applyFor) && (
                      <div className="mb-3">
                        <div className="form-group">
                          <label className="mb-2">Book Type</label>
                          <select
                            className="form-select"
                            name="bookType"
                            value={formData.bookType}
                            onChange={(e) => setFormData({ ...formData, bookType: e.target.value })}
                            required
                          >
                            <option value="">Select an Option</option>
                            <option value="primaryLevel">Primary Level</option>
                            <option value="upperPrimaryLevel">Upper Primary Level</option>
                            <option value="forHigherStudies">For Higher Studies</option>
                            <option value="technologyRelated">Technology Related</option>
                            <option value="religiousTextsOfSanatan">Religious texts of Sanatan</option>
                            <option value="relatedToIndianHistoryAndCulture">Related to Indian History and Culture</option>
                          </select>
                        </div>


                        <label className="mb-2 mt-2">
                          Books Name:
                        </label>
                        <textarea
                          className="form-control" name="bookName" value={formData.bookName} onChange={(e) => setFormData({ ...formData, bookName: e.target.value })} rows="1" placeholder={"The name of the book you need."} required={formData.applyFor === "Books"} />

                        {/* Conditional Rendering for if selected primaryLevel & upperPrimaryLevel of Book type based on Language */}
                        {["primaryLevel", "upperPrimaryLevel", "religiousTextsOfSanatan"].includes(formData.bookType) && (
                          <div>
                            <label className="mb-2 mt-2">
                              Language:
                            </label>
                            <textarea
                              className="form-control" name="bookLanguage" value={formData.bookLanguage} onChange={(e) => setFormData({ ...formData, bookLanguage: e.target.value })} rows="1" placeholder={"The name of the book you need."} required={formData.applyFor === "Books"} />
                          </div>
                        )}

                        {/* Conditional Rendering for if selected primaryLevel & upperPrimaryLevel of Book type */}
                        {["primaryLevel", "upperPrimaryLevel"].includes(formData.bookType) && (
                          <div className="mb-3">
                            {['radio'].map((type) => (
                              <div key={`inline-${type}`} className="mb-3 mt-2">
                                <Form.Check
                                  inline
                                  label="Single Book"
                                  name="bookOption"
                                  value="singleBook"
                                  type={type}
                                  id={`inline-${type}-1`}
                                  checked={formData.bookOption === 'singleBook'}
                                  onChange={(e) => setFormData({ ...formData, bookOption: e.target.value })}
                                />
                                <Form.Check
                                  inline
                                  label="Complete Set"
                                  name="bookOption"
                                  value="completeSet"
                                  type={type}
                                  id={`inline-${type}-2`}
                                  checked={formData.bookOption === 'completeSet'}
                                  onChange={(e) => setFormData({ ...formData, bookOption: e.target.value })}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}



                    {/* Conditional Rendering for if selected Learning Material */}
                    {["Learning Material"].includes(formData.applyFor) && (
                      <div className="mb-3">
                        <Row>
                          <Col>
                            <div className="form-group">
                              <label className="mb-2">Type of Learning Material</label>
                              <select
                                className="form-select"
                                name="learningMaterialType"
                                value={formData.learningMaterialType}
                                onChange={(e) => setFormData({ ...formData, learningMaterialType: e.target.value })}
                                required
                              >
                                <option value="">Select an Option</option>
                                <optgroup label="Study Materials">
                                  <option value="">Not Updated</option>
                                </optgroup>


                                <optgroup label="Teaching Aids">
                                  <option value="smartBoards">Smart Boards</option>
                                  <option value="projector">Projector</option>
                                  <option value="interactiveVideos">Interactive Videos</option>
                                </optgroup>

                                <optgroup label="Laboratory Equipment">
                                  <option value="microscopes">Microscopes</option>
                                  <option value="telescope">Telescope</option>
                                </optgroup>

                                <optgroup label="Musical Instruments">
                                  <option value="harmonium">Harmonium</option>
                                  <option value="tabla">Tabla</option>
                                  <option value="guitar">Guitar</option>
                                  <option value="violin">Violin</option>
                                </optgroup>

                                <optgroup label="Brain Boosting Equipment">
                                  <option value="chess">Chess</option>
                                </optgroup>

                                <optgroup label="Physical Education Equipment">
                                  <option value="yogaMats">Yoga Mats</option>
                                  <option value="cricketBat">Cricket Bat</option>
                                  <option value="badmintonRacket">Badminton Racket</option>
                                  <option value="tableTennisRacket">Table Tennis Racket</option>
                                  <option value="ironDumble&Barble">Iron Dumble & Barble</option>
                                </optgroup>


                              </select>
                            </div>
                          </Col>
                          <Col className="col-4">
                            <div className="form-group">
                              <label className="mb-2">Quantity</label>
                              <select
                                className="form-select"
                                name="learningMaterialQuantity"
                                value={formData.learningMaterialQuantity}
                                onChange={(e) => setFormData({ ...formData, learningMaterialQuantity: e.target.value })}
                                required
                              >
                                <option value="">Select an Option</option>
                                <option value="1" >One (1)</option>
                                <option disabled value="2">Two (2)</option>

                              </select>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    )}

                    {/* Conditional Rendering for if selected Learning Gadgets */}
                    {["Learning Gadgets"].includes(formData.applyFor) && (
                      <Row>
                        <Col>
                          <div className="form-group">
                            <label className="mb-2">Gadgets Type</label>
                            <select
                              className="form-select"
                              name="gadgetType"
                              value={formData.gadgetType}
                              onChange={(e) => setFormData({ ...formData, gadgetType: e.target.value })}
                              required
                            >
                              <option value="">Select an Option</option>
                              <option value="smartphone">Smartphone</option>
                              <option value="tablet">Tablet</option>
                              <option value="laptop">Laptop</option>
                              <option value="desktopComputer">Desktop Computer</option>
                              <option value="projector">Projector</option>
                              <option value="kindle">Kindle</option>
                              <option value="reusableNotebook">Reusable Notebook</option>
                              <option value="Printer">Printer</option>
                              <option value="emergencyLamp">Emergency Lamp</option>
                            </select>
                          </div>

                        </Col>
                        <Col className="col-4">
                          <div className="form-group">
                            <label className="mb-2">Quantity</label>
                            <select
                              className="form-select"
                              name="gadgetQuantity"
                              value={formData.gadgetQuantity}
                              onChange={(e) => setFormData({ ...formData, gadgetQuantity: e.target.value })}
                              required
                            >
                              <option value="">Select an Option</option>
                              <option value="1" >One (1)</option>
                              <option disabled value="2">Two (2)</option>

                            </select>
                          </div>
                        </Col>


                      </Row>


                    )}

                    {/* Conditional Rendering for if selected Learning Gadgets */}
                    {["Mentorship"].includes(formData.applyFor) && (
                      <Row>
                        <Col>
                          <div className="form-group">
                            <label className="mb-2">In which subject the need for a Mentor?</label>
                            <select
                              className="form-select"
                              name="mentorType"
                              value={formData.mentorType}
                              onChange={(e) => setFormData({ ...formData, mentorType: e.target.value })}
                              required
                            >
                              <option value="">Select an Option</option>
                              <option value="careerPath">Career Path</option>
                              <option value="higherEducationNavigation">Higher Education Navigation</option>
                              <option value="forChoosingTheRightCourses">For Choosing The Right Courses</option>
                              <option value="educationAndPracticalIndustryRequirements">Education And Practical Industry Requirements</option>
                              <option value="developingSoftSkills">Developing Soft Skills</option>
                              <option value="entrepreneurialSupport">Entrepreneurial Support</option>
                              <option value="technicalSkills">Technical Skills</option>
                              <option value="competitiveExamsPreparation">Competitive Exams Preparation</option>
                              <option value="legalSupport">Legal Support </option>
                            </select>
                          </div>
                        </Col>
                      </Row>
                    )}

                    {/* Conditional Rendering for if selected Medications */}
                    {["Medications"].includes(formData.applyFor) && (
                      <div>
                        <Row>
                          <div>
                            <label className="mb-2 ">
                              Medication for what? or Medicine Name:
                            </label>
                            <textarea
                              className="form-control" name="medicineName" value={formData.medicineName} onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })} rows="1" placeholder={"Medication for what? or Medicine name Required!"} required={formData.applyFor === "Books"} />
                          </div>

                        </Row>
                        <div className="d-flex flex-column align-items-center">
                          <div className="d-flex justify-content-around align-items-center" style={{ gap: "20px" }}>
                            {requiredprecription.map((label, index) => (
                              <div key={index} className="image-upload-container text-center d-flex flex-column align-items-center">
                                {/* Label for each image slot */}
                                <p style={{ marginBottom: "5px", fontWeight: "bold" }}>{label}</p>

                                {/* Image Preview / Placeholder */}
                                <div
                                  onClick={() => document.getElementById(`imageInput${label}`).click()} // Open file picker
                                  style={{
                                    cursor: "pointer",
                                    width: "100px",
                                    height: "120px",
                                    border: "1px dashed gray",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundImage: imagePreviews[label] ? `url(${imagePreviews[label]})` : "none",
                                  }}
                                >
                                  {!imagePreviews[label] && <FaCamera size={24} color="LightGray" />}
                                </div>

                                {/* Hidden File Input */}
                                <input
                                  id={`imageInput${label}`}
                                  type="file"
                                  accept="image/*"
                                  style={{ display: "none" }}
                                  onChange={(event) => handleImageChange(event, label)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Conditional Rendering for if selected Medications */}
                    {["Blood"].includes(formData.applyFor) && (
                      <Row>
                        <Col>
                          <div className="form-group">
                            <label className="mb-2">Blood Group</label>
                            <select
                              className="form-select"
                              name="bloodGroupNeed"
                              value={formData.bloodGroupNeed || ''}
                              onChange={(e) => setFormData({ ...formData, bloodGroupNeed: e.target.value })}
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
                        <Col>
                          <div className="form-group">
                            <label className="mb-2">Unit Needed</label>
                            <select
                              className="form-select"
                              name="bloodGroupUnitNeed"
                              value={formData.bloodGroupUnitNeed || ''}
                              onChange={(e) => setFormData({ ...formData, bloodGroupUnitNeed: e.target.value })}
                              required
                            >
                              <option value="">Select</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                            </select>
                          </div>

                        </Col>
                      </Row>

                    )}

                    {/* Conditional Rendering for if selected Clothes */}
                    {["Clothes for Underprivileged"].includes(formData.applyFor) && (
                      <Row>
                        <Col>
                          <div className="form-group">
                            <label className="mb-2">Cloth/Cloths for</label>
                            <select
                              className="form-select"
                              name="clothFor"
                              value={formData.clothFor || ''}
                              onChange={(e) => setFormData({ ...formData, clothFor: e.target.value })}
                              required
                            >
                              <option value="">Select</option>
                              <option value="boyChild">Boy Child</option>
                              <option value="girlChild">Girl Child</option>
                              <option value="man">Man</option>
                              <option value="woman">Woman</option>
                              <option value="oldMan">Old Man </option>
                              <option value="oldWoman">Old Woman</option>
                            </select>
                          </div>
                        </Col>
                        <Col>
                          <div className="form-group">
                            <label className="mb-2">Unit Needed</label>
                            <select
                              className="form-select"
                              name="clothUnit"
                              value={formData.clothUnit || ''}
                              onChange={(e) => setFormData({ ...formData, clothUnit: e.target.value })}
                              required
                            >
                              <option value="">Select</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                              <option value="5+">5+</option>
                            </select>
                          </div>

                        </Col>
                      </Row>
                    )}

                    {/* Conditional Rendering for if selected Medications */}
                    {["Food for the Hungry"].includes(formData.applyFor) && (

                      <Row>
                        <Col>
                          <div className="form-group">
                            <label className="mb-2">Number of People</label>
                            <select
                              className="form-select"
                              name="headCountForFood"
                              value={formData.headCountForFood || ''}
                              onChange={(e) => setFormData({ ...formData, headCountForFood: e.target.value })}
                              required
                            >
                              <option value="">Select</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                              <option value="5+">5+</option>
                            </select>
                          </div>
                        </Col>
                        <Col>
                          <div className="form-group">
                            <label className="mb-2">Any Child there? </label>
                            <select
                              className="form-select"
                              name="anyChildHungry"
                              value={formData.anyChildHungry || ''}
                              onChange={(e) => setFormData({ ...formData, anyChildHungry: e.target.value })}
                              required
                            >
                              <option value="">Select</option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </select>
                          </div>

                        </Col>
                      </Row>
                    )}

                    {/* Conditional Rendering for if selected Food for the Hungry then if there are child */}
                    {["Food for the Hungry"].includes(formData.applyFor) && (formData.anyChildHungry === "yes") && (
                      <div className="form-group">
                        <label className="mb-2 mt-2">Number of Child</label>
                        <select
                          className="form-select"
                          name="childCountForFood"
                          value={formData.childCountForFood || ''}
                          onChange={(e) => setFormData({ ...formData, childCountForFood: e.target.value })}
                          required
                        >
                          <option value="">Select</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="5+">5+</option>
                        </select>
                      </div>
                    )}

                    {/* Conditional Rendering for if selected Essentials*/}
                    {["Essentials"].includes(formData.applyFor) && (
                      <div className="form-group">
                        <label className="mb-2 ">Type of Need</label>
                        <select
                          className="form-select"
                          name="essentials"
                          value={formData.essentials || ''}
                          onChange={(e) => setFormData({ ...formData, essentials: e.target.value })}
                          required
                        >
                          <option value="">Select</option>
                          <option value="cleanWater">Clean Water</option>
                          <option value="sanitation">Sanitation</option>
                          <option value="shelter">Shelter</option>
                          <option value="education">Quality Education</option>
                          <option value="employment">Employment</option>

                        </select>
                      </div>
                    )}


                    {/* Conditional Rendering for if selected Medications */}
                    {/*{["Volunteering"].includes(formData.applyFor) && (
                      
                    )}

                    
                    {/* Conditional Rendering for if selected Fundraising */}
                    {["Fundraising"].includes(formData.applyFor) && (
                      <div className="form-group">
                        <label className="mb-2 ">Need Monetory Support for?</label>
                        <select
                          className="form-select"
                          name="fundraising"
                          value={formData.fundraising || ''}
                          onChange={(e) => setFormData({ ...formData, fundraising: e.target.value })}
                          required
                        >
                          <option value="">Select</option>
                          <option value="For the Birth or Raising of 2nd or 3rd Child">For the Birth or Raising of 2nd or 3rd Child</option>
                          <option value="For the Wedding of Daughter or Sister">For the Wedding of Daughter or Sister</option>
                          <option value="forParrents">Elderly parents who have no one to take care of them</option>

                        </select>
                      </div>

                    )}

                    {["forParrents"].includes(formData.fundraising) && (
                      <div className="form-group">
                        <label className="mb-2 mt-2">Do they receive any Govt. Assistance?</label>
                        <select
                          className="form-select"
                          name="areParrentsReceiveGovtAssistance"
                          value={formData.areParrentsReceiveGovtAssistance || ''}
                          onChange={(e) => setFormData({ ...formData, areParrentsReceiveGovtAssistance: e.target.value })}
                          required
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    )}

                  </Col>
                </Row>

                {
                
                moreInfo && (
                  <Row>
                    <Form.Group className="mb-3 mt-2" controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Describe your need</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="descriptionOfNeed"
                        title="Add a meaningful description of 10 words!"
                        placeholder="Add a description of 10 words so that verifiers and donors can easily understand your needs."
                        rows={2}
                        value={formData.descriptionOfNeed}
                        required
                        onChange={handleChange}
                        maxLength={2000} // Optional: you can set a maxLength to restrict characters as well
                      />
                      <div className="d-flex">
                        <div className="me-3">
                          <Form.Text className="text-muted">
                            {wordCount} / 10 words
                          </Form.Text>

                        </div>

                        {formData.errorMessage && (
                          <div>
                            <Form.Text className="text-danger ms-auto">{formData.errorMessage}</Form.Text>
                          </div>
                        )}
                      </div>
                    </Form.Group>
                  </Row>
                )}

                <Row className="mt-3 family-row">
                  <Col>
                    <Form.Label >Family Income</Form.Label>
                    <Form.Select aria-label="Default select example" onChange={handleInputChange} required name="familyIncome">
                      <option value={formData.familyIncome}>Select an Suitable Option!</option>
                      <option value="Below 10k Per Month">Below 10k Per Month</option>
                      <option value="Above 10k Per Month">Above 10k Per Month</option>
                      <option value="Above 15k Per Month">Above 15k Per Month</option>
                      <option value="Above 20k Per Month">Above 20k Per Month</option>
                    </Form.Select>

                  </Col>

                  <Col className="cl-2">
                    <Form.Label >No. of family Members</Form.Label>
                    <Form.Select aria-label="Default select example" onChange={handleInputChange} required name="familyMembersNumber">
                      <option value={formData.familyMembersNumber}>Select an Option!</option>
                      <option value="Below 2">Below 2</option>
                      <option value="3-5">3-5</option>
                      <option value="5-10">5-10</option>
                      <option value="Above 10">Above 10</option>
                    </Form.Select>

                  </Col>
                </Row>


                {/* Divider */}
                <div className="d-flex align-items-center ">
                  <hr className="flex-grow-1" /> <p className="text-center" style={{ marginTop: "15px", fontWeight: "bold", fontStyle: "italic" }}> Supporting Documents </p> <hr className="flex-grow-1" />
                </div>


                {/* Image sec of supporting docs */}
                <div className="d-flex justify-content-around align-items-center ">
                  <div className="d-flex flex-column align-items-center">
                    <div className="d-flex justify-content-around align-items-center" style={{ gap: "20px" }}>
                      {requiredLabels.map((label, index) => (
                        <div key={index} className="image-upload-container text-center d-flex flex-column align-items-center">
                          {/* Label for each image slot */}
                          <p style={{ marginBottom: "5px", fontWeight: "bold" }}>{label}</p>

                          {/* Image Preview / Placeholder */}
                          <div
                            onClick={() => document.getElementById(`imageInput${label}`).click()} // Open file picker
                            style={{
                              cursor: "pointer",
                              width: "100px",
                              height: "120px",
                              border: "1px dashed gray",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundImage: imagePreviews[label] ? `url(${imagePreviews[label]})` : "none",
                            }}
                          >
                            {!imagePreviews[label] && <FaCamera size={24} color="LightGray" />}
                          </div>

                          {/* Hidden File Input */}
                          <input
                            id={`imageInput${label}`}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(event) => handleImageChange(event, label)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>


                  {/* Modal for Cropping */}
                  {selectedImage && (
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
                          src={selectedImage}
                          style={{ width: "100%", height: "auto" }}
                          initialAspectRatio={cropperAspectRatio}
                          aspectRatio={cropperAspectRatio}
                          guides={false}
                          background={true}
                          rotatable={true}
                          dragMode="move"
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
                            onClick={() => setSelectedImage(null)}
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


                <div className="form-check mt-3 mb-3 d-flex justify-content-center align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    name="agreedBenificialTerms"
                    required
                    onChange={handleInputChange} />

                  <label className="form-check-label-support">
                    I sincerely declare that the information I have provided is true. And I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>
                  </label>
                </div>


              </div>
              <Button onClick={handleSubmit} className="mt-3" variant="primary">
                Apply
              </Button>

            </Card>
            <ToastContainer />
          </div>
        </div>
      )}


    </>


  )
}

export default Support