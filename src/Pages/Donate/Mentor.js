import { React, useState, useContext, useEffect } from 'react';
import AuthContext from "../../Context/AuthContext";
import './Donation.css';
import { Card, InputGroup, Carousel, Button, Form, Row, Spinner, Col, Image } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleError, handleSuccess, handleWarning } from '../../Components/Util';
import { ToastContainer } from 'react-toastify';
import { FcLikePlaceholder } from "react-icons/fc";

const Mentor = () => {
    const { user } = useContext(AuthContext);
    const userId = user?.id;
    const isAuthenticated = !!user;

    const navigate = useNavigate(); // Initialize the navigate function
    const location = useLocation();

    const [activeSwitch, setActiveSwitch] = useState('Register as Regular Mentor');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    const [address, setAddress] = useState("");
    const [mail, setMail] = useState("");
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [mentorshipSub, setMentorshipSub] = useState("");
    const [provideVia, setProvideVia] = useState("");
    const [step, setStep] = useState(1); // State to track current step

    const handleNext = () => {
        const validateEmail = (email) => {
            // Basic email regex to check for valid email format
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(email);
        };

        const formData = {            
            name: name || (userData ? userData.updateFullName : ""),
            email: mail || (userData ? userData.email : ""),            
            mobile: mobile || (userData ? userData.mobile : ""),
        };
        

        // Validate form fields
        
        if (formData.email === "" || !formData.email) {
            handleWarning("Email is required");
            return;
        } else if (!validateEmail(formData.email)) {
            handleWarning("Please provide a valid email address");
            return;
        
        } else if (formData.mobile === "" || !formData.mobile) {
            handleWarning("Mobile is required");
            return;
        } else if (formData.name === "" || !formData.name) {
            handleWarning("Name is required");
            return;
        }
        setStep(2); // Proceed to the next step
    };


    // Toggle switch states
    const handleSwitchClick = (switchName) => {
        // setActiveSwitch(activeSwitch === switchName ? null : switchName);
        // If the clicked switch is already active, do nothing
        if (activeSwitch === switchName) return;

        // Otherwise, update the active switch
        setActiveSwitch(switchName);

    };

    const add = [
        userData?.address,
        userData?.city,
        userData?.state
    ].filter(Boolean).join(', ');

    const fuladdress = add || ''; // If 'add' is falsy, use an empty string


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
            }
        } catch (error) {
            console.error("Error fetching user data", error);
        } finally {
            setLoading(false);
        }
    };

    // Check authentication status and fetch user data
    useEffect(() => {
        if (isAuthenticated && userId) {
            localStorage.removeItem("redirectAfterLogin");
            localStorage.removeItem("redirectAfterUpdate");
            console.log('Fetching data for userId:', userId); // Debugging

            // CheckUserProfileBeforeProcced();

            fetchUserData();

        }
    }, [isAuthenticated, userId,]);





    const handleMarkAsMentor = async () => {
        const validateEmail = (email) => {
            // Basic email regex to check for valid email format
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(email);
        };

        const formData = {
            donorType: activeSwitch,
            name: name || (userData ? userData.updateFullName : ""),
            email: mail || (userData ? userData.email : ""),
            mobile: mobile || (userData ? userData.mobile : ""),
            address: address || fuladdress,            
            mentorshipSub: mentorshipSub,
            provideVia: provideVia,
        };

        // Validate form fields
        if (formData.name === "" || !formData.name) {
            handleWarning("Name is required");
            return;
        } else if (formData.email === "" || !formData.email) {
            handleWarning("Email is required");
            return;
        } else if (!validateEmail(formData.email)) {
            handleWarning("Please provide a valid email address");
            return;
        } else if (formData.address === "" || !formData.address) {
            handleWarning("Address is required");
            return;
        } else if (formData.mobile === "" || !formData.mobile) {
            handleWarning("Mobile is required");
            return;
        } else if (formData.mentorshipSub === "" || !formData.mentorshipSub) {
            handleWarning("Subject is required");
            return;
        } else if (formData.provideVia === "" || !formData.provideVia) {
            handleWarning("Age is required");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            let url = `${process.env.REACT_APP_API_URL}/api/donate/mark-as-mentor`;
            let method = 'PUT';
            let headers = {
                'Content-Type': 'application/json',
            };
            let body = JSON.stringify(formData);

            // If the user is logged in, attach the token
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            } else {
                // If no token, send a request to create a new blood donor
                url = `${process.env.REACT_APP_API_URL}/api/donate/create-mentor`;
                method = 'POST';
            }

            const response = await fetch(url, {
                credentials: 'include',
                method,
                headers,
                body,
            });

            // if (response.ok) {
            //     const data = await response.json();
            //     console.log("Marked as Blood Donor:", data);
            //     handleSuccess("You are now a registered blood donor!");
            // } else {
            //     const errorData = await response.json();
            //     console.error("Error marking as blood donor:", errorData);
            //     handleError("Error marking as blood donor. Please try again later.");
            // }
            const data = await response.json();
            if (response.ok) {

                // Show success message
                alert(data.message); // Display success message

            } else {
                // Show error message if the donor already exists
                alert(data.message); // Display error message
            }
        } catch (error) {
            console.error("Error marking as blood donor:", error);
            handleError("Error marking as blood donor. Please try again later.");
        }
    };


    const handleNavigate = () => {
        // Navigate to the specified route
        navigate('/donate'); // Replace with your desired path
    };
    const handleNavigateLogin = () => {
        // Navigate to the specified route
        localStorage.setItem("redirectAfterUpdate", location.pathname);
        localStorage.setItem("redirectAfterUpdateSEC", "skill-donation");
        localStorage.setItem("redirectAfterLogin", `/user/${userId}/update-profile`);
        navigate("/login"); // Replace with the actual route of your dashboard

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
        <div className="">
            <div className="">
                <div>
                    <Form className='switch-container'>
                        <Form.Check
                            className="ms-2 me-2 doner"
                            type="switch"
                            id="custom-switch-doner1"
                            label={<span className={activeSwitch === "Register as Regular Mentor" ? "text-dark" : "text-muted"}>Register as Regular Mentor</span>}
                            checked={activeSwitch === "Register as Regular Mentor"}
                            onChange={() => handleSwitchClick("Register as Regular Mentor")}
                        />

                    </Form>
                </div>

                {activeSwitch === "Register as Regular Mentor" && (
                    userData && userData?.isMentor === true ? (
                        <>
                            <Card className="text-center mt-1 p-3" style={{ width: '25rem', margin: 'auto' }}>
                                <Card.Img variant="top" style={{ height: "100%" }} src="mentorin.webp" />
                                <Card.Body>
                                    <Card.Title>Already Registered as Mentor</Card.Title>
                                    <Card.Text>
                                        You are already registered as a Mentor. If any Hindu needs your Mentorship, you will be contacted. Thank you.
                                    </Card.Text>
                                </Card.Body>
                            </Card>

                            <div>
                                <Button className=' mb-3' title=' By clicking this Button You can also find and donate to the needy!' variant="primary" type="submit" onClick={handleNavigate}>
                                    Go to Donor Beneficiry dashboard
                                </Button>
                            </div>
                        </>


                    ) : (



                        <>
                            <Form.Text > <h3 className='mt-2'> To Register as Regular Mentor </h3> </Form.Text>

                            <div className='CDS' style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
                                {/* Step 1: Email, Mobile, and Name Fields */}
                                {step === 1 && (
                                    <>

                                        <Row className=''>
                                            <Col md={6} className='cds_col mx-auto'> {/* Full width on small screens, half width on large screens */}
                                                <Form>
                                                    <Form.Group controlId="">
                                                        <Form.Label className="form-label ps-3">Email Address</Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            placeholder="Enter email"
                                                            value={mail || userData?.email || ""}
                                                            onChange={(e) => setMail(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Form>
                                            </Col>
                                            </Row>
                                            <Row className=''>

                                            <Col md={6} className='cds_col mx-auto'> {/* Full width on small screens, half width on large screens */}

                                                <Form>
                                                    <Form.Group controlId="formGridMobile">
                                                        <Form.Label className="form-label ps-3">Mobile</Form.Label>
                                                        <Form.Control
                                                            type="tel"
                                                            placeholder="Mobile"
                                                            value={userData?.mobile ? `+${userData.mobile}` : mobile}
                                                            onChange={(e) => setMobile(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Form>
                                            </Col>
                                            </Row>
                                            <Row className=''>
                                            <Col md={6} className='cds_col mx-auto'>
                                                <Form>
                                                    <Form.Group controlId="formGridName">
                                                        <Form.Label className="form-label ps-3">Full Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Enter Full Name"
                                                            value={name || userData?.updateFullName || ""}
                                                            onChange={(e) => setName(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Form>



                                            </Col>

                                        </Row>
                                        {/* Next Button */}
                                        <Row>
                                            <Col xs={12}>
                                                <Button className="mt-3" onClick={handleNext} variant="primary">
                                                    Next
                                                </Button>
                                            </Col>
                                        </Row>
                                    </>
                                )}

                                {/* Step 2: Address, Subject, and Delivery Method */}
                                {step === 2 && (
                                    <>
                                        <Row className=''>
                                            <Col md={8}  className='cds_col mx-auto'> {/* Full width on small screens, half width on large screens */}
                                                <Form>
                                                    <Form.Group controlId="formGridAddress">
                                                        <Form.Label className="form-label ps-3">Full Current Address</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Enter full Address with Village, City, State"
                                                            value={address || fuladdress || ""}
                                                            onChange={(e) => setAddress(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Form>
                                            </Col>
                                            </Row>
                                            <Row className=''>


                                            
                                                <Row className="">
                                                    <Col  md={8} className='cds_col mx-auto' >
                                                        <Form>
                                                            <Form.Group controlId="formGridSubject">
                                                                <Form.Label className="form-label ps-3">Expertise in Subject:</Form.Label>
                                                                <Form.Select aria-label="Default select example" placeholder="Expertise in Subject?" value={mentorshipSub || ""} onChange={(e) => setMentorshipSub(e.target.value)}>
                                                                    <option>Click here select Subject</option>
                                                                    <option value="careerPath">Career Path</option>
                                                                    <option value="higherEducationNavigation">Higher Education Navigation</option>
                                                                    <option value="forChoosingTheRightCourses">For Choosing The Right Courses</option>
                                                                    <option value="educationAndPracticalIndustryRequirements">Education And Practical Industry Requirements</option>
                                                                    <option value="developingSoftSkills">Developing Soft Skills</option>
                                                                    <option value="entrepreneurialSupport">Entrepreneurial Support</option>
                                                                    <option value="technicalSkills">Technical Skills</option>
                                                                    <option value="competitiveExamsPreparation">Competitive Exams Preparation</option>
                                                                    <option value="legalSupport">Legal Support </option>

                                                                </Form.Select>

                                                            </Form.Group>
                                                        </Form>
                                                    </Col>
                                                </Row>
                                                <Row className=''>
                                                    <Col  md={8} className='cds_col mx-auto' >
                                                        <Form>
                                                            <Form.Group controlId="formGridSubject">
                                                                <Form.Label className="form-label ps-3">Want to provide via:</Form.Label>
                                                                <Form.Select aria-label="Default select example" placeholder="Want to provide via?" value={provideVia || ""} onChange={(e) => setProvideVia(e.target.value)}>
                                                                    <option>Click this to Select</option>
                                                                    <option value="Online">Online</option>
                                                                    <option value="Offline">Offline</option>

                                                                </Form.Select>

                                                            </Form.Group>
                                                        </Form>

                                                    </Col>
                                                    
                                                </Row>
                                            

                                        </Row>


                                        {/* Button */}
                                        <Row>
                                            <Col xs={12}>
                                                <Button className='mt-3' onClick={handleMarkAsMentor} variant="primary" type="submit">
                                                    Register as Mentor with <FcLikePlaceholder />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="d-flex align-items-center ">
                                <hr className="flex-grow-1" /> <p className="text-center" style={{ marginTop: "15px", fontWeight: "bold", fontStyle: "italic" }}> Or </p> <hr className="flex-grow-1" />
                            </div>

                        </>


                    ))}



                <div>
                    <Form className='switch-container'>
                        <Form.Check
                            className="ms-2 m-2 doner"
                            type="switch"
                            id="custom-switch-doner2"
                            label={<span className={activeSwitch === "To find those who need Mentorship" ? "text-dark" : "text-muted"}>To find those who need Mentorship</span>}
                            checked={activeSwitch === "To find those who need Mentorship"}
                            onChange={() => handleSwitchClick("To find those who need Mentorship")}
                        />
                    </Form>
                </div>

                {activeSwitch === "To find those who need Mentorship" && (
                    <>
                        <Card className="text-center mt-1 p-1 do-ca">
                            <Card.Img variant="top" width={400}
                                        
                                        height={200} style={{  objectFit:"cover" }} src="mentorin.webp"  />
                            <Card.Body>
                                <Card.Title> <h6> To find those who need Mentorship</h6></Card.Title>
                                <Card.Text style={{ fontSize: '.9rem' }}>  
                                    You can find for those, who need mentorship in our Community. If you find someone in need Mentorship, you can donate your Mentorship.
                                    </Card.Text>
                            </Card.Body>
                        </Card>

                        <Form.Text className='p-2' > Among your Acquaintances, someone may be looking for Mentorship! <br /> Please share this information with them!  </Form.Text>

                        {!userData && (
                            <div className='' style={{ maxWidth: '800px',  }}>
                                <h6>Before start searching Blood Recipient</h6>
                                <Button className='' title=' By clicking this Button You can Login!' variant="link" type="submit" onClick={handleNavigateLogin}>
                                    Please log in
                                </Button>
                            </div>
                        )}
                        <div>
                            <Button className=' mb-3' title=' By clicking this Button You can also find and donate to the needy!' variant="primary" type="submit" onClick={handleNavigate}>
                                Go to Donor Beneficiry dashboard
                            </Button>
                        </div>
                    </>

                )}
            </div>
            <ToastContainer />
        </div>
    )
}

export default Mentor