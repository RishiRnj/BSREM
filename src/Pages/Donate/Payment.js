import { React, useState, useContext, useEffect } from 'react';
import AuthContext from "../../Context/AuthContext";
import './Donation.css';
import { Card, InputGroup, Carousel, Button, Form, Row, Spinner, Col, Image } from 'react-bootstrap';
import { handleError, handleSuccess, handleWarning } from '../../Components/Util';
import { ToastContainer } from 'react-toastify';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FcLikePlaceholder } from "react-icons/fc";
import { FaGooglePay, FaAmazonPay } from "react-icons/fa";
import { SiPhonepe, SiPaytm } from "react-icons/si";





const PaymentOption = () => {
    const { user } = useContext(AuthContext);
    const userId = user?.id;
    const isAuthenticated = !!user;

    // State to track which switch is enabled
    const [activeSwitch, setActiveSwitch] = useState('Indian Donor');
    // State to track which button is clicked
    const [activeButton, setActiveButton] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [currency, setCurrency] = useState("");
    const [manualAmount, setManualAmount] = useState("");
    const [country, setCountry] = useState("");
    const [pan, setPan] = useState("");
    const [passport, setPassport] = useState("");
    const [address, setAddress] = useState("");
    const [mail, setMail] = useState("");
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");

    const [showOpt, setShowOpt] = useState(null);
    const [nriOpt, setNriOpt] = useState(true);
    const [showDefult, setShowDefult] = useState(true);



    const [next, setNext] = useState("");
    const [nextNRI, setNextNRI] = useState("");
    const rupeeSymbol = "INR" || "\u20B9";
    const target = "/contri.png";

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);



    const [checked, setChecked] = useState(false);

    const handleSwitchChange = () => {
        setChecked(!checked);
        console.log('chekd', checked);

    };

    const add = [
        userData?.address,
        userData?.city,
        userData?.state
    ].filter(Boolean).join(', ');

    const fuladdress = add || ''; // If 'add' is falsy, use an empty string



    // Currency mapping based on country selection
    const currencyMapping = {
        "India": "INR",        // India uses INR
        "United States": "USD",// United States uses USD
        "United Kingdom": "GBP", // UK uses GBP
        "Switzerland": "USD",  // Switzerland uses CHF
        "Nepal": "INR",
        "Bangladesh": "INR",
        "Pakistan": "INR",
        "Sri Lanka": "INR",
        "Mauritius": "INR",
        "Fiji": "INR",
        "Trinidad and Tobago": "INR",
        "Guyana": "INR",
        "Suriname": "INR",
        "South Africa": "INR",
        "Canada": "USD",
        "Australia": "USD",
        "Malaysia": "INR",
        "Singapore": "INR",
        "Indonesia": "INR",
        "Thailand": "INR",
        "Honduras": "INR",
        "South Korea": "INR",
        "Not in this list": "USD",
    };

    const handleChange = (event) => {
        const selectedCountry = event.target.value;
        setCountry(selectedCountry);

        // Automatically set currency based on the selected country
        const selectedCurrency = currencyMapping[selectedCountry] || "";
        setCurrency(selectedCurrency);
        // setSelectedAmount(""); // Reset selected amount if user changes country
        handleSuccess("selection", country)
    };

    const handleChangeCurrency = (event) => {
        setCurrency(event.target.value);
        // setSelectedAmount(""); // Reset selected amount if user changes currency

        handleSuccess("selection", country)
    };

    const handleCheckboxChange = (event) => {
        const value = event.target.value;

        setSelectedAmount(selectedAmount === value ? null : value);
        handleWarning(
            <>
                Click the <img src={target} alt="Contribute Button" style={{ maxWidth: '200px', marginTop: '10px' }} /> Button below, to Contribute.


            </>
        );
    };

    const handleManualAmountChange = (e) => {
        setManualAmount(e.target.value);
        setSelectedAmount(""); // Reset selected amount if user types manually
    };




    const handleButtonClickIn = () => {
        const amountToSubmit = selectedAmount || manualAmount;

        // Make sure there's a valid amount before submitting
        if (!amountToSubmit) {
            handleError("Please select an amount or enter a custom amount.");
            return;
        }

        // Trigger the success message with the rupee symbol and amount

        setNext(true);
        setShowDefult(false);
        setShowOpt(false);


        // Gather all the data for submission
        const formData = {
            contributorType: activeSwitch, // "Indian Donor", "NRI Donor", or "switch3"
            contributionType: activeButton, // for Indian Donor only
            amount: amountToSubmit, // Selected or manual amount
            country: country, // Selected country (for NRI or Foreign)
            currency: currency, // Selected currency

        };

        // Log or send this data for further use (e.g., API call)
        console.log("Form Data:", formData);


        handleSuccess("Thank you for contributing")
        console.log("Amount to submit: ", currency + amountToSubmit);
    };

    const handleButtonClick = () => {
        const amountToSubmit = selectedAmount || manualAmount;

        // Gather all the data for submission
        const formData = {
            contributorType: activeSwitch, // "Indian Donor", "NRI Donor", or "switch3"
            contributionType: activeButton, // for Indian Donor only
            amount: amountToSubmit, // Selected or manual amount
            country: country, // Selected country (for NRI or Foreign)
            currency: currency, // Selected currency
        };

        if (formData.country === "" || !formData.country) {
            handleWarning("Country is required");
            return;

        }

        // Make sure there's a valid amount before submitting
        if (!amountToSubmit) {
            handleError("Please select an amount or enter a custom amount.");
            return;
        }

        // Trigger the success message with the rupee symbol and amount
        setNriOpt(false);
        setNextNRI(true);

        // Log or send this data for further use (e.g., API call)
        console.log("Form Data:", formData);


        handleSuccess("Thank you for contributing")
        console.log("Amount to submit: ", currency + amountToSubmit);
    };


    const handlePaymentInit = async () => {
        const amountToSubmit = selectedAmount || manualAmount;

        if (!amountToSubmit) {
            handleError("Please select an amount or enter a custom amount.");
            return;
        }

        const formData = {
            contributorType: activeSwitch,
            contributionType: activeButton,
            amount: amountToSubmit,
            country,
            currency,
            name: name || (userData ? userData.updateFullName : ""),
            email: mail || (userData ? userData.email : ""),
            mobile: mobile || (userData ? userData.mobile : ""),
            address: address || fuladdress,
            pan,
            passport,
            checked,
        };
        console.log("Form Data:", formData);

        if (formData.email === "" || !formData.email) {
            handleWarning("Email is required");
            return;

        } else if (formData.mobile === "" || !formData.mobile) {
            handleWarning("Mobile is required");
            return;

        } else if (formData.name === "" || !formData.name) {
            handleWarning("Name is required");
            return;

        } else if (formData.address === "" || !formData.address) {
            handleWarning("Address is required");
            return;

        } else if (formData.contributorType === "Indian Donor") {
            if (formData.checked === true) {
                if (formData.pan === "" || !formData.pan) {
                    handleWarning("PAN is required");
                    return;
                }
            }


        } else if (formData.contributorType === "NRI Donor" || formData.contributorType === "switch3") {
            if (formData.passport === "" || !formData.passport) {
                handleWarning("Passport is required");
                return;
            }
        }


        alert("Payment Initiated");

        // try {
        //     // Step 1: Create an order on the backend
        //     const response = await fetch(`${process.env.REACT_APP_API_URL}/payment/create-order`, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({ amount: amountToSubmit, currency: currency || "INR" }),
        //     });

        //     const order = await response.json();

        //     if (!order.id) {
        //         throw new Error("Failed to create Razorpay order");
        //     }

        //     console.log("Order Created: ", order);

        //     // Step 2: Initiate Razorpay Checkout
        //     const options = {
        //         key: process.env.REACT_APP_RAZORPAY_KEY_ID,  // Replace with your Razorpay Key ID
        //         amount: order.amount, // Amount in paisa
        //         currency: order.currency,
        //         name: "Your Organization Name",
        //         description: "Donation Payment",
        //         image: "/logo.png", // Add your organization logo
        //         order_id: order.id,
        //         handler: async function (response) {
        //             console.log("Payment Success", response);

        //             // Step 3: Verify Payment on Backend
        //             const verifyResponse = await fetch(`${process.env.REACT_APP_API_URL}/payment/verify-payment`, {
        //                 method: "POST",
        //                 headers: {
        //                     "Content-Type": "application/json",
        //                 },
        //                 body: JSON.stringify(response),
        //             });

        //             const verificationResult = await verifyResponse.json();

        //             if (verificationResult.success) {
        //                 handleSuccess("Payment Verified Successfully!");
        //                 console.log("Payment Verified");
        //             } else {
        //                 handleError("Payment Verification Failed!");
        //             }
        //         },
        //         prefill: {
        //             name: formData.name,
        //             email: formData.email,
        //             contact: formData.mobile,
        //         },
        //         notes: {
        //             address: formData.address,
        //             pan: formData.pan,
        //             passport: formData.passport,
        //         },
        //         theme: {
        //             color: "#3399cc",
        //         },
        //     };

        //     const rzp = new window.Razorpay(options);
        //     rzp.open();
        // } catch (error) {
        //     console.error("Error initiating payment:", error);
        //     handleError("Payment initiation failed. Please try again.");
        // }
    };



    const handleShowOption = (button) => {
        setActiveButton(button);
        setShowOpt(true);
        setShowDefult(false);
    };

    // Toggle switch states
    const handleSwitchClick = (switchName) => {
        // setActiveSwitch(activeSwitch === switchName ? null : switchName);
        // If the clicked switch is already active, do nothing
        if (activeSwitch === switchName) return;

        if (activeSwitch === "NRI Donor" || activeSwitch === "switch3") {
            setNriOpt(true);

        } else {
            setShowDefult(true);
            setShowOpt(false);

        }

        // Otherwise, update the active switch
        setActiveSwitch(switchName);
        setNext(false);
        setNextNRI(false);
    };



    const [isSmallScreen, setIsSmallScreen] = useState(false);

    // Update screen size state on window resize
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 768); // 768px is a common breakpoint for small screens
        };

        // Initialize on mount
        handleResize();

        // Add resize listener
        window.addEventListener('resize', handleResize);

        // Clean up on unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Check authentication status and fetch user data
    useEffect(() => {
        if (isAuthenticated && userId) {
            localStorage.removeItem("redirectAfterLogin");
            localStorage.removeItem("redirectAfterUpdate");
            console.log('Fetching data for userId:', userId); // Debugging

            // CheckUserProfileBeforeProcced();

            fetchUserData();

        }
    }, [isAuthenticated, userId]);



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







    const CarouselFadeExample = () => {

        return (
            <Carousel fade className='payment'>
                <Carousel.Item style={{ zIndex: 0 }}>
                    {isSmallScreen ? (
                        // Only display text for small screens
                        <Card className="d-block w-100">
                            <Card.Body>
                                <Card.Text>
                                    <span> <strong>Save Children from Hunger: </strong></span> 3000 Children Die In India Every Day Due To Malnutrition. To prevent hunger, a child needs to be taken care of the most during the first 1,000 days of its life, from pregnancy to age two.

                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ) : (
                        // Display image for larger screens
                        <>
                            <Card className="d-block w-100 ">
                                <Card.Title>Save Children from Hunger: </Card.Title>
                                <Card.Img variant="top" src="/food.webp"
                                    style={{ width: '300px', height: '195px', objectFit: 'cover' }} />
                                <Card.Body>
                                    <Card.Text>
                                        3000 Children Die In India Every Day Due To Malnutrition. To prevent hunger, a child needs to be taken care of the most during the first 1,000 days of its life, from pregnancy to age two.

                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </>
                    )}
                </Carousel.Item>

                <Carousel.Item style={{ zIndex: 0 }}>
                    {isSmallScreen ? (
                        // Only display text for small screens
                        <Card className="d-block w-100">
                            <Card.Body>
                                <Card.Text>
                                    <strong> Children's Looking for own Clothes: </strong> With a small gift,  Their confidence level will increase & become good asset to the community. They are developed physically & psychologically & made as good & productive citizens. They will inspire by philanthropy & show humanity towards the community.

                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ) : (
                        // Display image for larger screens
                        <>
                            <Card className="d-block w-100">
                                <Card.Title>Children's Looking for own Clothes</Card.Title>
                                <Card.Img variant="top" src="/cloths.webp"
                                    style={{ width: '250px', height: '148px', objectFit: 'cover' }} />
                                <Card.Body>
                                    <Card.Text>
                                        With a small gift,  Their confidence level will increase & become good asset to the community. They are developed physically & psychologically & made as good & productive citizens. They will inspire by philanthropy & show humanity towards the community.

                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </>
                    )}
                </Carousel.Item>

                <Carousel.Item style={{ zIndex: 0 }}>
                    {isSmallScreen ? (
                        // Only display text for small screens
                        <Card className="d-block w-100">
                            <Card.Body>
                                <Card.Text>
                                    <strong> Many individuals in the Hindu community </strong>   face significant health challenges that hinder their ability to receive appropriate treatment and care. Due to financial constraints, it becomes difficult for families to afford the medical services they urgently need. We can make a difference by providing financial assistance that will enable them to receive the treatment they deserve.

                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ) : (
                        // Display image for larger screens
                        <>
                            <Card className="d-block w-100">
                                <Card.Title>Support for Health and Healing </Card.Title>
                                <Card.Img variant="top" src="/patient-blood.webp"
                                    style={{ width: '250px', height: '145px', objectFit: 'cover', }} />

                                <Card.Body>


                                    <Card.Text style={{ fontSize: "14px" }}>
                                        Many individuals in the Hindu community face significant health challenges that hinder their ability to receive appropriate treatment and care. Due to financial constraints, it becomes difficult for families to afford the medical services they urgently need. We can make a difference by providing financial assistance that will enable them to receive the treatment they deserve.
                                    </Card.Text>


                                </Card.Body>
                            </Card>
                        </>
                    )}
                </Carousel.Item>


            </Carousel>
        );
    }

    const CarouselExample = () => {

        return (
            <Carousel fade className='payment'>
                <Carousel.Item style={{ zIndex: 0 }}>
                    {isSmallScreen ? (
                        // Only display text for small screens
                        <Card className="d-block w-100">
                            <Card.Header>Open the UPI app, which you use, and pay.</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    <span style={{ fontSize: "40px" }}> <strong> <SiPhonepe className='me-1' /> <FaGooglePay className='me-1' /> <SiPaytm className='me-1' /> <FaAmazonPay className='me-1' />    </strong></span>

                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ) : (
                        // Display image for larger screens
                        <>
                            <Card className="d-block w-100 ">
                                <Card.Title>Open the UPI app, which you use, and pay. </Card.Title>
                                <Card.Img variant="top" src="/qr-code.webp"
                                    style={{ width: '185px', height: '165px', objectFit: 'cover' }} />
                                <Card.Body>
                                    <Card.Text>
                                        <span style={{ fontSize: "40px" }}> <strong> <SiPhonepe className='me-1' /> <FaGooglePay className='me-1' /> <SiPaytm className='me-1' /> <FaAmazonPay className='me-1' />    </strong></span>

                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </>
                    )}
                </Carousel.Item>

                <Carousel.Item style={{ zIndex: 0 }}>
                    {isSmallScreen ? (
                        // Only display text for small screens
                        <Card className="d-block w-100">
                            <Card.Header> Scan the QR Code to Initiate Daonation.</Card.Header>
                            <Card.Body>

                                <Card.Img variant="top" src="/scan.png"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                <Card.Img variant="top" src="/scan_pay.jpg"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                            </Card.Body>
                        </Card>
                    ) : (
                        // Display image for larger screens
                        <>
                            <Card className="d-block w-100">
                                <Card.Title>Scan the QR Code to Initiate Daonation.</Card.Title>
                                <Card.Img variant="top" src="/scanNPay.webp"
                                    style={{ width: '250px', height: '148px', objectFit: 'cover' }} />
                                <Card.Body>
                                    <Card.Text>
                                        <span style={{ fontSize: "40px" }}>
                                            <img src='scan.png' alt='scan' width={80} height={80} style={{ marginRight: "10px" }} />
                                            <img src='qr-co.webp' alt='qr' width={90} height={90} style={{ marginRight: "10px" }} />
                                            <img src='scan_pay.jpg' alt='scanNpay' width={90} height={90} style={{ marginRight: "10px" }} />

                                        </span>

                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </>
                    )}
                </Carousel.Item>

                <Carousel.Item style={{ zIndex: 0 }}>
                    {isSmallScreen ? (
                        // Only display text for small screens
                        <Card className="d-block w-100">
                            <Card.Title>Enter the Donation Amount & Pay </Card.Title>
                            <Card.Body>
                                <Card.Text>
                                    <span style={{ fontSize: "40px" }}>
                                        <img src='send2.webp' alt='pay1' width={80} height={80} style={{ marginRight: "10px" }} />
                                        <img src='send1.webp' alt='pay2' width={90} height={90} style={{ marginRight: "10px" }} />
                                        <img src='send3.jpg' alt='pay3' width={90} height={90} style={{ marginRight: "10px" }} />

                                    </span>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ) : (
                        // Display image for larger screens
                        <>
                            <Card className="d-block w-100">
                                <Card.Title>Enter the Donation Amount & Pay </Card.Title>
                                <Card.Img variant="top" src="/send1.webp"
                                    style={{ width: 'auto', height: '205px', objectFit: 'cover', }} />

                                <Card.Body>


                                    <Card.Text>
                                        <span style={{ fontSize: "40px" }}>
                                            <img src='send2.webp' alt='img1' width={80} height={80} style={{ marginRight: "10px" }} />
                                            <img src='send1.webp' alt='img2' width={90} height={90} style={{ marginRight: "10px" }} />
                                            <img src='send3.jpg' alt='img3' width={90} height={90} style={{ marginRight: "10px" }} />

                                        </span>
                                    </Card.Text>


                                </Card.Body>
                            </Card>
                        </>
                    )}
                </Carousel.Item>


            </Carousel>
        );
    }


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

    //     const add = `${userData?.address}, ${userData?.city}, ${userData?.state}`;
    // // You can check if 'add' is a valid string or if it's empty
    // const fuladdress = add ? add : ''; // If 'add' is truthy, use it, otherwise use an empty string


    return (
        <div>
            <div className=''>
                <Form className='switch-container'>
                    <Form.Check
                        className="ms-2 me-2 doner"
                        type="switch"
                        id="custom-switch-doner1"
                        label={<span className={activeSwitch === "Indian Donor" ? "text-dark" : "text-muted"}>Indian Contributor</span>}
                        checked={activeSwitch === "Indian Donor"}
                        onChange={() => handleSwitchClick("Indian Donor")}
                    />


                    <Form.Check
                        className="ms-2 me-2 doner"
                        type="switch"
                        id="custom-switch-doner2"
                        label={<span className={activeSwitch === "NRI Donor" ? "text-dark" : "text-muted"}>NRI Contributor</span>}
                        checked={activeSwitch === "NRI Donor"}
                        onChange={() => handleSwitchClick("NRI Donor")}
                    />
                    <Form.Check
                        className="ms-2 me-2 doner"
                        type="switch"
                        id="custom-switch-doner3"
                        label={<span className={activeSwitch === "switch3" ? "text-dark" : "text-muted"}>Foreign Contributor</span>}
                        checked={activeSwitch === "switch3"}
                        onChange={() => handleSwitchClick("switch3")}
                    />
                    <Form.Check
                        className="ms-2 me-2 doner"
                        type="switch"
                        id="custom-switch-doner4"
                        label={<span className={activeSwitch === "UPI" ? "text-dark" : "text-muted"}>Scan & Contribute</span>}
                        checked={activeSwitch === "UPI"}
                        onChange={() => handleSwitchClick("UPI")}
                    />

                </Form>



                {activeSwitch === "Indian Donor" && (
                    <>
                        <Form.Text>
                            Those who hold an Indian passport and reside in India
                        </Form.Text>
                        <div>
                            <h5 className='opt-con'> Contribute Option </h5>
                            <>
                                <div>
                                    <div>
                                        <Button className={`me-2 con-opt-1 ${activeButton === 'once' ? 'bg-info text-dark' : ''}`} variant="outline-primary" onClick={() => handleShowOption('once')}> <img className='donor-ico' src='/once.png' alt='once' height={25} /> Contribute Once</Button>
                                        <Button className={`me-2 con-opt-2 ${activeButton === 'monthly' ? 'bg-info text-dark' : ''}`} variant="outline-primary" onClick={() => handleShowOption('monthly')} > <img className='donor-ico' alt='monthly' src='/monthly.png' /> Monthly Contribution</Button>
                                    </div>

                                    <div className='norm-gap'>

                                    </div>

                                    {showOpt && (
                                        <div className='paymnt-contain'>
                                            <div className='P-2 me-2 paymnt-1 '>

                                                <Row>
                                                    <Card style={{ maxWidth: '28rem' }}>
                                                        <>
                                                            <label className='cardlbl'>Select Amount</label>

                                                            <input
                                                                type="checkbox"

                                                                className="btn-check p-1"
                                                                id="2000"
                                                                autoComplete="off"
                                                                name="amount"
                                                                value="2000"
                                                                checked={selectedAmount === "2000"}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="btn btn-outline-primary bbb p-1" htmlFor="2000">
                                                                <span className='bbb'>  {rupeeSymbol} 2000</span>
                                                            </label>

                                                            <input
                                                                type="checkbox"

                                                                className="btn-check p-1"
                                                                id="5000"
                                                                autoComplete="off"
                                                                name="amount"
                                                                value="5000"
                                                                checked={selectedAmount === "5000"}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="btn btn-outline-primary bbb p-1" htmlFor="5000" >
                                                                <span className='bbb'>  {rupeeSymbol} 5000</span>
                                                            </label>

                                                            <input
                                                                type="checkbox"
                                                                className="btn-check p-1"
                                                                id="10000"
                                                                autoComplete="off"
                                                                name="amount"
                                                                value="10000"
                                                                checked={selectedAmount === "10000"}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="btn btn-outline-primary bbb p-1" htmlFor="10000">
                                                                <span className='bbb'>  {rupeeSymbol} 10000</span>
                                                            </label>


                                                            <InputGroup className=" mt-1">
                                                                <Button variant="secondary" id="button-addon2" disabled >
                                                                    {rupeeSymbol}
                                                                </Button>
                                                                <Form.Control

                                                                    placeholder="Any Amount you wish to Contribute!"
                                                                    aria-label="Any Amount you wish to Contribute!"
                                                                    value={selectedAmount || manualAmount} // Display selected or manual input amount
                                                                    onChange={handleManualAmountChange} // Allow manual input
                                                                />

                                                            </InputGroup>
                                                            <span className='endtxt'>N.B.: Your donations are tax exempted under 80G of the Indian Income Tax Act</span>

                                                            <Button variant="dark" id="" onClick={handleButtonClickIn}>
                                                                Next {'>'}
                                                            </Button>

                                                        </>

                                                    </Card>
                                                </Row>




                                            </div>

                                            <div className=''>
                                                <Row>
                                                    <Card style={{ maxWidth: '28rem' }}>
                                                        <>


                                                            {CarouselFadeExample()}


                                                        </>







                                                    </Card>
                                                </Row>

                                            </div>


                                        </div>

                                    )}

                                    {showDefult && (
                                        <div className='paymnt-contain'>
                                            <div className='P-2 me-2 paymnt-1 '>

                                                <Row>
                                                    <Card style={{ maxWidth: '28rem' }}>
                                                        <>
                                                            <label className='cardlbl'>Select Amount</label>

                                                            <input
                                                                type="checkbox"
                                                                className="btn-check p-1"
                                                                id="2000"
                                                                autoComplete="off"
                                                                name="amount"
                                                                value="2000"
                                                                checked={selectedAmount === "2000"}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="btn btn-outline-primary bbb p-1" htmlFor="2000">
                                                                <span className='bbb'>  {rupeeSymbol} 2000</span>
                                                            </label>

                                                            <input
                                                                type="checkbox"
                                                                className="btn-check p-1"
                                                                id="5000"
                                                                autoComplete="off"
                                                                name="amount"
                                                                value="5000"
                                                                checked={selectedAmount === "5000"}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="btn btn-outline-primary bbb p-1" htmlFor="5000" >
                                                                <span className='bbb'>  {rupeeSymbol} 5000</span>
                                                            </label>

                                                            <input
                                                                type="checkbox"
                                                                className="btn-check p-1"
                                                                id="10000"
                                                                autoComplete="off"
                                                                name="amount"
                                                                value="10000"
                                                                checked={selectedAmount === "10000"}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="btn btn-outline-primary bbb p-1" htmlFor="10000">
                                                                <span className='bbb'>  {rupeeSymbol} 10000</span>
                                                            </label>


                                                            <InputGroup className=" mt-1">
                                                                <Button variant="secondary" id="button-addon2" disabled >
                                                                    {rupeeSymbol}
                                                                </Button>
                                                                <Form.Control

                                                                    placeholder="Any Amount you wish to Contribute!"
                                                                    aria-label="Any Amount you wish to Contribute!"
                                                                    value={selectedAmount || manualAmount} // Display selected or manual input amount
                                                                    onChange={handleManualAmountChange} // Allow manual input
                                                                />

                                                            </InputGroup>
                                                            <span className='endtxt'>N.B.: Your donations are tax exempted under 80G of the Indian Income Tax Act</span>

                                                            <Button variant="dark" id="" onClick={handleButtonClickIn}>
                                                                Next {'>'}
                                                            </Button>

                                                        </>

                                                    </Card>
                                                </Row>




                                            </div>

                                            <div className=''>
                                                <Row>
                                                    <Card style={{ maxWidth: '28rem' }}>
                                                        <>


                                                            {CarouselFadeExample()}


                                                        </>







                                                    </Card>
                                                </Row>

                                            </div>
                                        </div>
                                    )}


                                </div>
                            </>
                        </div>

                    </>

                )}


                {activeSwitch === "NRI Donor" && (
                    <Form.Text>
                        Those who hold an Indian passport but live outside of India
                    </Form.Text>
                )}
                {activeSwitch === "switch3" && (
                    <Form.Text>
                        Those who hold a passport of a country other than India and are living outside India
                    </Form.Text>
                )}


                {(activeSwitch === "NRI Donor" || activeSwitch === "switch3") && (
                    <>
                        {nriOpt && (
                            <>
                                <div className='d-flex justify-content-center' >
                                    <div className='d-flex justify-content-center mt-5 mx-2' style={{ maxWidth: "300px" }} >
                                        <Box sx={{ minWidth: 200 }}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Country Name</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={country}
                                                    label="Country Name"
                                                    onChange={handleChange}
                                                >

                                                    <MenuItem value="Nepal">Nepal</MenuItem>
                                                    <MenuItem value="Bangladesh">Bangladesh</MenuItem>
                                                    <MenuItem value="Pakistan">Pakistan</MenuItem>
                                                    <MenuItem value="Sri Lanka">Sri Lanka</MenuItem>
                                                    <MenuItem value="Mauritius">Mauritius</MenuItem>
                                                    <MenuItem value="Fiji">Fiji</MenuItem>
                                                    <MenuItem value="Trinidad and Tobago">Trinidad and Tobago</MenuItem>
                                                    <MenuItem value="Guyana">Guyana</MenuItem>
                                                    <MenuItem value="Suriname">Suriname</MenuItem>
                                                    <MenuItem value="South Africa">South Africa</MenuItem>
                                                    <MenuItem value="United States">United States</MenuItem>
                                                    <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                                                    <MenuItem value="Canada">Canada</MenuItem>
                                                    <MenuItem value="Australia">Australia</MenuItem>
                                                    <MenuItem value="Malaysia">Malaysia</MenuItem>
                                                    <MenuItem value="Singapore">Singapore</MenuItem>
                                                    <MenuItem value="Indonesia">Indonesia</MenuItem>
                                                    <MenuItem value="Thailand">Thailand</MenuItem>
                                                    <MenuItem value="Honduras">Honduras</MenuItem>
                                                    <MenuItem value="South Korea">South Korea</MenuItem>
                                                    <MenuItem value="Not in this list">Not in this list</MenuItem>


                                                </Select>
                                            </FormControl>
                                        </Box>

                                    </div>
                                    <div className='d-flex justify-content-center mt-5 mx-2' style={{ maxWidth: "300px" }} >
                                        <Box sx={{ minWidth: 200 }}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Select Currency</InputLabel>
                                                <Select
                                                    defaultValue="INR"
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={currency}
                                                    label="Select Currency"
                                                    onChange={handleChangeCurrency}
                                                >

                                                    <MenuItem value="INR">{rupeeSymbol} ₹</MenuItem>
                                                    <MenuItem value="USD">USD $</MenuItem>
                                                    <MenuItem value="GBP">GBP £</MenuItem>



                                                </Select>
                                            </FormControl>
                                        </Box>

                                    </div>
                                </div>


                                <div className='mt-3'>
                                    <div className='paymnt-contain'>
                                        <div className='P-3 me-3 paymnt-1 '>

                                            <Row>
                                                <Card style={{ maxWidth: '28rem' }}>
                                                    {/* <>
                                                        <label className='cardlbl'>Select Amount</label>

                                                        <input
                                                            type="checkbox"

                                                            className="btn-check p-1"
                                                            id="2000"
                                                            autoComplete="off"
                                                            name="amount"
                                                            value={currency === "INR" ? "2000" : currency === "USD" ? "30" : "20"}
                                                            // value="2000"
                                                            checked={selectedAmount === "2000"}
                                                            onChange={handleCheckboxChange}
                                                        />
                                                        <label className="btn btn-outline-primary bbb p-1" htmlFor="2000">
                                                            <span className='bbb'>  {currency} {currency === "INR" ? "2000" : currency === "USD" ? "30" : "20"} </span>
                                                        </label>

                                                        <input
                                                            type="checkbox"

                                                            className="btn-check p-1"
                                                            id="5000"
                                                            autoComplete="off"
                                                            name="amount"
                                                            value={currency === "INR" ? "5000" : currency === "USD" ? "65" : "50"}
                                                            checked={selectedAmount === "5000"}
                                                            onChange={handleCheckboxChange}
                                                        />
                                                        <label className="btn btn-outline-primary bbb p-1" htmlFor="5000" >
                                                            <span className='bbb'>  {currency} {currency === "INR" ? "5000" : currency === "USD" ? "65" : "50"}  </span>
                                                        </label>

                                                        <input
                                                            type="checkbox"
                                                            className="btn-check p-1"
                                                            id="10000"
                                                            autoComplete="off"
                                                            name="amount"
                                                            value={currency === "INR" ? "10000" : currency === "USD" ? "125" : "100"}
                                                            checked={selectedAmount === "10000"}
                                                            onChange={handleCheckboxChange}
                                                        />
                                                        <label className="btn btn-outline-primary bbb p-1" htmlFor="10000">
                                                            <span className='bbb'>  {currency} {currency === "INR" ? "10000" : currency === "USD" ? "125" : "100"}</span>
                                                        </label>


                                                        <InputGroup className=" mt-1">
                                                            <Button variant="secondary" id="button-addon2" disabled >
                                                                {currency}
                                                            </Button>
                                                            <Form.Control

                                                                placeholder="Any Amount you wish to Contribute!"
                                                                aria-label="Any Amount you wish to Contribute!"
                                                                value={selectedAmount || manualAmount} // Display selected or manual input amount
                                                                onChange={handleManualAmountChange} // Allow manual input
                                                            />

                                                        </InputGroup>
                                                        <span className='endtxt'>What greater reward could there be than seeing a person benefit from <br /> Your Donation?</span>

                                                        <Button variant="dark" id="" onClick={handleButtonClick}>
                                                            Next {'>'}
                                                        </Button>

                                                    </> */}

<>
    <label className='cardlbl'>Select Amount</label>

    <input
        type="checkbox"
        className="btn-check p-1"
        id="2000"
        autoComplete="off"
        name="amount"
        value={currency === "INR" ? "2000" : currency === "USD" ? "30" : "20"}
        checked={selectedAmount === (currency === "INR" ? "2000" : currency === "USD" ? "30" : "20")}
        onChange={handleCheckboxChange}
    />
    <label className="btn btn-outline-primary bbb p-1" htmlFor="2000">
        <span className='bbb'>  {currency} {currency === "INR" ? "2000" : currency === "USD" ? "30" : "20"} </span>
    </label>

    <input
        type="checkbox"
        className="btn-check p-1"
        id="5000"
        autoComplete="off"
        name="amount"
        value={currency === "INR" ? "5000" : currency === "USD" ? "65" : "50"}
        checked={selectedAmount === (currency === "INR" ? "5000" : currency === "USD" ? "65" : "50")}
        onChange={handleCheckboxChange}
    />
    <label className="btn btn-outline-primary bbb p-1" htmlFor="5000">
        <span className='bbb'>  {currency} {currency === "INR" ? "5000" : currency === "USD" ? "65" : "50"}  </span>
    </label>

    <input
        type="checkbox"
        className="btn-check p-1"
        id="10000"
        autoComplete="off"
        name="amount"
        value={currency === "INR" ? "10000" : currency === "USD" ? "125" : "100"}
        checked={selectedAmount === (currency === "INR" ? "10000" : currency === "USD" ? "125" : "100")}
        onChange={handleCheckboxChange}
    />
    <label className="btn btn-outline-primary bbb p-1" htmlFor="10000">
        <span className='bbb'>  {currency} {currency === "INR" ? "10000" : currency === "USD" ? "125" : "100"}</span>
    </label>

    <InputGroup className=" mt-1">
        <Button variant="secondary" id="button-addon2" disabled>
            {currency}
        </Button>
        <Form.Control
            placeholder="Any Amount you wish to Contribute!"
            aria-label="Any Amount you wish to Contribute!"
            value={manualAmount}
            onChange={handleManualAmountChange} // Allow manual input
        />
    </InputGroup>

    <span className='endtxt'>What greater reward could there be than seeing a person benefit from <br /> Your Donation?</span>

    <Button variant="dark" onClick={handleButtonClick}>
        Next {'>'}
    </Button>
</>


                                                </Card>
                                            </Row>




                                        </div>

                                        <div className=''>
                                            <Row>
                                                <Card style={{ maxWidth: '28rem' }}>
                                                    <>
                                                        {CarouselFadeExample()}
                                                    </>
                                                </Card>
                                            </Row>

                                        </div>


                                    </div>
                                </div>
                            </>

                        )}

                    </>

                )}

                {next && !nextNRI && (
                    <>
                        <div>

                            <Button className='amt-div' variant="dark" size="lg"> Total Contribution  <span style={{ fontFamily: "monospace", fontWeight: "bolder" }} >
                                {`${rupeeSymbol} ${selectedAmount || manualAmount}`} </span>
                            </Button>

                            {/* userdata for donation */}
                            <div className='paymnt-contain p-5'>
                                <div className='P-2 me-2 paymnt-1 '>

                                    <Row className='pb-3'>
                                        <Card style={{ maxWidth: '32rem' }}>
                                            <Row className='pt-3'>
                                                <Form.Group as={Col} controlId="formGridEmail">
                                                    <Form.Label>Email</Form.Label>
                                                    <Form.Control type="email" placeholder="Enter email" value={mail || (userData ? userData.email : "")} onChange={(e) => setMail(e.target.value)}
                                                    />
                                                </Form.Group>

                                                <Form.Group as={Col} controlId="formGridMobile">
                                                    <Form.Label>Mobile</Form.Label>
                                                    <Form.Control type="tel" placeholder="Mobile" value={userData?.mobile ? `+${userData.mobile}` : mobile} onChange={(e) => setMobile(e.target.value)}

                                                    />
                                                </Form.Group>



                                            </Row>
                                            <Row>
                                                <Form.Group as={Col} controlId="formGridName">
                                                    <Form.Label>Full Name</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Full Name" value={name || (userData ? userData?.updateFullName : "")}
                                                        onChange={(e) => setName(e.target.value)} />
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formGridAddress">
                                                    <Form.Label>Address</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Address" value={address || fuladdress || ""}
                                                        onChange={(e) => setAddress(e.target.value)}
                                                    />
                                                </Form.Group>

                                            </Row>
                                            <Row className='mt-2'>
                                                <Form.Group as={Col} controlId="formGridPAN" style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Form.Text style={{ fontWeight: 'bold' }}> Require 80G Tax Exp. Certificate* </Form.Text>

                                                    {/* Switch and labels in a single line */}
                                                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 10 }}>
                                                        <span style={{ marginRight: 10, fontWeight: 'bold' }} className={checked ? 'text-muted' : ''}>
                                                            No
                                                        </span>
                                                        <Form.Check
                                                            type="switch"
                                                            id="custom-switch"
                                                            label=""
                                                            checked={checked}
                                                            onChange={handleSwitchChange}
                                                            style={{ marginRight: 10 }}
                                                        />
                                                        <span style={{ fontWeight: 'bold' }} className={checked ? '' : 'text-muted'}>
                                                            Yes
                                                        </span>
                                                    </div>


                                                </Form.Group>
                                            </Row>

                                            {/* PAN Number field when checked */}
                                            {checked && (
                                                <Row>
                                                    <Form.Group as={Col} controlId="formGridPAN" style={{}}>
                                                        <Form.Label>PAN Number</Form.Label>
                                                        <Form.Control type="text" placeholder="Enter PAN Number" name="PAN" value={pan || ""}
                                                            onChange={(e) => setPan(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            )}

                                            <Button className='mt-3 mb-3' onClick={handlePaymentInit}>
                                                Contibute <FcLikePlaceholder />
                                            </Button>
                                        </Card>
                                    </Row>
                                </div>

                            </div>
                        </div>
                    </>

                )}

                {!next && nextNRI && (
                    <>
                        <div>
                            <Button className='amt-div ' variant="dark" size="lg"> Total Contribution  <span style={{ fontFamily: "monospace", fontWeight: "bolder" }} >
                                {`${currency} ${selectedAmount || manualAmount}`} </span>
                            </Button>

                            {/* userdata for donation */}
                            <div className='paymnt-contain p-5'>
                                <div className='P-2 me-2 paymnt-1 '>

                                    <Row className='pb-3'>
                                        <Card style={{ maxWidth: '32rem' }}>
                                            <Row className='pt-3'>
                                                <Form.Group as={Col} controlId="formGridEmail">
                                                    <Form.Label>Email</Form.Label>
                                                    <Form.Control type="email" placeholder="Enter email" value={mail || (userData ? userData.email : "")} onChange={(e) => setMail(e.target.value)}
                                                    />
                                                </Form.Group>

                                                <Form.Group as={Col} controlId="formGridMobile">
                                                    <Form.Label>Mobile</Form.Label>
                                                    <Form.Control type="tel" placeholder="Mobile" value={userData?.mobile ? `+${userData.mobile}` : mobile} onChange={(e) => setMobile(e.target.value)}

                                                    />
                                                </Form.Group>



                                            </Row>
                                            <Row>
                                                <Form.Group as={Col} controlId="formGridName">
                                                    <Form.Label>Full Name</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Full Name" value={name || (userData ? userData.updateFullName : "")}
                                                        onChange={(e) => setName(e.target.value)} />
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formGridAddress">
                                                    <Form.Label>Address</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Address" value={address || fuladdress || ""}
                                                        onChange={(e) => setAddress(e.target.value)}
                                                    />
                                                </Form.Group>

                                            </Row>
                                            <Row className='mt-2'>
                                                <Form.Group as={Col} controlId="formGridPassport" style={{}}>
                                                    <Form.Label>Passport Number</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Passport Number" name="Passport" value={passport || ""}
                                                        onChange={(e) => setPassport(e.target.value)}
                                                    />
                                                </Form.Group>
                                            </Row>



                                            <Button className='mt-3 mb-3' onClick={handlePaymentInit}>
                                                Contibute <FcLikePlaceholder />
                                            </Button>

                                        </Card>
                                    </Row>

                                </div>

                            </div>
                        </div>
                    </>

                )}

                {activeSwitch === "UPI" && (
                    <>
                        <div className='mt-4 p-3'><h3> Contribute Via UPI </h3> </div>
                        <div className='d-flex justify-content-center paymnt-contain'>
                            <div>
                                {/* QR code for upi paymnet */}
                                <Image className=' p-3 scanner' src='food.webp' />


                            </div>

                            <div>
                                {CarouselExample()}
                            </div>



                        </div>

                    </>
                )}




            </div>
            <ToastContainer />


        </div>
    );
};

export default PaymentOption;