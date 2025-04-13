import React, { useEffect, useState, useRef } from 'react'
import { Row, Col, InputGroup, Badge, Card, Form, Button, FormText } from 'react-bootstrap'
import { GiSave } from "react-icons/gi";
import { handleError, handleSuccess, handleWarning } from '../../Components/Util';
import { GrNext } from "react-icons/gr";
import FormInputGroup from '../../Components/Common/FormInputGroup';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import ConfirmationModal from '../../Components/Common/ConfirmationModal';
import { FaEyeSlash, FaEye, FaCamera } from "react-icons/fa";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import LoadingSpinner from '../../Components/Common/LoadingSpinner';



const SupportStep2 = ({ onStepTwoCompleted }) => {
    const [userData, setUserData] = useState({

        applyingForWhom: "",
        whoIam: "",
        fathersName: "",
        organisation: "",

        familyIncome: "",
        familyMembersNumber: "",

        beneficiaryName: "",
        benaficiaryFathersName: "",
        benaficiaryDOB: "",
        benaficiaryAGE: "",
        benaficiaryGender: "",
        beneficiaryAddress: "",
        beneficiaryDistrict: "",
        beneficiaryPIN: "",
        beneficiaryState: "",
        selectedOthersState: "",
        beneficiaryMobile: "",
        benaficiaryOccupation: "",

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
        mentorArena: "",
        numberOfMentee: "",
        //medication
        medicineName: "",

        //blood grp
        bloodGroupNeed: "",
        bloodGroupUnitNeed: "",
        bloodNeedDate: "",

        //cloth
        clothFor: "",
        clothUnit: "",

        //food
        headCountForFood: "",
        anyChildHungry: "",
        childCountForFood: "",

        //essentials       
        qualification: "",
        qualificationDetails: "",
        expectedSalary: "",
        expectedJobRole: "",
        expectedJobRoleR: "",



        //fundraising
        fundraising: "",
        areParrentsReceiveGovtAssistance: "",
        expectedAmountOfMoney: "0",
        fundRaised: "",

        descriptionOfNeed: "",
        agreedBenificialTerms: "",
        errorMessage: '', // Added for storing error message

    });
    const [formError, setFormError] = useState({});
    const [valid, setValid] = useState(false);

    const [error, setError] = useState(null);
    const [errorM, setErrorM] = useState(null);

    const [errorT, setErrorT] = useState(null);
    const [loading, setLoading] = useState(false);

    const [selectedImage, setSelectedImage] = useState(null);
    const [cropperAspectRatio, setCropperAspectRatio] = useState(1);
    const [activeSlot, setActiveSlot] = useState(null);
    const [croppedImages, setCroppedImages] = useState([null, null, null]);
    const cropperRef = useRef(null);
    const requiredLabels = ["Aadhaar Card", "Voter ID Card", "Income Certificate"];
    const requiredprecription = ["Doctor's Prescription"];
    const beneficiaryImage = ["Beneficiary's Image"];
    const [imagePreviews, setImagePreviews] = useState({});
    const [wordCount, setWordCount] = useState(0);

    const [showMSG, setShowMSG] = useState(false)
    const [showWmsg, setShowWmsg] = useState(false)
    const [warningMessage, setWarningMessage] = useState("");
    const [generalNotice, setGeneralNotice] = useState("");
    const [step, setStep] = useState(1);



    // Aspect Ratios for different slots
    const aspectRatios = [8 / 6, 6 / 8, 6 / 8];

    const labels = ["Aadhaar", "Voter ID", "Income Certificate"];

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

    const handleChange = (e) => {
        if (e) {
            const { name, value, type, checked } = e.target;
            if (type === "checkbox") {
                setUserData((prevData) => ({ ...prevData, [name]: checked }));
                setErrorT(null);
            } else if (name === "benaficiaryDOB") {
                setUserData((prevData) => ({ ...prevData, benaficiaryDOB: value, benaficiaryAGE: calculateAge(value) }));

            }
            else {
                setUserData((prevData) => ({ ...prevData, [name]: value }));
                console.log("Lpgddd", userData);

            }
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

    const handleChangeT = (e) => {
        const inputText = e.target.value;
        const words = inputText.trim().split(/\s+/); // Split by spaces

        // Update the word count
        setWordCount(words.length);

        // Check if word count is <= 200 before updating state
        if (words.length <= 6) {
            setUserData((prevData) => ({
                ...prevData,
                descriptionOfNeed: inputText,
                errorMessage: '', // Clear error message when word count is valid
            }));
        } else {
            setUserData((prevData) => ({
                ...prevData,
                errorMessage: 'Word limit exceeded (6 words)', // Set error message
            }));
        }
    };

    //handleApplyForChange
    const handleApplyForChange = (e) => {
        const selectedValue = e.target.value;

        setUserData({ ...userData, applyFor: selectedValue });
        // Show a warning if Medical service is selected
        if (["Medications", "Hospital Assistance", "Blood"].includes(selectedValue)) {
            setWarningMessage("We are not available for 🏥 Emergency Medical services at the moment. However, we will make every effort to assist you even if it is delayed. Blood 🩸 and Medication 💊 will be available as soon as possible if a donor is available.");
            setShowWmsg(true);
        } else {
            setWarningMessage(""); // Clear warning if another category is selected
            setShowWmsg(false)
        }
        if (["Books", "Learning Material", "Learning Gadgets", "Mentorship", "Clothes for Underprivileged", "Food for the Hungry", "Quality Education", "Shelter", "Volunteering", "Fundraising"].includes(selectedValue)) {
            // Show general notice for all selections
            setGeneralNotice("Please note: Your application will go through scrutiny and verification before assistance is provided or getting live on Donor dashboard");
            setShowMSG(true)
        } else {
            setGeneralNotice(""); // Clear general notice if no selection is made
            setShowMSG(false)

        }
    };



    const validatePhoneNumber = (phone, countryCode) => {
        console.log('Validating phone:', phone, 'Country code:', countryCode);

        // Ensure phone number starts with '+'
        if (!phone.startsWith('+')) {
            phone = `+${phone}`;
        }

        // Parse the phone number with country code as region (e.g., "IN" for India)
        const phoneNumber = parsePhoneNumberFromString(phone);

        console.log('Parsed phone number:', phoneNumber);

        // Ensure the number is valid and has the correct length
        return phoneNumber?.isValid() && phoneNumber?.nationalNumber.length >= 10;
    };

    const handleMobileChange = (e, value = null, countryCode = null, isPhoneInput = false) => {
        if (isPhoneInput) {
            // Only validate when input is complete (onBlur or when country changes)
            const isValid = validatePhoneNumber(value, countryCode);

            if (isValid) {
                console.log('Phone number is valid:', value);
                setUserData(prev => ({ ...prev, beneficiaryMobile: value }));

                setFormError(prev => ({ ...prev, beneficiaryMobile: 'Valid' }));
                setValid(true)
            } else {
                setFormError(prev => ({ ...prev, beneficiaryMobile: 'Invalid' }));
            }
        }
    }

    // Handle Step 1 to Step 2 or Step 3 depends on selection
    const handleNext = (e) => {
        e.preventDefault(); // Prevent form submission

        // Validate the "applyingForWhom" field
        if (!userData.applyingForWhom) {
            handleWarning("Please select, for whom you are applying for?");
            return;
        }

        // Additional validation for "for someone who needs help"
        if (userData.applyingForWhom === "for someone who needs help") {
            // Ensure the "I am" field is selected
            if (!userData.whoIam) {
                handleWarning("Please select your identity (individual or organization).");
                return;
            }

            // If the user belongs to an organization, ensure the Organization Name is filled
            if (userData.whoIam === "belong to an Organization" && !userData.organisation) {
                handleWarning("Please enter the organization's name.");
                return;
            }

            // Proceed to Step 2 for "for someone who needs help"
            setStep(2);
        }
        // If the user is applying for themselves (i.e., "For me")
        else if (userData.applyingForWhom === "For me") {

            if (!userData.fathersName) {
                handleWarning("Please enter your father's name.");
                return;
            }
            if (!userData.familyIncome) {
                handleWarning("Please Select an Income Option");
                return;
            }
            if (!userData.familyMembersNumber) {
                handleWarning("Please Select an option of Family members ");
                return;
            }
            // Proceed to Step 3 for "For me"
            setStep(3);
        }
    };

    // Handle Step 2 to Step 3
    const handleNext1 = (e) => {
        e.preventDefault(); // Prevent form submission


        if (userData.applyingForWhom === "for someone who needs help") {

            // Validation for Step 2 (Beneficiary Details)
            if (!userData.beneficiaryName) {
                handleWarning("Please enter the beneficiary's name.");
                return;
            }
            if (!userData.benaficiaryFathersName) {
                handleWarning("Please enter the beneficiary father's name.");
                return;
            }
            if (!userData.familyIncome) {
                handleWarning("Please Select an Income Option");
                return;
            }
            if (!userData.familyMembersNumber) {
                handleWarning("Please Select an option of Family members ");
                return;
            }
            if (!userData.beneficiaryMobile) {
                handleWarning("Please enter the beneficiary Mobile.");
                return;
            }

            if (!userData.beneficiaryAddress) {
                handleWarning("Please enter the beneficiary's address.");
                return;
            }
            if (!userData.beneficiaryDistrict) {
                handleWarning("Please enter the beneficiary's district.");
                return;
            }
            if (!userData.beneficiaryPIN) {
                handleWarning("Please enter the beneficiary's PIN.");
                return;
            }

            if (!userData.beneficiaryState) {
                handleWarning("Please select the beneficiary's state.");
                return;
            }
            if (userData.beneficiaryState === "Others" && !userData.selectedOthersState) {
                handleWarning("Please mention the beneficiary's state.");
                return;
            }
            // Required images validation
            if (!imagePreviews["Beneficiary's Image"]) {
                handleError("Please upload a Beneficiary's Image");
                return;
            }

            // If no validation errors, proceed to the next step
            setStep(3); // Proceed to Step 3
        }
    };

    const handleNext2 = (e) => {
        if (userData.applyFor === "Books") {
            if (!userData.bookType || userData.bookType.trim() === "") {
                handleError('Book type is required!');
                return;
            }
            // Check if book language is required based on book type
            if (userData.bookType === "Primary Level" || userData.bookType === "Upper Primary Level" || userData.bookType === "Religious Texts Of Sanatan") {
                if (!userData.bookLanguage || userData.bookLanguage.trim() === "") {
                    handleError('Book Language is required!');
                    return;
                }
            }
            // Check if book name is required based on book type
            if (!userData.bookName || userData.bookName.trim() === "") {
                handleError('Book Name is required!');
                return;
            }

            // Check if book option is selected for certain book types
            if (userData.bookType === "Primary Level" || userData.bookType === "Upper Primary Level") {
                if (!userData.bookOption || userData.bookOption.trim() === "") {
                    handleError('Please select "Single" or "Complete Set" of Book!');
                    return;
                }
            }
        } else if (userData.applyFor === "Learning Material") {
            if (!userData.learningMaterialType || userData.learningMaterialType.trim() === "") {
                handleError('Learning Material Type is required!');
                return;
            }
            if (!userData.learningMaterialQuantity || userData.learningMaterialQuantity.trim() === "") {
                handleError('Learning Material Quantity is required!');
                return;
            }
        } else if (userData.applyFor === "Learning Gadgets") {
            if (!userData.gadgetType || userData.gadgetType.trim() === "") {
                handleError('Gadget Type is required!');
                return;
            }
            if (!userData.gadgetQuantity || userData.gadgetQuantity.trim() === "") {
                handleError('Gadget quantity is required!');
                return;
            }
        } else if (userData.applyFor === "Mentorship") {
            if (!userData.mentorType || userData.mentorType.trim() === "") {
                handleError('Mentorship Subject is required!');
                return;
            }
            if (!userData.mentorType || userData.mentorArena.trim() === "") {
                handleError('Choose any platform, online or offline, for Mentorship.!');
                return;
            }
            if (!userData.numberOfMentee || userData.numberOfMentee.trim() === "") {
                handleError('Choose Single or Grouped!');
                return;
            }
        } else if (userData.applyFor === "Medications") {
            if (!userData.medicineName || userData.medicineName.trim() === "") {
                handleError('Medication for what? or Medicine name Required!');
                return;
            }

            // Required images validation
            if (!imagePreviews["Doctor's Prescription"]) {
                handleError("Please upload a Doctor's prescription.");
                return;
            }
        } else if (userData.applyFor === "Blood") {
            if (!userData.bloodGroupNeed || userData.bloodGroupNeed.trim() === "") {
                handleError('Which Blood Gr. you looking for, Required!');
                return;
            }
            if (!userData.bloodGroupUnitNeed || userData.bloodGroupUnitNeed.trim() === "") {
                handleError('Blood unit also Required!');
                return;
            }
        } else if (userData.applyFor === "Clothes for Underprivileged") {
            if (!userData.clothFor || userData.clothFor.trim() === "") {
                handleError('For whom you looking for clothes, Required!');
                return;
            }
            if (!userData.clothUnit || userData.clothUnit.trim() === "") {
                handleError('Number of Cloths also Required!');
                return;
            }
        } else if (userData.applyFor === "Food for the Hungry") {
            if (!userData.headCountForFood || userData.headCountForFood.trim() === "") {
                handleError('Number of People is Required!');
                return;
            }
            if (!userData.anyChildHungry || userData.anyChildHungry.trim() === "") {
                handleError('Any Child there? response also Required!');
                return;
            }
            // If there are children, ensure the child count is provided
            if (userData.anyChildHungry === "Yes") {
                if (!userData.childCountForFood || userData.childCountForFood.trim() === "") {
                    handleError('Number of Child is Required!');
                    return;
                }
            }
        } else if (userData.applyFor === "Employment") {
            if (!userData.qualification || userData.qualification.trim() === "") {
                handleError('Select Qualification, it is Required!');
                return;
            }
            if (userData.qualification && userData.qualification.trim() === "Other") {
                if (!userData.qualificationDetails) {
                    handleError('You select Other Qualification, Enter Qualification details, it is Required!');
                    return;
                }
            }

            if (!userData.expectedSalary || userData.expectedSalary.trim() === "") {
                handleError('Select Expected Salary, it is Required!');
                return;
            }
            if (!userData.expectedJobRole || userData.expectedJobRole.trim() === "") {
                handleError('Select a Job Role, it is Required!');
                return;
            }

            if (userData.expectedJobRole && userData.expectedJobRole.trim() === "Others") {
                if (!userData.expectedJobRoleR) {
                    handleError('You select Others Job Role, Enter Job Role, it is Required!');
                    return;
                }
            }

        } else if (userData.applyFor === "Fundraising") {
            if (!userData.fundraising || userData.fundraising.trim() === "") {
                handleError('Need Monetory Support in which category is Required!');
                return;
            }
            if (userData.fundraising === "Elderly parents who have no one to take care of them") {
                if (!userData.areParrentsReceiveGovtAssistance || userData.areParrentsReceiveGovtAssistance.trim() === "") {
                    handleError('Are parrents receive any Govt. Assistance? is Required!');
                    return;
                }
            }
        }

        if (!userData.descriptionOfNeed) {
            handleError('Describe need in a 6 words sentence!');
            return;

        }

        setStep(4)
    }

    const handleSubmit = async () => {


        // Required images validation
        const requiredLabels = ["Aadhaar Card", "Voter ID Card", "Income Certificate"];
        const missingImages = requiredLabels.filter((label) => !imagePreviews[label]);


        if (missingImages.length > 0) {
            handleError(`Please upload: ${missingImages.join(", ")}`);
            return;
        }

        if (userData.applyingForWhom === "for someone who needs help") {
            // Required images validation
            if (!imagePreviews["Beneficiary's Image"]) {
                handleError("Please upload a Beneficiary's Image");
                return;
            }
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('formData', JSON.stringify(userData)); // Add form data


        // Append cropped images
        Object.keys(croppedImages).forEach((label) => {
            if (croppedImages[label]) {
                formDataToSend.append("images", croppedImages[label]); // Backend should handle multiple files as 'images'
            }
        });

        console.log("form data before", formDataToSend);
        setLoading(true);
        try {
            // const shouldProceed = await checkBeforeSubmit();
            // if (!shouldProceed) {
            //   return; // Stop if checkBeforeSubmit returns false
            // }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/beneficiary/create`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // No Content-Type for FormData
                },
                body: formDataToSend,
            });

            if (response.ok) {
                //   navigate('/donate');
                onStepTwoCompleted(true);
                handleSuccess("Beneficiary registration Successfull")
                console.log("Data and images uploaded successfully!");
            } else {
                console.error("Failed to update data");
            }
        } catch (error) {
            console.error("Error updating data:", error);
        } finally {
            setLoading(false);
        }




    }


    const InputField = ({ label, name, value, onChange, error, placeholder, type = "text", options, optionGroup, disabled, disabledOptions = [] }) => (
        <Col md={6} className="mb-2">
            <InputGroup>
                <InputGroup.Text id="basic-addon1" style={{ fontWeight: "bold" }}>{label}</InputGroup.Text>
                {options || optionGroup ? (
                    <Form.Control as="select" name={name} value={value} required onChange={onChange}>
                        <option value="">Select</option>
                        {/* Check if there's an optionGroup */}
                        {optionGroup ? (
                            <>
                                {optionGroup.map((group, idx) => (
                                    <optgroup key={idx} label={group.label}>
                                        {group.options.map((option, optionIdx) => (
                                            <option key={optionIdx} value={option}
                                                disabled={disabledOptions.includes(option)} // Disable option if it's in the disabledOptions array
                                            >
                                                {option}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </>
                        ) : (
                            options.map((option, idx) => (
                                <option key={idx} value={option} disabled={disabledOptions.includes(option)} // Disable option if it's in the disabledOptions array
                                >{option}</option>
                            ))
                        )}
                    </Form.Control>
                ) : (
                    <Form.Control
                        type={type}
                        placeholder={placeholder}
                        name={name}
                        value={value}
                        required
                        onChange={onChange}
                    />
                )}
            </InputGroup>
            {error && <div className='text-center'><Badge bg="danger">{error}</Badge></div>}
        </Col>
    );


    if (loading) {
        return <LoadingSpinner />;
    }



    return (
        <div className='pt-2'  >

            <Card className="px-2 m-2 shadow-sm" style={{ borderRadius: "10px" }}>
                <Card.Body>

                    {step === 1 && (
                        <>
                            <Card.Title className="text-center">Provide more Info about you</Card.Title>
                            <Row>
                                {/* Apply For */}
                                <InputField
                                    label="I would like to apply for:"
                                    name="applyingForWhom"
                                    value={userData.applyingForWhom}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setErrorM(null);
                                    }}
                                    error={errorM}
                                    options={["For me", "for someone who needs help"]}
                                />

                                {/* Father's Name (For me) */}
                                {userData.applyingForWhom === "For me" && (
                                    <>
                                        <FormInputGroup
                                            label="Father's Name"
                                            placeholder="Father's Name"
                                            name="fathersName"
                                            value={userData.fathersName}
                                            required
                                            error={error}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setError(null);
                                            }}
                                        />

                                        <InputField
                                            label={"Your Family Income"}
                                            name="familyIncome"
                                            value={userData.familyIncome}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setError(null);
                                            }}
                                            error={error}
                                            options={["Below 10k Per Month", "Above 10k Per Month", "Above 15k Per Month", "Below 20k Per Month"]}
                                            disabledOptions={[""]} // Disable the "Two" option
                                        />
                                        <InputField
                                            label={"No. of Members in Your Family"}
                                            name="familyMembersNumber"
                                            value={userData.familyMembersNumber}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setError(null);
                                            }}
                                            error={error}
                                            options={["Below 3", "Below 5", "5 to 10", "Below 10", "Above 10"]}
                                            disabledOptions={[""]} // Disable the "Two" option
                                        />
                                    </>
                                )}

                                {/* I am (For someone who needs help) individual or org */}
                                {userData.applyingForWhom === "for someone who needs help" && (
                                    <InputField
                                        label="I am:"
                                        name="whoIam"
                                        value={userData.whoIam}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setErrorM(null);
                                        }}
                                        error={errorM}
                                        options={["an Individual", "belong to an Organization"]}
                                    />
                                )}

                                {/* Organization Name and Beneficiary Name (For someone who needs help -> Organization) */}
                                {userData.applyingForWhom === "for someone who needs help" && userData.whoIam === "belong to an Organization" && (
                                    <>
                                        <FormInputGroup
                                            label="Organization's Name"
                                            type='text'
                                            name="organisation"
                                            value={userData.organisation}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setError(null);
                                            }}

                                            placeholder="Organization's Name"
                                        />
                                    </>
                                )}

                                <div className='d-flex justify-content-center'>
                                    <Button className="w-80" onClick={handleNext} variant="primary" type='submit'>
                                        Next <GrNext />
                                    </Button>
                                </div>

                            </Row>
                        </>

                    )}


                    {step === 2 && (
                        <>
                            <Card.Title className="text-center">Beneficiary Details</Card.Title>
                            <div className="d-flex flex-column align-items-center mb-2">
                                <div className="d-flex justify-content-around align-items-center" style={{ gap: "20px" }}>
                                    {beneficiaryImage.map((label, index) => (
                                        <div key={index} className="image-upload-container text-center d-flex flex-column align-items-center">
                                            {/* Label for each image slot */}
                                            {/* <p style={{ marginBottom: "5px", fontWeight: "bold" }}>{label}</p> */}

                                            {/* Image Preview / Placeholder */}
                                            <div
                                                onClick={() => document.getElementById(`imageInput${label}`).click()} // Open file picker
                                                style={{
                                                    cursor: "pointer",
                                                    width: "100px",
                                                    height: "100px",
                                                    border: "1px dashed gray",
                                                    borderRadius: "50px",
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
                                            {/* Label for each image slot */}
                                            <p style={{ marginBottom: "5px", fontWeight: "bold" }}>{label}</p>

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
                            <Row className='mb-5'>
                                <FormInputGroup
                                    label="Beneficiary's Name"
                                    type='text'
                                    name="beneficiaryName"
                                    value={userData.beneficiaryName}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setError(null);
                                    }}
                                    error={error}
                                    placeholder="Beneficiary's Name"
                                />
                                <FormInputGroup
                                    label="Father's Name"
                                    type='text'
                                    name="benaficiaryFathersName"
                                    value={userData.benaficiaryFathersName}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setError(null);
                                    }}
                                    error={error}
                                    placeholder="Beneficiary's Father's Name"
                                />

                                <InputField
                                    label={"Beneficiary Gender"}
                                    name="benaficiaryGender"
                                    value={userData.benaficiaryGender}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setError(null);
                                    }}
                                    error={error}
                                    options={["Male", "Female", "Other"]}
                                    disabledOptions={[""]} // Disable the "Two" option
                                />

                                <Col md={6}>
                                    <div className="position-relative mb-2">
                                        <InputGroup className="mb-2" >
                                            <InputGroup.Text style={{ fontWeight: "bold" }}>Date of Birth</InputGroup.Text>
                                            <Form.Control type="date" name="benaficiaryDOB" value={userData.benaficiaryDOB} onChange={handleChange} required />
                                        </InputGroup>

                                        {userData.benaficiaryDOB && (
                                            <Badge
                                                className="position-absolute"
                                                style={{ right: 40, top: "50%", transform: "translateY(-50%)", color: "white" }}
                                            > {userData.benaficiaryAGE} years</Badge>
                                        )}
                                    </div>
                                </Col>

                                <InputField
                                    label={"Beneficiary Family Income"}
                                    name="familyIncome"
                                    value={userData.familyIncome}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setError(null);
                                    }}
                                    error={error}
                                    options={["Below 10k Per Month", "Above 10k Per Month", "Above 15k Per Month", "Below 20k Per Month"]}
                                    disabledOptions={[""]} // Disable the "Two" option
                                />
                                <InputField
                                    label={"No. of Members in Beneficiary Family"}
                                    name="familyMembersNumber"
                                    value={userData.familyMembersNumber}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setError(null);
                                    }}
                                    error={error}
                                    options={["Below 3", "Below 5", "5 to 10", "Below 10", "Above 10"]}
                                    disabledOptions={[""]} // Disable the "Two" option
                                />


                                <Col md={6} className='mb-2'>
                                    <div className="position-relative bg-light">
                                        <PhoneInput
                                            name="beneficiaryMobile"
                                            placeholder='Beneficiary Mobile No.'
                                            country={'in'}  // Default country code (India in this case)
                                            value={userData.beneficiaryMobile}
                                            onChange={(value, data) => handleMobileChange(null, value, data.countryCode, true)}  // Passing countryCode
                                            inputProps={{ name: 'beneficiaryMobile' }}
                                            inputStyle={{ width: '100%', borderRadius: '5px', position: 'relative' }}
                                        />
                                        {/* Display validation message based on the current form error */}
                                        {formError.beneficiaryMobile && (
                                            <div
                                                className="position-absolute"
                                                style={{
                                                    right: 10,
                                                    top: "50%",
                                                    transform: "translateY(-50%)",
                                                    color: formError.beneficiaryMobile === 'Valid' ? 'green' : 'red'
                                                }}
                                            >
                                                {formError.beneficiaryMobile === 'Valid' ? 'Valid' : 'Invalid phone number'}
                                            </div>
                                        )}
                                    </div>
                                </Col>

                                {valid && (
                                    <ConfirmationModal
                                        isOpen={valid}
                                        onClose={() => { setValid(false) }}
                                        onConfirm={() => { setValid(false) }}
                                        title="Mobile Number Status"
                                        message={`We not varified Your provided Mobile no which is + ${userData.beneficiaryMobile}. We just validate this as Country code + 10 digit. Be sure you entered a correct Number.`}
                                        confirmText="I Understand"
                                        cancelText="Cencel"
                                    />
                                )}
                                <FormInputGroup
                                    label="Address"
                                    type='text'
                                    name="beneficiaryAddress"
                                    value={userData.beneficiaryAddress}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setError(null);
                                    }}
                                    error={error}
                                    placeholder="Beneficiary Address, Locality, City"
                                />

                                <FormInputGroup
                                    label="District"
                                    type='text'
                                    name="beneficiaryDistrict"
                                    value={userData.beneficiaryDistrict}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setError(null);
                                    }}
                                    error={error}
                                    placeholder="Beneficiary District Name"
                                />

                                <FormInputGroup
                                    label="PIN"
                                    type='number'
                                    name="beneficiaryPIN"
                                    value={userData.beneficiaryPIN}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setError(null);
                                    }}
                                    error={error}
                                    placeholder="Beneficiary PIN"
                                />

                                <InputField
                                    label="State"
                                    name="beneficiaryState"
                                    value={userData.beneficiaryState}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setError(null);
                                    }}
                                    error={error}
                                    options={[
                                        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal",
                                        "Dharamshala", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Nagpur", "Manipur", "Meghalaya",
                                        "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
                                        "Uttar Pradesh", "Uttarakhand", "Dehradun", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
                                        "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Jammu", "Ladakh", "Kargil",
                                        "Lakshadweep", "Puducherry", "Others"
                                    ]}
                                />

                                {userData.beneficiaryState === "Others" && (
                                    <FormInputGroup
                                        label="State & Country"
                                        type='text'
                                        name="selectedOthersState"
                                        value={userData.selectedOthersState}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setError(null);
                                        }}
                                        error={error}
                                        placeholder="Mention beneficiary State & Country"
                                    />


                                )}

                                <div className='d-flex justify-content-center'>
                                    <Button className="w-80" onClick={handleNext1} variant="primary" type='submit'>
                                        Next <GrNext />
                                    </Button>
                                </div>

                            </Row>
                        </>

                    )}

                    {step === 3 && (
                        <Row className='mb-5'>
                            <Card.Title className="text-center">Support Details</Card.Title>

                            <InputField
                                label="Assistance you are applying for:"
                                name="applyFor"
                                value={userData.applyFor}
                                onChange={(e) => {
                                    handleApplyForChange(e);
                                    setError(null);
                                }}
                                error={error}
                                optionGroup={[
                                    { label: "Empower Skill & Knowledge", options: ["Books", "Learning Material", "Learning Gadgets", "Mentorship"] },
                                    { label: "Health Care", options: ["Medications", "Hospital Assistance", "Blood"] },
                                    { label: "Essential Services", options: ["Clothes for Underprivileged", "Food for the Hungry", "Quality Education", "Shelter", "Employment"] },
                                    { label: "Community Services", options: ["Volunteering"] },
                                    { label: "Monetary support", options: ["Fundraising"] },
                                ]}

                                disabledOptions={["Hospital Assistance"]} // Disable the "Two" option
                            />

                            {/* Conditional Rendering for if selected Books */}
                            {["Books"].includes(userData.applyFor) && (
                                <>
                                    <InputField
                                        label="Book Type"
                                        name="bookType"
                                        value={userData.bookType}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setError(null);
                                        }}
                                        error={error}
                                        options={[
                                            "Primary Level", "Upper Primary Level", "for Higher Studies", "Technology Related",
                                            "Religious Texts Of Sanatan", "Related To Indian History And Culture"
                                        ]}
                                    />
                                    {/* Conditional Rendering for if selected primaryLevel & upperPrimaryLevel of Book type based on Language */}
                                    {["Primary Level", "Upper Primary Level", "Religious Texts Of Sanatan"].includes(userData.bookType) && (
                                        <InputField
                                            label="Book Language"
                                            name="bookLanguage"
                                            value={userData.bookLanguage}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setError(null);
                                            }}
                                            error={error}
                                            options={[
                                                "Sanskrit", "Hindi", "Bengali", "Gujarati", "Marathi", "Tamil", "Telugu", "Kannada", "Malayalam",
                                                "Punjabi", "Odia", "Assamese", "Maithili", "Rajasthani", "Sindhi", "Konkani", "Tulu", "Nepali", "Bodo"
                                            ]}
                                        />
                                    )}


                                    <FormInputGroup
                                        label="Books Name:"
                                        type='text'
                                        name="bookName"
                                        value={userData.bookName}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setError(null);
                                        }}
                                        error={error}
                                        placeholder="The name of the book you need"
                                    />

                                    {["Primary Level", "Upper Primary Level"].includes(userData.bookType) && (
                                        <InputField
                                            label="Number of Books"
                                            name="bookOption"
                                            value={userData.bookOption}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setError(null);
                                            }}
                                            error={error}
                                            options={[
                                                "Single Book", "Complete Set"
                                            ]}
                                        />

                                    )}


                                </>
                            )}

                            {/* Conditional Rendering for if selected Learning Material */}
                            {["Learning Material"].includes(userData.applyFor) && (
                                <>
                                    <InputField
                                        label="Type of Learning Material:"
                                        name="learningMaterialType"
                                        value={userData.learningMaterialType}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setError(null);
                                        }}
                                        error={error}
                                        optionGroup={[
                                            { label: "Study Materials", options: ["Not Updated"] },
                                            { label: "Teaching Aids", options: ["Smart Boards", "Projector"] },
                                            { label: "Laboratory Equipment", options: ["Microscopes", "Telescope"] },
                                            { label: "Musical Instruments", options: ["Harmonium", "Tabla", "Guitar", "Violin"] },
                                            { label: "Brain Boosting Equipment", options: ["Chess"] },
                                            { label: "Physical Education Equipment", options: ["Yoga Mats", "Cricket Bat", "Badminton Racket", "Table Tennis Racket", "Exercise Equipments"] },
                                        ]}
                                    />

                                    <InputField
                                        label="Quantity of Material"
                                        name="learningMaterialQuantity"
                                        value={userData.learningMaterialQuantity}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setError(null);
                                        }}
                                        error={error}
                                        options={[
                                            "1", "2"
                                        ]}
                                        disabledOptions={["2"]} // Disable the "Two" option
                                    />
                                </>

                            )}

                            {/* Conditional Rendering for if selected Learning Gadgets */}
                            {["Learning Gadgets"].includes(userData.applyFor) && (
                                <>
                                    <InputField
                                        label="Gadgets Type"
                                        name="gadgetType"
                                        value={userData.gadgetType}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setError(null);
                                        }}
                                        error={error}
                                        options={[
                                            "Smartphone", "Tablet", "Laptop", "Desktop Computer", "Projector", "Kindle", "Reusable Notebook", "Printer", "Emergency Lamp"
                                        ]}
                                        disabledOptions={[""]} // Disable the "Two" option
                                    />

                                    <InputField
                                        label="Quantity of Learning Gadgets"
                                        name="gadgetQuantity"
                                        value={userData.gadgetQuantity}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setError(null);
                                        }}
                                        error={error}
                                        options={[
                                            "1", "2"
                                        ]}
                                        disabledOptions={["2"]} // Disable the "Two" option
                                    />
                                </>

                            )}

                            {/* Conditional Rendering for if selected Learning Gadgets */}
                            {["Mentorship"].includes(userData.applyFor) && (
                                <>
                                    <InputField
                                        label="The Subject for Mentoring?"
                                        name="mentorType"
                                        value={userData.mentorType}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setError(null);
                                        }}
                                        error={error}
                                        options={[
                                            "Career Path", "Higher Education Navigation", "For Choosing The Right Courses", "Education And Practical Industry Requirements",
                                            "Developing Soft Skills", "Entrepreneurial Support", "Technical Skills", "Competitive Exams Preparation", "Legal Support"
                                        ]}
                                        disabledOptions={[""]} // Disable the "Two" option
                                    />
                                    <InputField
                                        label="Choose any platform to seek Advice"
                                        name="mentorArena"
                                        value={userData.mentorArena}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setError(null);
                                        }}
                                        error={error}
                                        options={[
                                            "Online", "Offline"
                                        ]}
                                        disabledOptions={[""]} // Disable the "Two" option
                                    />
                                    <InputField
                                        label="Number of Mentee"
                                        name="numberOfMentee"
                                        value={userData.numberOfMentee}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setError(null);
                                        }}
                                        error={error}
                                        options={[
                                            "One (Single)", "Two to Five (Group)", "Five to Ten (Group)"
                                        ]}
                                        disabledOptions={[""]} // Disable the "Two" option
                                    />
                                </>

                            )}

                            {/* Conditional Rendering for if selected Medications */}
                            {["Medications"].includes(userData.applyFor) && (
                                <>
                                    <FormInputGroup
                                        label="Medication for what?"
                                        type='text'
                                        name="medicineName"
                                        value={userData.medicineName}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setError(null);
                                        }}
                                        error={error}
                                        placeholder="or Medicine Name:"
                                    />

                                    <div className="d-flex flex-column align-items-center mb-2">
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
                                                            width: "180px",
                                                            height: "220px",
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


                                </>

                            )}

                            {/* Conditional Rendering for if selected Blood */}
                            {["Blood"].includes(userData.applyFor) && (
                                <>

                                    <InputField
                                        label="Required Blood Group"
                                        name="bloodGroupNeed"
                                        value={userData.bloodGroupNeed}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setError(null);
                                        }}
                                        error={error}
                                        options={[
                                            "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"
                                        ]}
                                        disabledOptions={[""]} // Disable the "Two" option
                                    />
                                    <InputField
                                        label="Required Blood Unit"
                                        name="bloodGroupUnitNeed"
                                        value={userData.bloodGroupUnitNeed}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setError(null);
                                        }}
                                        error={error}
                                        options={[
                                            "1", "2", "3"
                                        ]}
                                        disabledOptions={[""]} // Disable the "Two" option
                                    />

                                    <FormInputGroup
                                        label="Expected date of need?"
                                        type='date'
                                        name="bloodNeedDate"
                                        value={userData.bloodNeedDate}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setError(null);
                                        }}
                                        error={error}
                                        placeholder=""
                                    />

                                </>
                            )}

                            {/* Conditional Rendering for if selected Clothes */}
                            {["Clothes for Underprivileged"].includes(userData.applyFor) && (
                                <>
                                    <InputField
                                        label="Cloth/Cloths for:"
                                        name="clothFor"
                                        value={userData.clothFor}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setError(null);
                                        }}
                                        error={error}
                                        options={[
                                            "Boy Child", "Girl Child", "Man", "Woman", "Old Man", "Old Women"
                                        ]}
                                        disabledOptions={[""]} // Disable the "Two" option
                                    />

                                    <InputField
                                        label="Number of clothes needed"
                                        name="clothUnit"
                                        value={userData.clothUnit}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setError(null);
                                        }}
                                        error={error}
                                        options={[
                                            "1", "2", "3", "4", "5", "5+"
                                        ]}
                                        disabledOptions={[""]} // Disable the "Two" option
                                    />
                                </>

                            )}

                            {/* Conditional Rendering for if selected Food */}
                            {["Food for the Hungry"].includes(userData.applyFor) && (
                                <>
                                    <InputField
                                        label="Number of people who need food"
                                        name="headCountForFood"
                                        value={userData.headCountForFood}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setError(null);
                                        }}
                                        error={error}
                                        options={[
                                            "1", "2", "3", "4", "5", "5+"
                                        ]}
                                        disabledOptions={[""]} // Disable the "Two" option
                                    />

                                    <InputField
                                        label="Any Child there who need nutrition?"
                                        name="anyChildHungry"
                                        value={userData.anyChildHungry}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setError(null);
                                        }}
                                        error={error}
                                        options={[
                                            "Yes", "No"
                                        ]}
                                        disabledOptions={[""]} // Disable the "Two" option

                                    />
                                    {userData.anyChildHungry === "Yes" && (
                                        <InputField
                                            label="Number of Child"
                                            name="childCountForFood"
                                            value={userData.childCountForFood}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setError(null);
                                            }}
                                            error={error}
                                            options={[
                                                "1", "2", "3", "4", "5", "5+"
                                            ]}
                                            disabledOptions={[""]} // Disable the "Two" option
                                        />
                                    )}
                                </>
                            )}

                            {/* Conditional Rendering for if selected Employment */}
                            {["Employment"].includes(userData.applyFor) && (
                                <>
                                    <InputField
                                        label="Qualification"
                                        name="qualification"
                                        value={userData.qualification}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setError(null);
                                        }}
                                        error={error}
                                        options={[
                                            "Below Secondary", "Secondary (10th)", "Higher Secondary (12th)", "Undergraduate", "Graduate", "Postgraduate", "Other"
                                        ]}
                                        disabledOptions={[""]} // Disable the "Two" option
                                    />
                                    {userData.qualification === "Other" && (
                                        <FormInputGroup
                                            label="Qualification Details"
                                            type='text'
                                            name="qualificationDetails"
                                            value={userData.qualificationDetails}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setError(null);
                                            }}
                                            error={error}
                                            placeholder="Enter Qualification Details"
                                        />
                                    )}

                                    <InputField
                                        label="Expected Salary"
                                        name="expectedSalary"
                                        value={userData.expectedSalary}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setError(null);
                                        }}
                                        error={error}
                                        options={[
                                            "₹ 3,000/- to  ₹ 5,000/-", "₹ 5,000/- to ₹ 10,000/-", "₹ 10,000/- to ₹ 15,000/-"
                                        ]}
                                        disabledOptions={[""]} // Disable the "Two" option
                                    />

                                    <InputField
                                        label="What kind of job are you looking for?"
                                        name="expectedJobRole"
                                        value={userData.expectedJobRole}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setError(null);
                                        }}
                                        error={error}
                                        optionGroup={[
                                            { label: "Health Care", options: ["Doctor's assistant", "Pathology Lab Assistant", "Caregiver", "Yoga Instructor", "Therapist"] },
                                            { label: "Technology", options: ["Web Developer", "Projector"] },
                                            { label: "Education", options: ["Home Tutor", "Private School Teacher", "Non-Teaching Stuff"] },
                                            { label: "Legal", options: ["Accountant", "Paralegal",] },
                                            { label: "Creative", options: ["Yoga Mats", "Cricket Bat", "Badminton Racket", "Table Tennis Racket", "Exercise Equipments"] },
                                            { label: "Service", options: ["Chef", "Bartender", "Waiter", "Event Planner", "Public Relations", "Hairdresser", "Shopkeeper", "Housekeeper"] },
                                            { label: "Skilled Trades", options: ["Plumber", "Electrician", "Mechanic", "Construction Worker", "Driver"] },
                                            { label: "Others", options: ["Others"] },
                                        ]}
                                    />

                                    {userData.expectedJobRole === "Others" && (
                                        <FormInputGroup
                                            label="Job, you looking for?"
                                            type='text'
                                            name="expectedJobRoleR"
                                            value={userData.expectedJobRoleR}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setError(null);
                                            }}
                                            error={error}
                                            placeholder="What kind of job are you looking for?"
                                        />
                                    )}




                                </>


                            )}

                            {/* Conditional Rendering for if selected Fundraising */}
                            {["Fundraising"].includes(userData.applyFor) && (
                                <>
                                    <InputField
                                        label="Need Monetory Support for?"
                                        name="fundraising"
                                        value={userData.fundraising}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setError(null);
                                        }}
                                        error={error}
                                        options={[
                                            "For the Birth or Raising of 2nd or 3rd Child", "For the Wedding of Daughter or Sister", "Elderly parents who have no one to take care of them", "For the treatment of incurable diseases"
                                        ]}
                                        disabledOptions={[""]} // Disable the "Two" option
                                    />

                                    {/* Conditional Rendering for if selected Fundraising */}
                                    {["Elderly parents who have no one to take care of them"].includes(userData.fundraising) && (
                                        <InputField
                                            label="Do they receive any Govt. Assistance?"
                                            name="areParrentsReceiveGovtAssistance"
                                            value={userData.areParrentsReceiveGovtAssistance}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setError(null);
                                            }}
                                            error={error}
                                            options={[
                                                "Yes", "No"
                                            ]}
                                            disabledOptions={[""]} // Disable the "Two" option
                                        />

                                    )}
                                </>

                            )}

                            <Col md={6} className="mb-2">
                                <InputGroup  >
                                    <InputGroup.Text style={{ fontWeight: 'bold' }}>Describe your need</InputGroup.Text>

                                    <Form.Control
                                        as="textarea"
                                        name="descriptionOfNeed"
                                        title="Add a meaningful description in a 6 words sentence!"
                                        placeholder="Add a description of 6 word sentece so that verifiers and donors can easily understand your needs."
                                        rows={2}
                                        value={userData.descriptionOfNeed}
                                        required
                                        onChange={handleChangeT}

                                    />

                                </InputGroup>
                                <div className="d-flex justify-content-end">
                                    <div className="me-3">
                                        <FormText className="text-muted">
                                            {wordCount} / 6 words
                                        </FormText>

                                    </div>

                                    {userData.errorMessage && (
                                        <div>
                                            <FormText className="text-danger ms-auto">{userData.errorMessage}</FormText>
                                        </div>
                                    )}
                                </div>
                            </Col>

                            <div className='d-flex justify-content-center'>
                                <Button className="w-80" onClick={handleNext2} variant="primary" type='submit'>
                                    Next <GrNext />
                                </Button>
                            </div>

                        </Row>
                    )}

                    {step === 4 && (
                        <Row>
                            <Card.Title className="text-center">Upload Image of Supporting Documents</Card.Title>
                            <>
                                {/* Divider */}
                                <div className="d-flex align-items-center ">
                                    <hr className="flex-grow-1" /> <p className="text-center" style={{ marginTop: "15px", fontWeight: "bold", fontStyle: "italic" }}> Supporting Documents </p> <hr className="flex-grow-1" />
                                </div>


                                {/* Image sec of supporting docs */}
                                <div className="d-flex justify-content-around align-items-center ">
                                    <div className="d-flex flex-row align-items-center">
                                        <div className="d-flex justify-content-around align-items-center" style={{ gap: "20px" }}>
                                            {requiredLabels.map((label, index) => (
                                                <div key={index} className="image-upload-container text-center d-flex flex-column align-items-center">


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

                                                        {/* Camera btn */}
                                                        {!imagePreviews[label] && <FaCamera size={24} color="LightGray" />}
                                                    </div>

                                                    {/* Label for each image slot */}
                                                    <p style={{ marginBottom: "5px", marginTop: "10px", fontWeight: "bold" }}>{label}</p>



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





                                <div className="form-check mt-3 mb-3 d-flex justify-content-center align-items-center">
                                    <input
                                        type="checkbox"
                                        className="form-check-input me-2"
                                        name="agreedBenificialTerms"
                                        required
                                        onChange={handleChange} />

                                    <label className="form-check-label-support">
                                        I sincerely declare that the information I have provided is true. And I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>
                                    </label>
                                </div>

                                <Button onClick={handleSubmit} className="mt-3" variant="primary">
                                    Apply
                                </Button>
                            </>

                        </Row>

                    )}

                </Card.Body>
            </Card>
            {/* Show medical warning message */}
            {showWmsg && warningMessage && (
                <ConfirmationModal
                    isOpen={showWmsg}
                    onClose={() => { setShowWmsg(false) }}
                    onConfirm={() => { setShowWmsg(false) }}
                    title="⚠️ Caution "
                    message={warningMessage}
                    confirmText="I Understand"
                    cancelText="Cencel"
                />
            )}

            {/* Show general notice message */}
            {generalNotice && showMSG && (
                // <div className="alert alert-info px-3">
                //     {generalNotice}
                // </div>
                <ConfirmationModal
                    isOpen={showMSG}
                    onClose={() => { setShowMSG(false) }}
                    onConfirm={() => { setShowMSG(false) }}
                    title="📢 Disclaimer"
                    message={generalNotice}
                    confirmText="I Understand"
                    cancelText="Cencel"
                />
            )}

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
    )
}

export default SupportStep2