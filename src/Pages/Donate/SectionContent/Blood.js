import { React, useState, useContext, useEffect } from 'react';
import AuthContext from "../../../Context/AuthContext";
import '../Donation.css';
import { Card, InputGroup, Carousel, Button, Form, Row, Spinner, Col, Image, Modal } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleError, handleSuccess, handleWarning } from '../../../Components/Util';
import { ToastContainer } from 'react-toastify';
import { FcLikePlaceholder } from "react-icons/fc";
import { GoVerified } from 'react-icons/go';
import MobileVerification from '../../../LandingPage/LogIn/MobileVerification';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


const Blood = () => {
    const { user } = useContext(AuthContext);
    const userId = user?.id;
    const isAuthenticated = !!user;

    const navigate = useNavigate(); // Initialize the navigate function
    const location = useLocation();

    const [activeSwitch, setActiveSwitch] = useState('Register as Regular Blood Donor');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [state, setState] = useState("");
    const [PIN, setPIN] = useState("");

    const [mail, setMail] = useState("");
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [bp, setBp] = useState("");
    const [age, setAge] = useState("");

    const [showModal, setShowModal] = useState(false);  // State to control modal visibility
    const [onVerified, setOnVerified] = useState(false);


    const [step, setStep] = useState(1); // State to track current step

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





    const handleMarkAsBD = async () => {
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
            address: address || (userData?.address),
            city: city || (userData?.city),
            district: district || (userData?.district),
            state: state || (userData?.state),
            PIN: PIN || (userData?.PIN),
            realTimeAddress: realTimeAddress,
            realTimeLocation: realTimeLocation,

            bloodGroup: bloodGroup || (userData ? userData.bloodGroup : ""),
            age: age || (userData ? userData.age : ""),
            bp: bp,
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
        } else if (formData.bloodGroup === "" || !formData.bloodGroup) {
            handleWarning("Blood Group is required");
            return;
        } else if (formData.age === "" || !formData.age) {
            handleWarning("Age is required");
            return;
        } else if (formData.bp === "" || !formData.bp) {
            handleWarning("Please provide information about diabetes or blood pressure");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            let url = `${process.env.REACT_APP_API_URL}/api/donate/mark-blood-donor`;
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
                url = `${process.env.REACT_APP_API_URL}/api/donate/create-blood-donor`;
                method = 'POST';
            }

            const response = await fetch(url, {
                credentials: 'include',
                method,
                headers,
                body,
            });


            const data = await response.json();
            if (response.ok) {

                // Show success message
                setStep(3)
                setonSuccess(true);
                alert(data.message); // Display success message     
                if (data.alert) {
                    alert(data.alert); // Display alert if BP is true
                }
            } else {
                // Show error message if the donor already exists
                alert(data.message); // Display error message
                setonSuccess(false);
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
        localStorage.setItem("redirectAfterUpdate", location.pathname);
        localStorage.setItem("redirectAfterUpdateSEC", "blood-donation");
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
                            label={<span className={activeSwitch === "Register as Regular Blood Donor" ? "text-dark" : "text-muted"}>Register as Regular Blood Donor</span>}
                            checked={activeSwitch === "Register as Regular Blood Donor"}
                            onChange={() => handleSwitchClick("Register as Regular Blood Donor")}
                        />

                    </Form>
                </div>

                {activeSwitch === "Register as Regular Blood Donor" && (
                    userData && userData?.isBloodDonor === true  ? (
                        <>
                            <Card className="text-center mt-1 p-1" style={{ maxWidth: '100%', width: '100%', maxWidth: '400px' , margin: 'auto' }}>
                                <Card.Img variant="top" style={{ width: "100%", height: "auto", objectFit: "cover" }} src="bloods.webp" />
                                <Card.Body>
                                    <Card.Title>Already Registered as Blood Donor</Card.Title>
                                    <Card.Text>
                                        You are already registered as a Regular Blood Donor. If any Hindu in your area needs blood, you will be contacted. Thank you.
                                    </Card.Text>
                                </Card.Body>
                            </Card>

                            <div>
                                <Button className=' m-2' title=' By clicking this Button You can also find and donate to the needy!' variant="primary" type="submit" onClick={handleNavigate}>
                                    Go to Donor Beneficiry dashboard
                                </Button>
                            </div>
                            {/* Divider */}
                            <div className="d-flex align-items-center" style={{height:"10px"}}>
                                <hr className="flex-grow-1" /> <p className="text-center" style={{ marginTop: "15px", fontWeight: "bold", fontStyle: "italic" }}> Or </p> <hr className="flex-grow-1" />
                            </div>
                        </>


                    ) : (
                        <>
                            <Form.Text > <h6 className='m-1'> To Register as Regular Blood Donor </h6> </Form.Text>

                            <div className='CDS' style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
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

                                {step === 2 && (
                                    <>
                                        <Row>
                                            <Col>
                                                <Button className='mb-3' disabled size='sm'>
                                                    Full Current Address & Some Personal Details
                                                </Button>
                                            </Col>
                                        </Row>

                                        <Row>
                                            {/* Left Column */}
                                            <Col xs={12} md={6}>
                                                {/* Full Address if already available */}
                                                {userData?.address && userData?.city ? (
                                                    <Form>
                                                        <Form.Group controlId="formGridFullAddress">
                                                            <Form.Label className="form-label ps-3">Full Current Address</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                readOnly
                                                                placeholder="Enter full Address with Village, City, State"
                                                                value={fuladdress}
                                                            // onChange={(e) => setAddress(e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Form>
                                                ) : (
                                                    <>
                                                        {/* Locality */}
                                                        <InputGroup className="mb-2">
                                                            <InputGroup.Text className="fw-bold">Locality</InputGroup.Text>
                                                            <Form.Control
                                                                name='address'
                                                                placeholder="House No, St. No, Locality"
                                                                value={address}
                                                                onChange={(e) => setAddress(e.target.value)}
                                                                required
                                                            />
                                                        </InputGroup>

                                                        {/* City + District */}
                                                        <Row>
                                                            <Col >
                                                                <InputGroup className="mb-2">
                                                                    <InputGroup.Text className="fw-bold">City</InputGroup.Text>
                                                                    <Form.Control
                                                                        name='city'
                                                                        placeholder='Enter City'
                                                                        value={city}
                                                                        onChange={(e) => setCity(e.target.value)}
                                                                        required
                                                                    />
                                                                </InputGroup>
                                                            </Col>
                                                            <Col  >
                                                                <InputGroup className="mb-2">
                                                                    <InputGroup.Text className="fw-bold">District</InputGroup.Text>
                                                                    <Form.Control
                                                                        name='district'
                                                                        placeholder="Enter District"
                                                                        value={district}
                                                                        onChange={(e) => setDistrict(e.target.value)}
                                                                        required
                                                                    />
                                                                </InputGroup>
                                                            </Col>
                                                        </Row>

                                                        {/* State + PIN */}
                                                        <Row>
                                                            <Col  >
                                                                <InputGroup className="mb-2">
                                                                    <InputGroup.Text className="fw-bold">State</InputGroup.Text>
                                                                    <Form.Select
                                                                        name='state'
                                                                        value={state}
                                                                        onChange={(e) => setState(e.target.value)}
                                                                        required
                                                                    >
                                                                        <option value="">Choose State</option>
                                                                        {/* You can make this dynamic if needed */}
                                                                        <option>Andhra Pradesh</option>
                                                                        <option>Arunachal Pradesh</option>
                                                                        <option>Assam</option>
                                                                        <option>Bihar</option>
                                                                        <option>Chhattisgarh</option>
                                                                        <option>Goa</option>
                                                                        <option>Gujarat</option>
                                                                        <option>Haryana</option>
                                                                        <option>Himachal Pradesh</option>
                                                                        <option>Jharkhand</option>
                                                                        <option>Karnataka</option>
                                                                        <option>Kerala</option>
                                                                        <option>Madhya Pradesh</option>
                                                                        <option>Maharashtra</option>
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
                                                                        <option>West Bengal</option>
                                                                        <option>Delhi</option>
                                                                        <option>Jammu and Kashmir</option>
                                                                        <option>Ladakh</option>
                                                                        <option>Puducherry</option>
                                                                    </Form.Select>
                                                                </InputGroup>
                                                            </Col>

                                                            <Col  >
                                                                <InputGroup className="mb-2">
                                                                    <InputGroup.Text className="fw-bold">PIN</InputGroup.Text>
                                                                    <Form.Control
                                                                        type="number"
                                                                        placeholder="Enter PIN"
                                                                        name="PIN"
                                                                        value={PIN}
                                                                        onChange={(e) => setPIN(e.target.value)}
                                                                        required
                                                                    />
                                                                </InputGroup>
                                                            </Col>
                                                        </Row>
                                                    </>
                                                )}
                                            </Col>

                                            {/* Right Column */}
                                            <Col xs={12} md={6} className="mt-3 mt-md-0">
                                                {/* Blood Group + Age */}
                                                <Row>
                                                    <Col>
                                                        <InputGroup className="mb-2">
                                                            <InputGroup.Text className="fw-bold">Blood Group</InputGroup.Text>
                                                            {userData?.bloodGroup ? (
                                                                <Form.Control
                                                                    type="text"
                                                                    value={userData.bloodGroup}
                                                                    readOnly
                                                                />
                                                            ) : (
                                                                <Form.Select
                                                                    name='bloodGroup'
                                                                    value={bloodGroup}
                                                                    onChange={(e) => setBloodGroup(e.target.value)}
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
                                                                </Form.Select>
                                                            )}
                                                        </InputGroup>
                                                    </Col>

                                                    <Col >
                                                        <InputGroup className="mb-2">
                                                            <InputGroup.Text className="fw-bold">Age</InputGroup.Text>
                                                            {userData?.age ? (
                                                                <Form.Control
                                                                    type="text"
                                                                    value={userData.age || age || ""}
                                                                    onChange={(e) => setAge(e.target.value)}
                                                                    placeholder="Enter Age"
                                                                    required
                                                                />
                                                            ) : (
                                                                <Form.Control
                                                                    type="number"
                                                                    value={age}
                                                                    onChange={(e) => setAge(e.target.value)}
                                                                    placeholder="Enter Age"
                                                                    required
                                                                />
                                                            )}
                                                        </InputGroup>
                                                    </Col>
                                                </Row>

                                                {/* BP/Diabetes */}
                                                <InputGroup className="mb-2">
                                                    <InputGroup.Text className="fw-bold">Diabetes/BP Symptoms?</InputGroup.Text>
                                                    <Form.Select
                                                        name='bp'
                                                        value={bp}
                                                        onChange={(e) => setBp(e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="yes">Yes</option>
                                                        <option value="no">No</option>
                                                    </Form.Select>
                                                </InputGroup>

                                                {/* Submit Button */}
                                                <div className="d-grid mt-2">
                                                    <Button onClick={handleMarkAsBD} variant="primary" type="submit">
                                                        Register as Blood Donor 🩸
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </>
                                )}

                                {onSuccess && step === 3 && (
                                    <>
                                    <Card className="text-center mt-1 p-1 mx-auto" style={{ maxWidth: '100%', width: '100%', maxWidth: '400px' }}>
                                    <Card.Img variant="top"   style={{ width: "100%", height: "auto", objectFit: "cover" }} src="bloods.webp" />
                                    <Card.Body>
                                        <Card.Title>Thank you for being a blood donor.</Card.Title>
                                        <Card.Text>
                                            You are registered as a Regular Blood Donor. If any Hindu in your area needs blood, you will be contacted. Thank you.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
    
                                <div>
                                    <Button className=' m-1' title=' By clicking this Button You can also find and donate to the needy!' variant="primary" type="submit" onClick={handleNavigate}>
                                        Go to Donor Beneficiry dashboard
                                    </Button>
                                </div>
                                </>
                                )}





                            </div>

                            {/* Divider */}
                            <div className="d-flex align-items-center " style={{height:"10px"}}>
                                <hr className="flex-grow-1" /> <p className="text-center" style={{ marginTop: "15px", fontWeight: "bold", fontStyle: "italic" }}> Or </p> <hr className="flex-grow-1" />
                            </div>

                        </>


                    ))}

                 



                <div>
                    <Form className='switch-container'>
                        <Form.Check
                            className="ms-2 m-1 doner"
                            type="switch"
                            id="custom-switch-doner2"
                            label={<span className={activeSwitch === "Search for Blood Recipient" ? "text-dark" : "text-muted"}>Search for Blood Recipient</span>}
                            checked={activeSwitch === "Search for Blood Recipient"}
                            onChange={() => handleSwitchClick("Search for Blood Recipient")}
                        />
                    </Form>
                </div>

                {activeSwitch === "Search for Blood Recipient" && (
                    <>
                        <Card className="text-center mt-1 p-1 do-ca">
                            <Card.Img variant="top" width={450} height={200} style={{ objectFit: "cover" }} src="bloods.webp" />
                            <Card.Body>
                                <Card.Title>Search for Blood Recipient</Card.Title>
                                <Card.Text>
                                    You can search for blood recipient in your area in our Community. If you find someone in need of blood, you can donate blood to them.
                                </Card.Text>
                            </Card.Body>
                        </Card>

                        <Form.Text className='p-2' > Among your Acquaintances, someone may be looking for Blood! <br /> Please share this information with them!  </Form.Text>

                        {!userData && (
                            <div className='CDS' style={{ maxWidth: '800px', margin: 'auto' }}>
                                <h5>Before start searching Blood Recipient</h5>
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

export default Blood