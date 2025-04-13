import { React, useState, useContext, useEffect } from 'react';
import AuthContext from "../../Context/AuthContext";
import './Donation.css';
import { Card, InputGroup, Carousel, Button, Form, Row, Spinner, Col, Image } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleError, handleSuccess, handleWarning } from '../../Components/Util';
import { ToastContainer } from 'react-toastify';
import { FcLikePlaceholder } from "react-icons/fc";


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
    const [country, setCountry] = useState("");
    const [mail, setMail] = useState("");
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [bp, setBp] = useState("");
    const [age, setAge] = useState("");

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
            address: address || fuladdress,

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
                alert(data.message); // Display success message
                if (data.alert) {
                    alert(data.alert); // Display alert if BP is true
                }
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
                    userData && userData?.isBloodDonor === true ? (
                        <>
                            <Card className="text-center mt-1 p-3" style={{ width: '25rem', }}>
                                <Card.Img variant="top" style={{ height: "100%" }} src="bloods.webp" />
                                <Card.Body>
                                    <Card.Title>Already Registered as Blood Donor</Card.Title>
                                    <Card.Text>
                                        You are already registered as a Regular Blood Donor. If any Hindu in your area needs blood, you will be contacted. Thank you.
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
                            <Form.Text > <h4 className='mt-2'> To Register as Regular Blood Donor </h4> </Form.Text>



                            <div className='CDS' style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
                                {step === 1 && (
                                    <>
                                        {/* Email and Mobile Fields */}
                                        <Row className=''>
                                            <Col md={7} className='cds_col_bld mx-auto'> {/* Full width on small screens, half width on large screens */}
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
                                            <Button className='mb-2' disabled size='sm'> Full Current Address & Some Personal Details </Button>
                                           
                                        </Row>

                                        {/* Full Name and Address Fields */}

                                        <Row className=''>
                                            <Col xs={12} md={6} className='cds_col_bld'> {/* Full width on small screens, half width on large screens */}

                                                <Row className="">
                                                    {/* Blood Group Form */}
                                                    <Col >
                                                        <Form>
                                                            <Form.Group controlId="formGridBloodGroup">
                                                                <Form.Label className="form-label ps-3">Blood Group</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Enter Blood Group"
                                                                    value={bloodGroup || userData?.bloodGroup || ""}
                                                                    onChange={(e) => setBloodGroup(e.target.value)}
                                                                />
                                                            </Form.Group>
                                                        </Form>
                                                    </Col>

                                                    {/* Age Form */}
                                                    <Col >
                                                        <Form>
                                                            <Form.Group controlId="formGridAge">
                                                                <Form.Label className="form-label ps-3">Age</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Enter Age"
                                                                    value={age || userData?.age || ""}
                                                                    onChange={(e) => setAge(e.target.value)}
                                                                />
                                                            </Form.Group>
                                                        </Form>
                                                    </Col>
                                                </Row>

                                            </Col>

                                            <Col xs={12} md={6} className='cds_col_bld'> {/* Full width on small screens, half width on large screens */}
                                                <Form>
                                                    <Form.Group controlId="formGridAddress">
                                                        <Form.Label className="form-label ps-3">Any symptom of Diabetes or BP!</Form.Label>
                                                        <Form.Select aria-label="Default select example" placeholder="Do you have diabetes or blood pressure problems?" value={bp || ""} onChange={(e) => setBp(e.target.value)}>
                                                            <option>Open this select menu</option>
                                                            <option value="yes">Yes</option>
                                                            <option value="no">No</option>

                                                        </Form.Select>

                                                    </Form.Group>
                                                </Form>
                                            </Col>
                                        </Row>

                                        {/* Button */}
                                        <Row>
                                            <Col xs={12}>
                                                <Button className='mt-2' onClick={handleMarkAsBD} variant="primary" type="submit">
                                                    Register as Blood Donor with <FcLikePlaceholder />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="d-flex align-items-center mt-1 ">
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
                            <Card.Img variant="top" width={450} height={200} style={{ objectFit:"cover" }} src="bloods.webp" />
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
            <ToastContainer />
        </div>

    )
}

export default Blood