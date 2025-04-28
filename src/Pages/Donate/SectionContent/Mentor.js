import { React, useState, useContext, useEffect } from 'react';
import AuthContext from "../../../Context/AuthContext";
import '../Donation.css';
import { Card, InputGroup, Carousel, Button, Form, Row, Spinner, Col, Modal } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleError, handleSuccess, handleWarning } from '../../../Components/Util';
import { ToastContainer } from 'react-toastify';
import { FcLikePlaceholder } from "react-icons/fc";
import { GoVerified } from 'react-icons/go';
import MobileVerification from '../../../LandingPage/LogIn/MobileVerification';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


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
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [district, setDistrict] = useState("");
    const [PIN, setPIN] = useState("");

    const [mail, setMail] = useState("");
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [mentorshipSub, setMentorshipSub] = useState("");
    const [provideVia, setProvideVia] = useState("");
    const [step, setStep] = useState(1); // State to track current step

    const [showModal, setShowModal] = useState(false);  // State to control modal visibility
    const [onVerified, setOnVerified] = useState(false);

    const [realTimeLocation, setRealTimeLocation] = useState({ lat: null, lon: null });
    const [realTimeAddress, setRealTimeAddress] = useState("");
    const [error, setError] = useState(null);
    const [onSuccess, setonSuccess] = useState(null);

    useEffect(() => {
        let watchId;

        const fetchAddress = async (latitude, longitude) => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                );
                const data = await response.json();
                console.log(data);

                if (data.display_name) {
                    setRealTimeAddress(data.display_name);
                } else {
                    setRealTimeAddress("Address not found");
                }
            } catch (err) {
                console.error("Error fetching realTimeAddress:", err);
                setRealTimeAddress("Error fetching realTimeAddress");
            }
        };

        const successCallback = (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            setRealTimeLocation({ lat, lon });
            console.log("Location:", lat, lon);

            fetchAddress(lat, lon); // Get realTimeAddress
        };

        const errorCallback = (err) => {
            setError(err.message);
        };

        if ("geolocation" in navigator) {
            watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, {
                enableHighAccuracy: true,
                maximumAge: 0,
            });
        } else {
            setError("Geolocation is not supported by this browser.");
        }

        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, []);

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

        console.log("location", realTimeAddress);


        const formData = {
            donorType: activeSwitch,
            name: name || (userData ? userData.updateFullName : ""),
            email: mail || (userData ? userData.email : ""),
            mobile: mobile || (userData ? userData.mobile : ""),
            address: address || (userData?.address),
            city: city || (userData?.city),
            district: district || (userData?.district),
            state: state || (userData?.state),
            PIN: PIN || (userData?.PIN),
            realTimeAddress: realTimeAddress,
            realTimeLocation: realTimeLocation,

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
        } else if (formData.city === "" || !formData.city) {
            handleWarning("City is required");
            return;
        } else if (formData.district === "" || !formData.district) {
            handleWarning("District is required");
            return;
        } else if (formData.state === "" || !formData.state) {
            handleWarning("State is required");
            return;
        } else if (formData.PIN === "" || !formData.PIN) {
            handleWarning("PIN is required");
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
                // Show success message
                setStep(3)
                setonSuccess(true);
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

    // Close modal manually (can be done from inside MobileVerification if needed)
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handlePhoneNumber = (phoneNumber) => {
        // setFormData((prevData) => ({ ...prevData, mobile: phoneNumber }));
        setMobile(phoneNumber)
        setOnVerified(true);
        handleCloseModal();  // Close modal after phone verification
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
                            <Card className="text-center mt-1 p-3" style={{ maxWidth: '25rem', margin: 'auto' }}>
                                <Card.Img variant="top" style={{ height: "100%" }} src="mentorin.webp" />
                                <Card.Body>
                                    <Card.Title>Already Registered as Mentor</Card.Title>
                                    <Card.Text>
                                        You are already registered as a Mentor. If any Hindu needs your Mentorship, you will be contacted. Thank you.
                                    </Card.Text>
                                </Card.Body>
                            </Card>

                            <div>
                                <Button className=' m-2' title=' By clicking this Button You can also find and donate to the needy!' variant="primary" type="submit" onClick={handleNavigate}>
                                    Go to Donor Beneficiry dashboard
                                </Button>
                            </div>
                            {/* Divider */}
                            <div className="d-flex align-items-center" style={{ height: "10px" }}>
                                <hr className="flex-grow-1" /> <p className="text-center" style={{ marginTop: "15px", fontWeight: "bold", fontStyle: "italic" }}> Or </p> <hr className="flex-grow-1" />
                            </div>
                        </>


                    ) : (



                        <>
                            <Form.Text > <h6 className='mt-2'> To Register as Regular Mentor </h6> </Form.Text>

                            <div className='CDS' style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
                                {/* Step 1: Email, Mobile, and Name Fields */}
                                {step === 1 && (
                                    <>
                                        {/* Email and Mobile Fields */}
                                        <Row className=''>
                                            <Col md={7} className='cds_col_bld mx-auto mb-2'> {/* Full width on small screens, half width on large screens */}
                                                <Form>
                                                    <Form.Group controlId="">
                                                        <Form.Label className="form-label ps-3">Email Address</Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            disabled={userData?.email}
                                                            placeholder="Enter email"
                                                            value={mail || userData?.email || ""}
                                                            onChange={(e) => setMail(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Form>
                                            </Col>
                                        </Row>
                                        <Row className=''>
                                            <Col md={7} className='cds_col_bld mx-auto'> {/* Full width on small screens, half width on large screens */}
                                                {userData?.mobile ? (
                                                    <div className="position-relative mb-2">
                                                        <Form>
                                                            <Form.Group controlId="formGridMobile">
                                                                <Form.Label className="form-label text-left ps-3">Mobile</Form.Label>
                                                                <PhoneInput
                                                                    disabled={onVerified || userData?.mobile}
                                                                    country={'in'}
                                                                    value={userData.mobile}
                                                                    inputProps={{ name: 'mobile' }}
                                                                    inputStyle={{ width: '100%', borderRadius: '5px' }}
                                                                />
                                                                {(onVerified || userData?.mobile) && (
                                                                    <GoVerified
                                                                        className="position-absolute"
                                                                        style={{
                                                                            right: 10,
                                                                            top: "75%",
                                                                            transform: "translateY(-50%)",
                                                                            color: "green",
                                                                        }}
                                                                    />
                                                                )}
                                                            </Form.Group>
                                                        </Form>


                                                    </div>

                                                ) : (
                                                    mobile ? (
                                                        <div className="position-relative mb-2">
                                                            <Form>
                                                                <Form.Group controlId="formGridMobile">
                                                                    <Form.Label className="form-label text-left ps-3">Mobile</Form.Label>
                                                                    <PhoneInput
                                                                        disabled={onVerified}
                                                                        country={'in'}
                                                                        value={mobile}
                                                                        inputProps={{ name: 'mobile' }}
                                                                        inputStyle={{ width: '100%', borderRadius: '5px' }}
                                                                    />
                                                                    {onVerified && (
                                                                        <GoVerified
                                                                            className="position-absolute"
                                                                            style={{
                                                                                right: 10,
                                                                                top: "70%",
                                                                                transform: "translateY(-50%)",
                                                                                color: "green",
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Form.Group>
                                                            </Form>


                                                        </div>

                                                    ) : (
                                                        <Form>
                                                            <Form.Group controlId="formGridMobile">
                                                                <Form.Label className="form-label ps-3 ms-auto">Mobile</Form.Label>
                                                                <Form.Control
                                                                    type="tel"
                                                                    placeholder="Mobile"

                                                                    onClick={(e) => setShowModal(true)}
                                                                />
                                                            </Form.Group>
                                                        </Form>
                                                    ))}
                                            </Col>
                                        </Row>

                                        {/* Full Name and Address Fields */}
                                        <Row className=''>
                                            <Col md={7} className='cds_col_bld mx-auto'> {/* Full width on small screens, half width on large screens */}

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
                                                <Button className="mt-2" onClick={handleNext} variant="primary">
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
                                            <Col md={8} className='cds_col mx-auto'> {/* Full width on small screens, half width on large screens */}
                                                {(userData?.address && userData?.city) ? (
                                                    <Form>
                                                        <Form.Group controlId="formGridAddress">
                                                            <Form.Label className="form-label ps-3">Full Current Address</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                readOnly
                                                                placeholder="Enter full Address with Village, City, State"
                                                                value={fuladdress}
                                                                onChange={(e) => setAddress(e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Form>
                                                ) : (<>
                                                    <Row>
                                                        <Col>
                                                            <InputGroup className="mb-2" >
                                                                <InputGroup.Text style={{ fontWeight: "bold" }}>Locality</InputGroup.Text>
                                                                <Form.Control
                                                                    name='address'
                                                                    placeholder="House No, St. No, Locality"
                                                                    value={address}
                                                                    onChange={(e) => setAddress(e.target.value)}
                                                                    required />
                                                            </InputGroup>
                                                        </Col>

                                                    </Row>
                                                    <Row>

                                                        <Col >
                                                            <InputGroup className="mb-2" >
                                                                <InputGroup.Text style={{ fontWeight: "bold" }}>City</InputGroup.Text>
                                                                <Form.Control name='city'
                                                                    placeholder='Enter City'
                                                                    value={city}
                                                                    onChange={(e) => setCity(e.target.value)}
                                                                    required />
                                                            </InputGroup>
                                                        </Col>
                                                        <Col>
                                                            <InputGroup className="mb-2" >
                                                                <InputGroup.Text style={{ fontWeight: "bold" }}>District</InputGroup.Text>
                                                                <Form.Control
                                                                    name='district'
                                                                    placeholder="House No, St. No, Locality"
                                                                    value={district}
                                                                    onChange={(e) => setDistrict(e.target.value)}
                                                                    required />
                                                            </InputGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <InputGroup className="mb-2" >
                                                                <InputGroup.Text style={{ fontWeight: "bold" }}>State</InputGroup.Text>
                                                                <Form.Control
                                                                    as="select"
                                                                    aria-label="State"
                                                                    name='state'
                                                                    placeholder='Choose State'
                                                                    value={state}
                                                                    onChange={(e) => setState(e.target.value)}
                                                                    required >

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
                                                        </Col>
                                                        <Col >
                                                            <InputGroup className="mb-2" >
                                                                <InputGroup.Text style={{ fontWeight: "bold" }}>PIN</InputGroup.Text>
                                                                <Form.Control name='PIN'
                                                                    placeholder='Enter PIN'
                                                                    value={PIN}
                                                                    onChange={(e) => setPIN(e.target.value)}
                                                                    required />
                                                            </InputGroup>
                                                        </Col>
                                                    </Row>

                                                </>

                                                )}
                                            </Col>
                                        </Row>
                                        <Row className=''>



                                            <Row className="">
                                                <Col md={8} className='cds_col mx-auto' >
                                                    <InputGroup className="mb-1" >
                                                        <InputGroup.Text style={{ fontWeight: "bold" }}>Expertise in Subject:</InputGroup.Text>
                                                        <Form.Control
                                                            as="select"
                                                            aria-label="State"
                                                            name='mentorshipSub'
                                                            placeholder='Choose State'
                                                            onChange={(e) => setMentorshipSub(e.target.value)}
                                                            value={mentorshipSub}
                                                            required >
                                                            <option>Click here to select Subject</option>
                                                            <option value="Career Path">Career Path</option>
                                                            <option value="Higher Education Navigation">Higher Education Navigation</option>
                                                            <option value="For Choosing The Right Courses">For Choosing The Right Courses</option>
                                                            <option value="Education And Practical Industry Requirements">Education And Practical Industry Requirements</option>
                                                            <option value="Developing Soft Skills">Developing Soft Skills</option>
                                                            <option value="Entrepreneurial Support">Entrepreneurial Support</option>
                                                            <option value="Technical Skills">Technical Skills</option>
                                                            <option value="Competitive Exams Preparation">Competitive Exams Preparation</option>
                                                            <option value="Legal Support">Legal Support </option>
                                                        </Form.Control>
                                                    </InputGroup>

                                                </Col>
                                            </Row>
                                            <Row className=''>
                                                <Col md={8} className='cds_col mx-auto' >
                                                    <InputGroup className="mb-1" >
                                                        <InputGroup.Text style={{ fontWeight: "bold" }}>Want to provide via:</InputGroup.Text>
                                                        <Form.Control
                                                            as="select"
                                                            aria-label="State"
                                                            name='provideVia'
                                                            placeholder='Want to provide via?'
                                                            onChange={(e) => setProvideVia(e.target.value)}
                                                            value={provideVia}

                                                            required >
                                                            <option>Click this to Select</option>
                                                            <option value="Online">Online</option>
                                                            <option value="Offline">Offline</option>
                                                        </Form.Control>
                                                    </InputGroup>
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

                                {onSuccess && step === 3 && (
                                    <>
                                        <Card className="text-center mt-1 p-3" style={{ maxWidth: '25rem', margin: 'auto' }}>
                                            <Card.Img variant="top" style={{ height: "100%" }} src="mentorin.webp" />
                                            <Card.Body>
                                                <Card.Title>Already Registered as Mentor</Card.Title>
                                                <Card.Text>
                                                    You are already registered as a Mentor. If any Hindu needs your Mentorship, you will be contacted. Thank you.
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>

                                        <div>
                                            <Button className=' m-2' title=' By clicking this Button You can also find and donate to the needy!' variant="primary" type="submit" onClick={handleNavigate}>
                                                Go to Donor Beneficiry dashboard
                                            </Button>
                                        </div>
                                    </>

                                )}
                            </div>

                            {/* Divider */}
                            <div className="d-flex align-items-center" style={{ height: "10px" }}>
                                <hr className="flex-grow-1" /> <p className="text-center" style={{ marginTop: "15px", fontWeight: "bold", fontStyle: "italic" }}> Or </p> <hr className="flex-grow-1" />
                            </div>

                        </>


                    ))}



                <div className='mx-auto'>
                    <Form className='switch-container'>
                        <Form.Check
                            className="ms-2 me-2 doner"
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

                                height={200} style={{ objectFit: "cover" }} src="mentorin.webp" />
                            <Card.Body>
                                <Card.Title> <h6> To find those who need Mentorship</h6></Card.Title>
                                <Card.Text style={{ fontSize: '.9rem' }}>
                                    You can find for those, who need mentorship in our Community. If you find someone in need Mentorship, you can donate your Mentorship.
                                </Card.Text>
                            </Card.Body>
                        </Card>

                        <Form.Text className='p-2' > Among your Acquaintances, someone may be looking for Mentorship! <br /> Please share this information with them!  </Form.Text>

                        {!userData && (
                            <div className='' style={{ maxWidth: '800px', }}>
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
            <ToastContainer />
        </div>
    )
}

export default Mentor