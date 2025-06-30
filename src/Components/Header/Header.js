import React, { useState, useEffect, useContext } from "react";
import { Navbar, Nav, Button, Offcanvas, Container, OverlayTrigger, Tooltip, NavDropdown, Form, Dropdown, Accordion } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthContext from "../../Context/AuthContext";
import { Navigate } from "react-router-dom";
import "./Header.css";
import { HouseFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { MdCampaign, MdDashboardCustomize, MdForum, MdSpaceDashboard } from "react-icons/md";
import { IoCreate, IoHome } from "react-icons/io5";
import { FaBloggerB, FaCarSide, FaClipboardList,  FaHandsHelping, FaOm } from "react-icons/fa";
import { BsClipboard2DataFill } from "react-icons/bs";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { GrContact } from "react-icons/gr";
import { FcConferenceCall, FcFaq } from "react-icons/fc";
import { LiaClipboardListSolid } from "react-icons/lia";


const Header = () => {

    const { user, logout } = useContext(AuthContext);
    console.log("user", user);
    
    const isAuthenticated = !!user;
    const userId = user?.id;
    console.log("user id", userId);
    const [show, setShow] = useState(false);

    const navigate = useNavigate();


    const [userData, setUserData] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showJDropdown, setShowJDropdown] = useState(false);

    const [showDonateDropdown, setShowDonateDropdown] = useState(false);
    const [showSurveyMenu, setShowSurveyMenu] = useState(false);


    // Check authentication status and fetch user data
    useEffect(() => {
        if (isAuthenticated) {
            console.log('Fetching data for userId:', userId); // Debugging
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
                        credentials: 'include', // Important for cookies or sessions
                        method: 'GET',
                        headers: {
                            'Cache-Control': 'no-cache',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        console.log("Fetched data:", data); // <--- Add this
                        setUserData(data);  // Set the fetched user data

                    } else {
                        console.error("Failed to fetch user data");
                    }
                } catch (error) {
                    console.error("Error fetching user data", error);
                }
            };

            fetchUserData();
        }
    }, [isAuthenticated, userId]);
    console.log('Fetched userData in Header:', userData);


    // Handle logout
    const handleLogout = () => {
        logout();
        navigate('/dashboard');
        setUserData(null);
    };



    const redirectToDonate = () => {

        localStorage.setItem("redirectToSEC", "money-donation"); // Set localStorage item
        setShow(false)
        navigate('/donation', { replace: true }); // Navigate to the donation page
        window.location.reload(); // Reload the page after the navigation
    };

    const redirectToBlDonate = () => {

        localStorage.setItem("redirectToSEC", "blankB-donation"); // Set localStorage item
        setShow(false)
        navigate('/donation', { replace: true }); // Navigate to the donation page
        window.location.reload(); // Reload the page after the navigation
    };

    const redirectToMentorDonate = () => {
        localStorage.setItem("redirectToSEC", "blank-donation"); // Set localStorage item
        setShow(false)
        navigate('/donation', { replace: true }); // Navigate to the donation page
        window.location.reload(); // Reload the page after the navigation
    };

    

    const redirectToBookDonate = () => {
        localStorage.setItem("redirectToSEC", "blankBk-donation"); // Set localStorage item
        setShow(false)
        navigate('/donation', { replace: true }); // Navigate to the donation page
        window.location.reload(); // Reload the page after the navigation
    };

    const redirectToClothsDonate = () => {
        localStorage.setItem("redirectToSEC", "blankC-donation"); // Set localStorage item
        setShow(false)
        navigate('/donation', { replace: true }); // Navigate to the donation page
        window.location.reload(); // Reload the page after the navigation
    };

    const redirectToFoodDonate = () => {
        localStorage.setItem("redirectToSEC", "blankF-donation"); // Set localStorage item
        setShow(false)
        navigate('/donation', { replace: true }); // Navigate to the donation page
        window.location.reload(); // Reload the page after the navigation
    };
    const redirectToGadgetDonate = () => {
        localStorage.setItem("redirectToSEC", "blankLG-donation"); // Set localStorage item
        setShow(false)
        navigate('/donation', { replace: true }); // Navigate to the donation page
        window.location.reload(); // Reload the page after the navigation
    };
    const redirectToTOYDonate = () => {
        localStorage.setItem("redirectToSEC", "toy-donation"); // Set localStorage item
        setShow(false)
        navigate('/donation', { replace: true }); // Navigate to the donation page
        window.location.reload(); // Reload the page after the navigation
    };

    const surveyMenu = () => {
        setShowSurveyMenu(true)
    }

    return (
        <>
            {/* Navbar for larger screens */}
            <Navbar expand="lg" className="d-none d-lg-flex bg-primary" variant="dark" style={{
                left: "0px", // Move to bottom-left corner
                zIndex: 1100,
                position: "sticky",
                top: "0px",
                right: "0px"

            }}>
                <Container >
                    <Navbar.Brand href="/admin">
                        <img src="/logo512c.webp" width={40} height={40} alt="Logo" style={{ marginRight: "10px" }} />
                        BSREM
                    </Navbar.Brand>
                    <Nav className="ms-auto d-flex align-items-center">
                        <Nav.Link href="/dashboard"><HouseFill className="mb-1"/></Nav.Link>
                        {user && user.isCampaigner === true && (
                        <Nav.Link href="/campaigner-dashboard"><MdCampaign className="mb-1"/> Campaigner Home </Nav.Link>)}

                       

                        <NavDropdown title="Donate for Community" id="basic-nav-dropdown"
                            show={showDonateDropdown}
                            onMouseEnter={() => setShowDonateDropdown(true)}
                            onMouseLeave={() => setShowDonateDropdown(false)}
                            align="end">
                            <NavDropdown.Item id="itms" href="/donate">Donor Dashboard</NavDropdown.Item>   
                            <NavDropdown.Item id="itms" href="/donation">Make Donation, Earn Salvation</NavDropdown.Item>
                            <NavDropdown.Item id="itmSu" className="ps-4"
                                onClick={redirectToDonate}
                            //  href="/donation"
                            >Donate Money</NavDropdown.Item>
                            <NavDropdown.Item id="itmSu" className="ps-4"
                                onClick={redirectToBlDonate}
                            // href="/donation"
                            >Donate Blood</NavDropdown.Item>
                            <NavDropdown.Item id="itmSu" className="ps-4"
                                onClick={redirectToMentorDonate}
                            // href="/donation"
                            >Donate Mentorship</NavDropdown.Item>

                            <NavDropdown.Item id="itmSu" className="ps-4"
                                onClick={redirectToBookDonate}
                            // href="/donation"
                            >Donate Old Books</NavDropdown.Item>

                            <NavDropdown.Item id="itmSu" className="ps-4"
                                onClick={redirectToClothsDonate}
                            // href="/donation"
                            >Donate Clothes</NavDropdown.Item>

                            <NavDropdown.Item id="itmSu" className="ps-4"
                                onClick={redirectToFoodDonate}
                            // href="/donation"
                            >Donate Foods</NavDropdown.Item>

                            <NavDropdown.Item id="itmSu" className="ps-4"
                                onClick={redirectToGadgetDonate}
                            // href="/donation"
                            >Donate Old Learning Gadgets</NavDropdown.Item>
                            
                            <NavDropdown.Item id="itmSu" className="ps-4"
                                onClick={redirectToTOYDonate}
                            // href="/donation"
                            >Donate Old Toys</NavDropdown.Item>

                            {/* commented for now */}
                            {/* <NavDropdown.Item id="itms" className=""
                                
                            href="/car_for_charity"
                            >Car for Charity</NavDropdown.Item> */}
                            
                            
                            

                        </NavDropdown>

                        <Nav.Link href="/forum">Say <FaOm className="mb-1" /></Nav.Link>

                        {/* <Nav.Link href="/donation">Donate</Nav.Link> */}
                        <Nav.Link href="/aboutUs">About Us</Nav.Link>
                        <Nav.Link href="/joinUs">Join Us</Nav.Link>


                        {/* <NavDropdown.Divider /> */}
                        <NavDropdown title="More" id="basic-nav-dropdown"
                            show={showDropdown}
                            onMouseEnter={() => setShowDropdown(true)}
                            onMouseLeave={() => setShowDropdown(false)}
                            align="end">

                            <NavDropdown.Item id="itms" href="/register/for_support">Request for Support!</NavDropdown.Item>
                            {userId && (
                                                <>
                                            <NavDropdown.Item id="itmso" href="/user/survey" onClick={handleClose} className="py-2">
                                                Participate in User Survey <FaClipboardList/>
                                            </NavDropdown.Item>
                                            <NavDropdown.Item id="itmso" href="/survey-stats" onClick={handleClose} className="py-2">
                                            View User Survey Result <BsClipboard2DataFill />
                                        </NavDropdown.Item>
                                        </>
                                            )}
                            
                            <NavDropdown.Item id="itmSu" className="ps-4" href="/open-survey">Perticipate in Open Survey</NavDropdown.Item>
                            {user?.isCampaigner !== true && (
                            <NavDropdown.Item id="itmSu" className="ps-4" href="/open-survey/create-own-survey">Create own Survey Campaign</NavDropdown.Item>)}
                            <NavDropdown.Item id="itmSu" className="ps-4" href="/user/have-suggestions">Have Suggestions?</NavDropdown.Item>
                            <NavDropdown.Item id="itms" href="/youth">Youth Conference</NavDropdown.Item>
                            <NavDropdown.Item id="itm" href="/contactUs">Contact Us</NavDropdown.Item>
                            <NavDropdown.Item id="itm" href="/blog">Blog</NavDropdown.Item>
                            <NavDropdown.Item id="itm" href="/faq">FAQ</NavDropdown.Item>
                            {isAuthenticated ? (
                                <NavDropdown.Item id="itm" href={userId ? `/user/${userId}/profile` : "/"}> User Profile </NavDropdown.Item>
                            ) : (
                                <NavDropdown.Item id="itm" href={"/user/:id/profile"}>User Profile</NavDropdown.Item>
                            )}
                        </NavDropdown>


                        {/* Dynamic Section */}
                        {isAuthenticated ? (
                            <>
                                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                                <OverlayTrigger placement={"bottom"} overlay={<Tooltip id="tooltip-bottom">Click here go to User Page!</Tooltip>}>
                                    <Nav.Link href={userId ? `/user/${userId}/profile` : "/"}>
                                        <img
                                            src={userData?.userImage || "/user.png"}
                                            alt="User"
                                            title={userData?.updateFullName || userData?.username || "User"} // Tooltip displays name or fallback text
                                            style={{
                                                marginRight: "10px",
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </Nav.Link>
                                </OverlayTrigger>
                            </>
                        ) : (
                            <Nav.Link href={"/"}></Nav.Link>
                        )}
                    </Nav>
                </Container>

            </Navbar>

            {/* Hamburger menu for smaller screens */}
            <Navbar className="d-flex d-lg-none bg-primary" variant="dark" style={{
                left: "0px", // Move to bottom-left corner
                zIndex: 1000,
                position: "sticky",
                top: "0px",
                right: "0px"

            }}>
                <Container>
                    <Navbar.Brand href="/admin">
                        <img src="/logo512c.webp" alt="Logo" width={40} height={40} style={{ marginRight: "10px" }} />
                        BSREM
                    </Navbar.Brand>
                    <Button variant="outline-light" onClick={handleShow}>
                        ☰
                    </Button>
                </Container>
            </Navbar>

            {/* Offcanvas menu for smaller screens */}
            <Offcanvas show={show} onHide={handleClose} placement="start">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>BSREM</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div>
                        <Nav className="flex-column">
                           
                            {isAuthenticated ? (
                            <>

                                <Nav.Link href={userId ? `/user/${userId}/profile` : "/"}>
                                User Home <IoHome />
                                </Nav.Link>

                                <Nav.Link id="itm" href="/dashboard" onClick={handleClose} className="py-2">
                            Dashboard <MdSpaceDashboard />
                        </Nav.Link>
                                
                            </>
                        ) : (
                            <Nav.Link id="itm" href="/dashboard" onClick={handleClose} className="py-2">
                            Guest Home <IoHome />
                        </Nav.Link>
                            
                        )}
                        {user && user.isCampaigner === true && (
                        <Nav.Link href="/campaigner-dashboard">Campaigner Home <MdCampaign className="mb-1"/></Nav.Link>)}

                            <Nav.Link id="itm" href="/forum" onClick={handleClose} className="py-2">
                                Say <FaOm className="mb-1"/>
                            </Nav.Link>    

                            <Nav.Link id="itmso" href="/donate" onClick={handleClose} className="py-2 mt-1">
                                Donor Beneficiary Dashboard <MdDashboardCustomize/>
                            </Nav.Link>

                            <Nav.Link id="itmso" href="/register/for_support" onClick={handleClose} className="py-2 mb-1">
                                Request for Support! <FaHandsHelping/>
                            </Nav.Link>
  
                            
                            {/* Donate Accordion */}
                            <Accordion align="right" className=" me-5">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Make Donation, Earn Salvation</Accordion.Header>
                                    <Accordion.Body>
                                        <Nav className="flex-column">
                                            <Nav.Link id="itmso" href="/donation" onClick={handleClose} className="py-2">
                                            Donation Categories
                                            </Nav.Link>

                                            <Nav.Link id="itmso" href="/donation" onClick={redirectToDonate} className="py-2">
                                                Donate Money
                                            </Nav.Link>

                                            <Nav.Link id="itmso" href="/donation" onClick={redirectToBlDonate} className="py-2">
                                                Donate Blood
                                            </Nav.Link>

                                            <Nav.Link id="itmso" href="/donation" onClick={redirectToMentorDonate} className="py-2">
                                                Donate Mentorship
                                            </Nav.Link>
                                            <Nav.Link id="itmso" href="/donation" onClick={redirectToBookDonate} className="py-2">
                                                Donate Old Books
                                            </Nav.Link>
                                            <Nav.Link id="itmso" href="/donation" onClick={redirectToClothsDonate} className="py-2">
                                                Donate Clothes
                                            </Nav.Link>
                                            <Nav.Link id="itmso" href="/donation" onClick={redirectToFoodDonate} className="py-2">
                                                Donate Foods
                                            </Nav.Link>
                                            <Nav.Link id="itmso" href="/donation" onClick={redirectToGadgetDonate} className="py-2">
                                                Donate Old Learning Gadgets
                                            </Nav.Link>
                                            <Nav.Link id="itmso" href="/donation" onClick={redirectToTOYDonate} className="py-2">
                                                Donate Old Toys
                                            </Nav.Link>
                                        </Nav>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>

                            {/* commented for now  vehicle*/} 
                             {/* <Nav.Link id="itm" href="/car_for_charity" onClick={handleClose} className="py-2">
                             Car for Charity <FaCarSide/>
                            </Nav.Link>      */}
 
                          
                            {/* Survey Accordion */}
                            <Accordion align="right" className=" me-5">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Survey <HiClipboardDocumentList /> </Accordion.Header>
                                    <Accordion.Body>
                                        <Nav className="flex-column">
                                            {userId && (
                                                <>
                                            <Nav.Link id="itmso" href="/user/survey" onClick={handleClose} className="py-2">
                                                Participate in User Survey <FaClipboardList/>
                                            </Nav.Link>
                                            <Nav.Link id="itmso" href="/survey-stats" onClick={handleClose} className="py-2">
                                            View User Survey Result <BsClipboard2DataFill />
                                        </Nav.Link>
                                        </>
                                            )}
                                            <Nav.Link id="itmso" href="/open-survey" onClick={handleClose} className="py-2">
                                            Participate in Open Survey <LiaClipboardListSolid  />
                                            </Nav.Link>
                                            
                                            {user?.isCampaigner !== true && (
                                            <Nav.Link id="itmso" href="/open-survey/create-own-survey" onClick={handleClose} className="py-2">
                                                Create own Survey Campaign <IoCreate />
                                            </Nav.Link>)}
                                        </Nav>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>   

                                                


                            <Nav.Link id="itmso" href="/user/have-suggestions" onClick={handleClose} className="py-2 mt-1">
                                Have Suggestions?
                            </Nav.Link> 

                            <Nav.Link id="itmso" href="/youth" onClick={handleClose} className="py-2 mt-1">
                                Register for Youth Conference <FcConferenceCall/>
                            </Nav.Link> 

                            <Nav.Link id="itm" href="/aboutUs" onClick={handleClose} className="py-2">
                                About
                            </Nav.Link>

                            <Nav.Link id="itm" href="/joinUs" onClick={handleClose} className="py-2">
                                Join Us 
                            </Nav.Link>

                            <Nav.Link id="itm" href="/contactUs" onClick={handleClose} className="py-2">
                                Contact Us <GrContact />
                            </Nav.Link>

                            

                            <Nav.Link id="itm" href="/blog" onClick={handleClose} className="py-2">
                                Blog <FaBloggerB/>
                            </Nav.Link>

                            <Nav.Link id="itm" href="/faq" onClick={handleClose} className="py-2">
                                FAQ <FcFaq />
                            </Nav.Link>


                        </Nav>


                    </div>

                    {/* Dynamic Footer Section */}

                    <div className="d-flex justify-content-left align-items-center bg-success p-3 rounded mt-2">

                        {isAuthenticated ? (
                            <>

                                <Nav.Link href={userId ? `/user/${userId}/profile` : "/"}>
                                    <div className="d-flex justify-content-center align-items-center flex-column">
                                        <img
                                            src={userData?.userImage || "/user.png"}
                                            alt={"User"}
                                            title={userData?.updateFullName || userData?.username || "User"} // Tooltip displays name or fallback text
                                            style={{

                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                            }}
                                        />

                                        <Form.Text style={{textAlign: 'center', fontStyle: "italic", color: "HighlightText",  wordWrap: 'break-word', overflowWrap: 'break-word',  width: '80px' }}>{userData?.updateFullName || userData?.username || userData?.displayName}'s Profile</Form.Text>
                                    </div>
                                </Nav.Link>
                                <Nav.Link className="text-white" style={{
                                    marginRight: "10px",
                                    marginLeft: "15px",
                                }} onClick={handleLogout}>Logout</Nav.Link>
                            </>
                        ) : (
                            <Nav.Link className="text-white" href="/login">Login</Nav.Link>
                        )}
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

        </>
    );
};

export default Header;

