import { React, useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from "../../Context/AuthContext";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure this is imported
import './Donation.css';
import { Modal } from 'react-bootstrap';
import { BloodModal, BookModal, ClothModal, DonationModal, FoodModal, LaptopModal, OwnHandModal, SkillModal } from './Modals';
import { FaHeart, FaBook, FaTshirt, FaHandHolding, FaRupeeSign } from "react-icons/fa";
import { GiLaptop } from "react-icons/gi";
import { BiDonateBlood } from "react-icons/bi";
import PaymentOption from './Payment';
import PayOpt from './PayOption';
import Blood from './Blood';
import Mentor from './Mentor';
import { MdBloodtype } from 'react-icons/md';


const Donation = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  console.log("Donation", userId);
  
  const isAuthenticated = !!user;

  const [bookModal, setBookModal] = useState(false);
  const [clothModal, setClothModal] = useState(false);
  const [foodModal, setFoodModal] = useState(false);
  const [ownModal, setOwnModal] = useState(false);
  const [doNationModal, setDoNationModal] = useState(false);
  const [skillModal, setSkillModal] = useState(false);
  const [computerModal, setComputerlModal] = useState(false);
  const [bloodModal, setBloodlModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();


  

  // Check authentication status and fetch user data
  useEffect(() => {
    if (isAuthenticated && userId) {
      localStorage.removeItem("redirectAfterLogin");

      const redirectAfterLogin = localStorage.getItem("redirectAfterUpdateSEC");
      if (redirectAfterLogin) {
        // Remove the section from the URL (we just need the page part)
        const section = redirectAfterLogin;
        if (section) {
          console.log("Redirecting to section:", section);

          const element = document.getElementById(section);
          if (element) {
            window.scrollTo({
              top: element.offsetTop,
              behavior: 'smooth',
            });
          }
        }
        // Clear the stored values after redirection
        localStorage.removeItem("redirectAfterUpdateSEC");
      }
    } 
  }, [isAuthenticated, userId]);

  useEffect(() => {
    const redirectToSec = localStorage.getItem("redirectToSEC");
      const section = redirectToSec;
        if (section) {
          console.log("Redirecting to section:", section);

          const element = document.getElementById(section);
          if (element) {
            window.scrollTo({
              top: element.offsetTop,
              behavior: 'smooth',
            });
          }
        }
        // Clear the stored values after redirection
        localStorage.removeItem("redirectToSEC");
  }, []);




  const handleDonateOwn = () => {
    navigate("/donate");
  }

  const openBookModal = () => {
    setBookModal(true)
  }

  const openClothModal = () => {
    setClothModal(true)
  }


  const openFoodModal = () => {
    setFoodModal(true)
  }

  const openOwnModal = () => {
    setOwnModal(true)
  }

  const openDonationModal = () => {
    setDoNationModal(true)
  }

  const openSkillModal = () => {
    setSkillModal(true)
  }

  const openComputerModal = () => {
    setComputerlModal(true)
  }

  const openBloodModal = () => {
    setBloodlModal(true)
  }



  const handleScrollToSection = async (sectionId) => {
    
    localStorage.setItem("redirectAfterUpdateSEC", sectionId);
    if (!userId) {
      // Ask user to log in
      const userResponse = window.confirm(
        "You have to login and update Profile data!"
      );
  
      if (userResponse) {
        // Store the section to navigate after login & profile update
        localStorage.setItem("redirectAfterUpdate", location.pathname);
        localStorage.setItem("redirectAfterLogin", `/user/update-profile`);
        navigate("/login"); 
      }
      
      return;
    }
  
    // Check if the profile is updated before proceeding
    const isProfileUpdated = await checkUserProfile();
  
    if (!isProfileUpdated) {
      const userResponse = window.confirm(
        "Your profile is not updated. Update your profile to proceed. Press OK to update your profile or Cancel to stay here."
      );
  
      if (userResponse) {
        navigateToProfileUpdate();
      }
      return;
    }
  
    // If everything is fine, scroll to the section
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      });
    }
  };
  
  // Function to check if user profile is updated
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
      return userData.isProfileCompleted; // Ensure this key exists in API response
    } catch (error) {
      console.error("Error in checkUserProfile:", error);
      navigate("/dashboard"); // Redirect to a fallback route if needed
      return false; // Default to false if there's an error
    }
  };
  
  // Function to navigate to profile update page
  const navigateToProfileUpdate = () => {
    if (!userId) throw new Error("Missing user authentication details.");    
    // Store where the user should go after updating the profile
    localStorage.setItem("redirectAfterUpdate", location.pathname);
    navigate(`/user/${userId}/update-profile`);
  };
  










  return (
    <>

      <>
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: `calc(100vh - 135px)` }}>
          <>
            <Carousel slide className='donate'>

            <Carousel.Item>
                <Card className='donate-card' style={{ width: '28rem' }}>
                  <Card.Header className='hdr4'> <h2 className='text-center'> Donate Us </h2></Card.Header>
                  <Card.Img variant="top" src="/doco.webp" />
                  <Card.Body >
                    <Card.Title>To Support our Community</Card.Title>
                    <Card.Text>
                      Your generosity can create a lasting impact. By donating to us, you are directly contributing to ...
                      <div className='text-end me-5' id='rM'>
                        {/* <a className='bt' style={{ cursor: "pointer" }} href="#" onClick={openDonationModal}>Read More</a> */}
                        <Button
                          className="bt"
                          variant='link'
                          style={{ cursor: "pointer" }}
                          onClick={openDonationModal}
                        >
                          Read More
                        </Button>

                      </div>
                    </Card.Text>
                    <div className="d-flex justify-content-center">
                      <Button variant="primary" onClick={() => handleScrollToSection('money-donation')} >Donate Us <FaRupeeSign /> with <FaHeart /></Button>
                    </div>
                  </Card.Body>
                </Card>
              </Carousel.Item>

              {doNationModal && (
                <DonationModal
                  show={doNationModal}
                  onHide={() => setDoNationModal(false)}
                />

              )}



              {/* Blood Donation */}
              <Carousel.Item>
                <Card className='donate-card' style={{ width: '28rem' }}>
                  <Card.Header className='hdr5'> <h2 className='text-center'> Donate Blood </h2></Card.Header>
                  <Card.Img variant="top" src="/Blood.webp" />
                  <Card.Body>

                    <Card.Title>Donate Blood Save Lives</Card.Title>
                    <Card.Text>
                      Blood donation is a simple, yet powerful way to make a life-saving...   <br />
                      <div className='text-end me-5' id='rM'>
                        {/* <a className='bt' style={{ cursor: "pointer" }} href="#" onClick={openBloodModal}>Read More</a> */}
                        <Button
                          className="bt"
                          variant='link'
                          style={{ cursor: "pointer" }}
                          onClick={openBloodModal}
                        >
                          Read More
                        </Button>
                      </div>
                    </Card.Text>
                    <div className="d-flex justify-content-center ">
                      <Button className='me-2' variant="primary" onClick={() => handleScrollToSection('blood-donation')}>Donate <BiDonateBlood /> with <FaHeart /> </Button>
                      <Button variant="primary" onClick={() => navigate("/donate")}>Find those, who need Blood </Button>
                    </div>

                  </Card.Body>
                </Card>
              </Carousel.Item>

              {bloodModal && (
                <BloodModal
                  show={bloodModal}
                  onHide={() => setBloodlModal(false)}
                />
              )}



              {/* donate Skill */}
              <Carousel.Item>
                <Card className='donate-card' style={{ width: '28rem' }}>
                  <Card.Header className='hdr5'> <h2 className='text-center'> Donate Mentorship </h2></Card.Header>
                  <Card.Img variant="top" src="/mentor.webp" />
                  <Card.Body>

                    <Card.Title>Give the Knowledge & Skill to Socity </Card.Title>
                    <Card.Text>
                      Sharing your knowledge and skills with others is a powerful way to...   <br />
                      <div className='text-end me-5' id='rM'>
                        {/* <a className='bt' style={{ cursor: "pointer" }} href="#" onClick={openSkillModal}>Read More</a> */}
                        <Button
                          className="bt"
                          variant='link'
                          style={{ cursor: "pointer" }}
                          onClick={openSkillModal}
                        >
                          Read More
                        </Button>                        
                      </div>
                    </Card.Text>
                    <div className="d-flex justify-content-center">
                      <Button variant="primary" onClick={() => handleScrollToSection('skill-donation')}>Donate <img src='/skill.webp' alt='Skill Donation' style={{ maxHeight: "25px", width: "20px" }} /> with <FaHeart /> </Button>
                      <Button className='ms-2' variant="primary" onClick={() => navigate("/donate")}>Find those, who need Support </Button>
                    </div>

                  </Card.Body>
                </Card>
              </Carousel.Item>

              {skillModal && (
                <SkillModal
                  show={skillModal}
                  onHide={() => setSkillModal(false)}
                />
              )}

              



              {/* Donate Books */}
              <Carousel.Item>
                <Card className='donate-card' style={{ width: '28rem' }}>
                  <Card.Header className='hdr'> <h2 className='text-center'> Donate Books </h2></Card.Header>
                  <Card.Img variant="top" src="/books.webp" />
                  <Card.Body>

                    <Card.Title>Give the Source of Knowledge</Card.Title>
                    <Card.Text>
                      More or less all of you read books and often sell them after finishing. But what if...   <br />
                      <div className='text-end me-5' id='rM'>
                        {/* <a className='bt' style={{ cursor: "pointer" }} href="#" onClick={openBookModal}>Read More</a> */}
                        <Button
                          className="bt"
                          variant='link'
                          style={{ cursor: "pointer" }}
                          onClick={openBookModal}
                        >
                          Read More
                        </Button>
                      </div>
                    </Card.Text>
                    <div className="d-flex justify-content-center">
                      {/* <Button variant="primary" onClick={() => handleScrollToSection('book-donation')}>Donate <FaBook /> with <FaHeart /> </Button> */}
                      <Button variant="primary" onClick={() => navigate("/donate")}>Donate <FaBook /> with <FaHeart /> </Button>
                    </div>

                  </Card.Body>
                </Card>
              </Carousel.Item>

              {bookModal && (
                <BookModal
                  show={bookModal}
                  onHide={() => setBookModal(false)}
                />
              )}

              {/* Donate Cloths */}
              <Carousel.Item>
                <Card className='donate-card' style={{ width: '28rem' }}>
                  <Card.Header className='hdr1'> <h2 className='text-center'> Donate Cloths </h2></Card.Header>
                  <Card.Img variant="top" src="/clith.webp" />
                  <Card.Body>
                    <Card.Title>Give a Outfit, Spread Happiness</Card.Title>
                    <Card.Text>
                      Your donation of clothing can truly change someone’s life. A simple dress can bring a smile...
                      <div className='text-end me-5' id='rM'>
                        {/* <a className='bt' style={{ cursor: "pointer" }} href="#" onClick={openClothModal}>Read More</a> */}
                        <Button
                          className="bt"
                          variant='link'
                          style={{ cursor: "pointer" }}
                          onClick={openClothModal}
                        >
                          Read More
                        </Button>
                      </div>
                    </Card.Text>
                    <div className="d-flex justify-content-center">
                      {/* <Button variant="primary" onClick={() => handleScrollToSection('cloth-donation')}>Donate <FaTshirt /> with <FaHeart /></Button> */}
                      <Button variant="primary" onClick={() => navigate("/donate")}>Donate <FaTshirt /> with <FaHeart /> </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Carousel.Item>

              {clothModal && (
                <ClothModal
                  show={clothModal}
                  onHide={() => setClothModal(false)}
                />
              )}

              {/* donate Foods */}
              <Carousel.Item>
                <Card className='donate-card' style={{ width: '28rem' }}>
                  <Card.Header className='hdr2'> <h2 className='text-center'> Donate Foods </h2></Card.Header>
                  <Card.Img variant="top" src="/foods.webp" />
                  <Card.Body>
                    <Card.Title>Nourish Lives, Spread Kindness</Card.Title>
                    <Card.Text>
                      Your food donation can bring comfort to those struggling with hunger. A small act of kindness...
                      <div className='text-end me-5' id='rM'>
                        {/* <a className='bt' style={{ cursor: "pointer" }} href="#" onClick={openFoodModal}>Read More</a> */}
                        <Button
                          className="bt"
                          variant='link'
                          style={{ cursor: "pointer" }}
                          onClick={openFoodModal}
                        >
                          Read More
                        </Button>
                      </div>
                    </Card.Text>
                    <div className="d-flex justify-content-center">
                      {/* <Button variant="primary" onClick={() => handleScrollToSection('food-donation')}>Donate <img src='/healthi.png' alt='Nutritious Food' style={{ maxHeight: "25px", width: "20px" }} /> with <FaHeart /></Button> */}
                      <Button variant="primary" onClick={() => navigate("/donate")}>Donate <img src='/healthi.png' alt='Nutritious Food' style={{ maxHeight: "25px", width: "20px" }} /> with <FaHeart /> </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Carousel.Item>

              {foodModal && (
                <FoodModal
                  show={foodModal}
                  onHide={() => setFoodModal(false)}
                />
              )}

              {/* donate Learning Gadgets */}
              <Carousel.Item>
                <Card className='donate-card' style={{ width: '28rem' }}>
                  <Card.Header className='hdr6'> <h2 className='text-center'> Donate Learning Gadgets </h2></Card.Header>
                  <Card.Img variant="top" src="/laptop.webp" />
                  <Card.Body>
                    <Card.Title>Empower the Future with Technology</Card.Title>
                    <Card.Text>
                      Your old gadgets could be a gateway to education for someone in need!...
                      <div className='text-end me-5' id='rM'>
                        {/* <a className='bt' style={{ cursor: "pointer" }} href="#" onClick={openComputerModal}>Read More</a> */}
                        <Button
                          className="bt"
                          variant='link'
                          style={{ cursor: "pointer" }}
                          onClick={openComputerModal}
                        >
                          Read More
                        </Button>
                      </div>
                    </Card.Text>
                    <div className="d-flex justify-content-center">
                      {/* <Button variant="primary" onClick={() => handleScrollToSection('laptop-donation')}>Donate <GiLaptop /> with <FaHeart /></Button> */}
                      <Button variant="primary" onClick={() => navigate("/donate")}>Donate <GiLaptop /> with <FaHeart /> </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Carousel.Item>

              {computerModal && (
                <LaptopModal
                  show={computerModal}
                  onHide={() => setComputerlModal(false)}
                />
              )}



              <Carousel.Item>
                <Card className='donate-card' style={{ width: '28rem' }}>
                  <Card.Header className='hdr3'> <h3 className='text-center'> Extend your Helping Hands </h3></Card.Header>
                  <Card.Img variant="top" src="/do-you.webp" />
                  <Card.Body>
                    <Card.Title>Make a Difference</Card.Title>
                    <Card.Text>
                      There’s something truly special about giving directly with your own hands. Your donation can ...
                      <div className='text-end me-5' id='rM'>
                        {/* <a className='bt' style={{ cursor: "pointer" }} href="#" onClick={openOwnModal}>Read More</a> */}
                        <Button
                          className="bt"
                          variant='link'
                          style={{ cursor: "pointer" }}
                          onClick={openOwnModal}
                        >
                          Read More
                        </Button>
                      </div>
                    </Card.Text>
                    <div className="d-flex justify-content-center">
                      <Button variant="primary" onClick={handleDonateOwn}>Donate with <FaHeart /></Button>
                    </div>
                  </Card.Body>
                </Card>
              </Carousel.Item>

              {ownModal && (
                <OwnHandModal
                  show={ownModal}
                  onHide={() => setOwnModal(false)}
                />

              )}




              


            </Carousel>
          </>
        </div>

        {/* Donation Sections */}

        {/* Money Donation Section */}
        <div
          className="container mt-2"
          id="money-donation"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh', paddingTop: '70px', paddingBottom: "60px" }}
        >
          <Card className='shadow ' style={{ minHeight: `calc(100vh - 140px)` }}>

            <div className='contibute' style={{ textAlign: 'center' }}>
              <h2 >Contribute to shape Hindu Community</h2>
            </div>
            <div style={{ textAlign: 'center', marginTop: "10px" }}>
              {/* <PaymentOption /> */}
            <PayOpt/>

            </div>
          </Card>
        </div>

        {/* Blank Donation Section */}
        <div
          className="container mt-2"
          id="blank-donation"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center',   }}
        >
          

            <div className='contibute' style={{ textAlign: 'center' }}>
              {/* <h2 className='pt-3'>Donate Skill & Knowledge to Build "United Hindu Community"</h2> */}
            </div>
            <div style={{ textAlign: 'center', marginTop: "10px" }}>
              

            </div>
          
        </div>


         {/* Slikk Donation Section */}
         <div className='skl' id="skill">
        <div
          className="container mt-2"
          id="skill-donation"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh', paddingTop: '60px', paddingBottom: "60px" }}
        >
          <Card className='shadow ' style={{ minHeight: `calc(100vh - 140px)` }}>

            <div className='contibute' style={{ textAlign: 'center' }}>
              <h2 className='pt-3'>Donate Skill & Knowledge to Build "United Hindu Community"</h2>
            </div>
            <div style={{ textAlign: 'center', marginTop: "10px" }}>
              <Mentor />

            </div>
          </Card>
        </div>
        </div>


        {/* Blood Donation Section */}
        <div
          className="container mt-3"
          id="blood-donation"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center',  minHeight: `calc(100vh - 150px)`, paddingTop: '70px', paddingBottom: "70px" }}
        >
          <Card className='shadow ' style={{ minHeight: `calc(100vh - 140px)` }}>

            <div className='contibute' style={{ textAlign: 'center' }}>
              <h2 className='pt-3'>Hindu Bloods Only for Hindus</h2>
            </div>
            <div style={{ textAlign: 'center', marginTop: "10px" }}>
              <Blood />
              

            </div>
            </Card>
          
        </div>




       


        {/* Book Donation Section */}
        {/* <div
          className="container mt-2"
          id="book-donation"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh', paddingTop: '60px', paddingBottom: "60px" }}
        >
          <Card className='shadow ' style={{ minHeight: `calc(100vh - 140px)` }}>

            <div className='contibute' style={{ textAlign: 'center' }}>
              <h2 className='pt-3'>Donate Book & share Knowledge</h2>
            </div>
            <div style={{ textAlign: 'center', marginTop: "10px" }}>
              

            </div>
          </Card>
        </div>       */}



        {/* Food Donation Section */}
        {/* <div
          className="container mt-2"
          id="food-donation"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh', paddingTop: '60px', paddingBottom: "60px" }}
        >
          <div style={{ textAlign: 'center' }}>
            <p>Food Donation</p>
          </div>
        </div> */}


        {/* Cloth Donation Section */}
        {/* <div
          className="container mt-2"
          id="cloth-donation"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh', paddingTop: '60px', paddingBottom: "60px" }}
        >
          <div style={{ textAlign: 'center' }}>
            <p>Cloth Donation</p>
          </div>
        </div> */}


        {/* Laptop Donation Section */}
        {/* <div
          className="container mt-2"
          id="laptop-donation"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh', paddingTop: '60px', paddingBottom: "60px" }}
        >
          <div style={{ textAlign: 'center' }}>
            <p>Laptop Donation</p>
          </div>
        </div> */}
      </>
    </>


  );
};

export default Donation;
