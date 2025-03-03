import React, { useState, useEffect, useContext } from "react";
import { Navbar, Nav, Button, Offcanvas, Container, OverlayTrigger, Tooltip, NavDropdown, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthContext from "../../Context/AuthContext";
import { Navigate } from "react-router-dom";
import "./Header.css";

const Header = () => {

    const { user, logout } = useContext(AuthContext);
    const isAuthenticated = !!user;
    const userId = user?.id;
    const [show, setShow] = useState(false);


    const [userData, setUserData] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [showDropdown, setShowDropdown] = useState(false);

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
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
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
        setUserData(null);
    };

    return (
        <>
            {/* Navbar for larger screens */}
            <Navbar expand="lg" className="d-none d-lg-flex bg-primary" variant="dark" style={{
                left: "0px", // Move to bottom-left corner
                zIndex: 1000,
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
                        <Nav.Link href="/forum">Forum</Nav.Link>
                        <Nav.Link href="/aboutUs">About Us</Nav.Link>
                        <Nav.Link href="/joinUs">Join Us</Nav.Link>
                        <Nav.Link href="/donation">Donate</Nav.Link>                        


                        {/* <NavDropdown.Divider /> */}
                        <NavDropdown title="More" id="basic-nav-dropdown"
                            show={showDropdown}
                            onMouseEnter={() => setShowDropdown(true)}
                            onMouseLeave={() => setShowDropdown(false)}
                            align="end">
                            <NavDropdown.Item id="itm" href="/contactUs">Contact Us</NavDropdown.Item>
                            <NavDropdown.Item id="itm" href="/blog">Blog</NavDropdown.Item>
                            <NavDropdown.Item id="itm" href="/faq">FAQ</NavDropdown.Item>                            
                            <NavDropdown.Item id="itms" href="/donate/dashboard">Donor Dashboard</NavDropdown.Item>                            
                            <NavDropdown.Item id="itms" href="/needAssistance">Request for assistance!</NavDropdown.Item>
                            <NavDropdown.Item id="itms" href="/user/survey">Perticipate in the Survey</NavDropdown.Item>
                            <NavDropdown.Item id="itm" href="/survey-stats">View Survey Result</NavDropdown.Item>
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
                            <Nav.Link id="itm" href="/forum" onClick={handleClose} className="py-2">
                                Forum
                            </Nav.Link>

                            <Nav.Link id="itm" href="/aboutUs" onClick={handleClose} className="py-2">
                                About
                            </Nav.Link>

                            <Nav.Link id="itm" href="/joinUs" onClick={handleClose} className="py-2">
                                Join Us
                            </Nav.Link>

                            <Nav.Link id="itm" href="/donation" onClick={handleClose} className="py-2">
                                Donate
                            </Nav.Link>

                            <Nav.Link id="itm" href="/contactUs" onClick={handleClose} className="py-2">
                                Contact Us
                            </Nav.Link>

                            <Nav.Link id="itm" href="/blog" onClick={handleClose} className="py-2">
                                Blog
                            </Nav.Link>

                            <Nav.Link id="itm" href="/faq" onClick={handleClose} className="py-2">
                                FAQ
                            </Nav.Link>

                            <Nav.Link id="itmso" href="/donate/dashboard" onClick={handleClose} className="py-2">
                                Donor Dashboard
                            </Nav.Link>
                            <Nav.Link id="itmso" href="/needAssistance" onClick={handleClose} className="py-2">
                                Request for assistance!
                            </Nav.Link>

                            <Nav.Link id="itmso" href="/user/survey" onClick={handleClose} className="py-2">
                                Participate in the Survey
                            </Nav.Link>

                            <Nav.Link id="itmso" href="/survey-stats" onClick={handleClose} className="py-2">
                                View the Survey Result
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
                                    
                                    <Form.Text style={{fontStyle:"italic", color:"HighlightText"}}>{userData?.updateFullName || userData?.username || userData?.displayName}'s Profile</Form.Text>
                                    </div>
                                </Nav.Link>
                                <Nav.Link className="text-white" style={{
                                    marginRight: "10px",
                                    marginLeft: "15px",
                                }} onClick={handleLogout}>Logout</Nav.Link>
                            </>
                        ) : (
                            <Nav.Link className="text-white" href="/">Login</Nav.Link>
                        )}
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
            
        </>
    );
};

export default Header;

