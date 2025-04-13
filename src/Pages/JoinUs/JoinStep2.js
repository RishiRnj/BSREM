import React, { useEffect, useState } from 'react'
import { Row, Col, InputGroup, Badge, Card, Form } from 'react-bootstrap'
import { GiSave } from "react-icons/gi";
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess, handleWarning } from '../../Components/Util';

const JoinStep2 = ({ onStepTwoCompleted }) => {
    const [userData, setUserData] = useState({
        fathersName: "",
        maritalStatus: "",
        spouseName: "",
        partnerName: "",
        haveAnyChild: "",
        numberOfChildren: "",
        joiningFor: "",
        qualification: "",
        giveAterJoin: "",
        agreedVolunteerTerms: false,
    });
    const [error, setError] = useState(null);
    const [errorM, setErrorM] = useState(null);
    const [errorS, setErrorS] = useState(null);
    const [errorP, setErrorP] = useState(null);
    const [errorC, setErrorC] = useState(null);
    const [errorNC, setErrorNC] = useState(null);
    const [errorJ, setErrorJ] = useState(null);
    const [errorQ, setErrorQ] = useState(null);
    const [errorCAJ, setErrorCAJ] = useState(null);
    const [errorT, setErrorT] = useState(null);
    const [loading, setLoading] = useState(false);





    const handleChange = (e) => {
        if (e) {
            const { name, value, type, checked } = e.target;
            if (type === "checkbox") {
                setUserData((prevData) => ({ ...prevData, [name]: checked }));
                setErrorT(null);
            }
            else {
                setUserData((prevData) => ({ ...prevData, [name]: value }));
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!userData.fathersName) {
            handleWarning("Please Enter your father's name.");
            setError("Enter your father's name!");
            return;
        }
        if (!userData.maritalStatus) {
            handleWarning("Please select your marital status.");
            setErrorM("Select One!");
            return;
        }
        if (userData.maritalStatus === "Married" && !userData.spouseName) {
            handleWarning("Please enter your spouse's name.");
            setErrorS("Enter your spouse's name!");
            return;
        }
        if (userData.maritalStatus === "Living common law" && !userData.partnerName) {
            handleWarning("Please enter your partner's name.");
            setErrorP("Enter your partner's name!")
            return;
        }
        if (userData.maritalStatus !== "Single" && userData.haveAnyChild === "") {
            handleWarning("Please select if you have any children.");
            setErrorC("Select One!!")
            return;
        }
        if (userData.haveAnyChild === "Yes" && !userData.numberOfChildren) {
            handleWarning("Please select the number of children you have.");
            setErrorNC("Select number of children!!")
            return;
        }
        if (!userData.joiningFor) {
            handleWarning("Please select your reason for joining.");
            setErrorJ("Select any One!")
            return;
        }
        if (!userData.qualification) {
            handleWarning("Please select your qualification.");
            setErrorQ("Select any One!")
            return;
        }
        if (!userData.giveAterJoin) {
            handleWarning("Please select how you will contribute after joining.");
            setErrorCAJ("Select any One!")
            return;
        }
        if (!userData.agreedVolunteerTerms) {
            handleWarning("Please agree to the terms and conditions before proceeding.");
            setErrorT("Please check to agree the terms and conditions for proceeding!.")
        }

        setLoading(true)
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Please log in to access this page.");
            }
            console.log("userdata", userData);
            
        
            // Instead of using FormData, we'll send the userData directly as JSON
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/new/volunteer`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json", // Ensuring the server expects JSON
                },
                body: JSON.stringify(userData), // Directly sending the JSON data
            });
        
            if (response.ok) {
                const data = await response.json();
                console.log("Server Response:", data);        
                // Assuming data.joinData is what you want to store in localStorage
                // localStorage.setItem("volunteer", JSON.stringify(data.joinData));
                
                handleSuccess("Profile update successful!");
                onStepTwoCompleted(true); // Pass the userData to the parent component
                // navigate('/joinUs/volunteer');
            } else {
                const errorData = await response.json();
                handleError(`Update failed: ${errorData.message || "Please try again."}`);
            }
        } catch (error) {
            console.error("Error occurred:", error);
            handleError(`Something went wrong: ${error.message}`);
        }
         finally {
            setLoading(false)
        }       
    }

    const validStatuses = ["Married", "Divorced", "Living common law", "Widowed", "Separated"];

    const maritalStatuses = {
        Married: "Your Spouse Name",
        "Living common law": "Your Partner name:"
    };
    const maritalStatusKey = maritalStatuses[userData.maritalStatus];


    return (
        <div className='pt-2'  >
            <Card className='px-3 m-2 shadow-sm' style={{ borderRadius: "10px" }}>

                <Card.Body>
                    <Card.Title className='text-center' >Provide more Info about you</Card.Title>
                    <Row>
                        <Col md={6} className='mb-2'>
                            <InputGroup className="">
                                <InputGroup.Text id="basic-addon1" style={{ fontWeight: "bold" }}>Father's Name</InputGroup.Text>
                                <input type="text" className="form-control" placeholder="Father's Name" aria-label="Father's Name" aria-describedby="basic-addon1" name="fathersName"
                                    value={userData.fathersName} required
                                    onChange={(e) => {
                                        handleChange(e);
                                        setError(null);
                                    }}
                                />

                            </InputGroup>
                            {error && <div className='text-center'>  <Badge bg="danger" className="">{error}</Badge> </div>}
                        </Col>

                        <Col md={6} className='mb-2'>
                            <InputGroup className="">
                                <InputGroup.Text id="basic-addon1" style={{ fontWeight: "bold" }}>Marital Status</InputGroup.Text>
                                <Form.Control as="select" aria-label="Marital Status" name="maritalStatus"
                                    value={userData.maritalStatus} required
                                    onChange={(e) => {
                                        handleChange(e);
                                        setErrorM(null);
                                    }}
                                >
                                    <option value="">Select</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                    <option value="Separated">Separated</option>
                                    <option value="Living common law">Living common law</option>
                                </Form.Control>
                                {errorM && <div className='text-center' >  <Badge style={{ height: "40px" }} bg="danger" className="pt-2">{errorM}</Badge> </div>}
                            </InputGroup>

                        </Col>
                    </Row>

                    <Row>
                        {maritalStatusKey && (
                            <Col sm className="mb-2">
                                <InputGroup >
                                    <InputGroup.Text id="basic-addon1" style={{ fontWeight: "bold" }}>
                                        {maritalStatusKey}
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="text"
                                        placeholder={maritalStatusKey}
                                        aria-label={maritalStatusKey}
                                        aria-describedby="basic-addon1"
                                        required={maritalStatusKey !== undefined}
                                        name={userData.maritalStatus === "Married" ? "spouseName" : "partnerName"}
                                        value={userData.maritalStatus === "Married" ? userData.spouseName : userData.partnerName}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setErrorS(null);
                                            setErrorP(null);
                                        }}
                                        autoFocus
                                    />
                                </InputGroup>
                                {userData.maritalStatus === "Married" ? (
                                    errorS && <div className='text-center'>  <Badge bg="danger" className="">{errorS}</Badge> </div>) : (
                                    errorP && <div className='text-center'>  <Badge bg="danger" className="">{errorP}</Badge> </div>)}
                            </Col>
                        )}

                        {validStatuses.includes(userData.maritalStatus) && (
                            <Col sm className='mb-2'>
                                <InputGroup className="border rounded border-1">
                                    <InputGroup.Text style={{ fontWeight: 'bold' }}>Do you have any children?</InputGroup.Text>
                                    <Form.Control
                                        as="select" // Corrected type to 'select' for dropdown
                                        name="haveAnyChild"
                                        value={userData.haveAnyChild}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setErrorC(null);

                                        }}
                                        required={validStatuses.includes(userData.maritalStatus)}
                                        aria-label="Have Any Child"
                                    >
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </Form.Control>
                                    {errorC && <div className='text-center' >  <Badge style={{ height: "40px" }} bg="danger" className="pt-2">{errorC}</Badge> </div>}
                                </InputGroup>

                            </Col>
                        )}


                        {/* Conditional Rendering for number of children */}
                        {userData.haveAnyChild === "Yes" && userData.maritalStatus !== "Single" && userData.maritalStatus !== "" && (
                            <Col sm className='mb-2'>
                                <InputGroup className="">
                                    <InputGroup.Text id="basic-addon1" style={{ fontWeight: "bold" }}>How many children do you have?</InputGroup.Text>
                                    <Form.Control as="select" aria-label="Marital Status" name="numberOfChildren"
                                        value={userData.numberOfChildren} required={userData.haveAnyChild === "Yes"} onChange={(e) => {
                                            handleChange(e);
                                            setErrorNC(null);

                                        }}
                                    >
                                        <option value="">Select</option>
                                        <option value="One">One</option>
                                        <option value="Two">Two</option>
                                        <option value="Three">Three</option>
                                        <option value="≥ Four">≥ Four</option>

                                        <Form.Control.Feedback type="invalid">Please select a value.</Form.Control.Feedback>
                                    </Form.Control>

                                </InputGroup>
                                {errorNC && (<div className='text-center'>  <Badge bg="danger" className="">{errorNC}</Badge> </div>)}
                            </Col>
                        )}
                    </Row>

                    <Row>
                        <Col sm className='mb-2'>
                            <InputGroup className="">
                                <InputGroup.Text id="basic-addon1" style={{ fontWeight: "bold" }}>Joining For</InputGroup.Text>
                                <Form.Control as="select" aria-label="Joining For" name="joiningFor"
                                    value={userData.joiningFor} required
                                    onChange={(e) => {
                                        handleChange(e);
                                        setErrorJ(null);

                                    }}
                                >
                                    <option value="">Select</option>

                                    <option value="Uniting Hindus">Uniting Hindus</option>
                                    <option value="Strengthening the Hindu community">Strengthening the Hindu community</option>
                                    <option value="To make Hindu society aware">To make Hindu society aware</option>
                                    <option value="Working towards creating a Hindu Rashtra">Working towards creating a Hindu Rashtra</option>
                                    <option value="Technologically uplifting Hindu youth">Technologically uplifting Hindu Youth</option>
                                    <option value="Environmental protection">Environmental Protection</option>
                                    <option value="Corruption-free Nation">Corruption-Free Nation</option>
                                    <option value="Improved education system for society">Improved Education system for Society</option>
                                    <option value="Better health care for society">Better Health Care for society</option>
                                    <option value="Volunteer">Volunteer</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Creating Job opportunity">Creating Job opportunity</option>

                                </Form.Control>
                                {errorJ && <div className='text-center' >  <Badge style={{ height: "40px" }} bg="danger" className="pt-3">{errorJ}</Badge> </div>}

                            </InputGroup>
                        </Col>
                        <Col sm>
                            <InputGroup className="mb-2" >
                                <InputGroup.Text style={{ fontWeight: "bold" }}>Qualification</InputGroup.Text>

                                <Form.Control
                                    as="select"
                                    aria-label="Qualification"
                                    value={userData.qualification}
                                    name="qualification"
                                    onChange={(e) => {
                                        handleChange(e);
                                        setErrorQ(null);

                                    }}
                                    required
                                >
                                    <option value="">Select Qualification</option>
                                    <option value="Below Secondary">Below Secondary</option>
                                    <option value="Secondary  (10th)">Secondary  (10th)</option>
                                    <option value="Higher Secondary (12th)">Higher Secondary (12th)</option>
                                    <option value="Undergraduate">Undergraduate</option>
                                    <option value="Graduate">Graduate</option>
                                    <option value="Postgraduate">Postgraduate</option>
                                    <option value="Other">Other</option>
                                </Form.Control>
                                {errorQ && <div className='text-center' >  <Badge style={{ height: "40px" }} bg="danger" className="pt-3">{errorQ}</Badge> </div>}
                            </InputGroup>


                        </Col>

                        <Col sm>
                            <InputGroup className="mb-2" >
                                <InputGroup.Text style={{ fontWeight: "bold" }}>Contribute afetr Joining:</InputGroup.Text>

                                <Form.Control
                                    as="select"
                                    aria-label="Contribute afetr Joining:"
                                    value={userData.giveAterJoin}
                                    name="giveAterJoin"
                                    onChange={(e) => {
                                        handleChange(e);
                                        setErrorCAJ(null);

                                    }}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="Time">Time</option>
                                    <option value="Knowledge">Knowledge</option>
                                    <option value="Source">Source</option>
                                </Form.Control>
                                {errorCAJ && <div className='text-center' >  <Badge style={{ height: "40px" }} bg="danger" className="pt-3">{errorCAJ}</Badge> </div>}
                            </InputGroup>
                        </Col>

                    </Row>

                    {/* Terms and Conditions */}
                    <div className="form-check mb-2 d-flex justify-content-center align-items-center">
                        <div className='d-flex justify-content-center align-items-center flex-column'>
                            <div>

                                <input
                                    type="checkbox"
                                    className="form-check-input me-2"
                                    name="agreedVolunteerTerms"
                                    required
                                    onChange={handleChange}
                                />

                                <label className="form-check-label">
                                    I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>
                                </label>
                            </div>
                            {errorT && <div className='text-center'>  <Badge bg="danger" >{errorT}</Badge> </div>}
                        </div>


                    </div>

                    <div className='d-flex justify-content-center p-2 ' >

                        <button className='btn btn-danger m-2' onClick={handleSave}>
                            {loading ? (
                                <span>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Saving... Data...
                                </span>
                            ) : (
                                <> Save Data <GiSave />   </>
                            )}

                        </button>


                    </div>

                </Card.Body>

            </Card>
            <ToastContainer />
        </div>
    )
}

export default JoinStep2