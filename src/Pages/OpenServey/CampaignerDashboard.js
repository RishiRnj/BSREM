import React, {useState, useEffect, useContext} from 'react'
import { useNavigate } from "react-router-dom";
import { Button, Nav, NavDropdown } from "react-bootstrap";
import  AuthContext  from "../../Context/AuthContext";
import SurveyCreateForm from './SurveyCreation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleError } from '../../Components/Util';
import CampaignerSurveyPage from './CampaignerSurveyList';


const CampaignerDashboard = () => {
  
  const navigate = useNavigate();
  const [createSurvey, setCreateSurvey] = useState(false)
  const [activeSurveys, setActiveSurveys] = useState(false)
  const [completedSurveys, setCompletedSurveys] = useState([])
  const [surveyData, setSurveyData] = useState([])
  const [userData, setUserData] = useState([])

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return navigate("/login");
    }
    // Load user data if editing existing profile
            const loadUserData = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });
    
                    const data = await response.json();
                    const userData = data.user;
                    if (userData.isCampaigner === false) {
                        handleError('You are not a campaigner. Please contact admin to become a campaigner.');
                        navigate('/open-survey/create-own-survey');
                    }
                    console.log('User data:', userData);
                    
                    setUserData(userData)
    
                    
    
                } catch (error) {
                    handleError('Failed to load user data');
                    console.error(error);
                }
            };
    
            loadUserData();

  }, [navigate]);


  return (

    // <div className='pb-5'>
    //   <Nav justify variant="tabs" defaultActiveKey="" className="sticky-navAH">
    //           <Nav.Item>
    //             <Nav.Link href="#" className='fs-1 fw-bold'>Campaigner Pannel</Nav.Link>
    //           </Nav.Item>
    //         </Nav>
    //         <div></div>
      
      
    //         <Nav justify variant="tabs" defaultActiveKey="" className="sticky-navA">
    //           <NavDropdown title="Campaign" id="navbarScrollingDropdown" className="donation-dropdown" >
    //             <NavDropdown.Item href="#" onClick={() => { setCreateSurvey(true); setActiveSurveys(false); setCompletedSurveys(false); setSurveyData(false); }}>Create New Survey Campaign</NavDropdown.Item>
                
    //             <NavDropdown.Divider />
                
    //           </NavDropdown>
      
    //           <NavDropdown title="Post & Blog" id="navbarScrollingDropdown" className="donation-dropdown" >
              
    //           {/* <NavDropdown.Item href={`/user/${userId}/profile`}>Create Posts</NavDropdown.Item> */}
    //           <NavDropdown.Item href={`/blog`}>Create Blog Post</NavDropdown.Item>

    //           </NavDropdown>
    //           <NavDropdown title="Campaign Result" id="navbarScrollingDropdown2" className="donation-dropdown">
    //           <NavDropdown.Item href="#" onClick={() => { setCreateSurvey(false); setActiveSurveys(false); setCompletedSurveys(false); setSurveyData(true);  }}>View active Survey and Result</NavDropdown.Item>
                
    //           </NavDropdown>             
    //         </Nav>


    //         {createSurvey && (
    //           <SurveyCreateForm user={userData}/>
    //         )}

    //         {surveyData && (
    //           <CampaignerSurveyPage/>
    //         )}
      
      
    //         <ToastContainer/>
    // </div>

        <div className="container py-4">
      {/* Header */}
      <h2 className="text-center text-primary mb-4">🎯 Campaigner Panel</h2>

      {/* Top Navigation Section */}
      <Nav justify variant="tabs" defaultActiveKey="" className="mb-4 border rounded shadow-sm bg-light">
        <Nav.Item>
          <Nav.Link disabled className="text-dark fw-semibold fs-5">Navigation</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Functional Navigation */}
      <Nav justify variant="tabs" defaultActiveKey="" className="mb-4 border rounded shadow-sm bg-white">
        <NavDropdown title="🗳 Campaign" id="campaign-dropdown" className="text-dark">
          <NavDropdown.Item
            onClick={() => {
              setCreateSurvey(true);
              setSurveyData(false);
            }}
          >
            ➕ Create New Survey Campaign
          </NavDropdown.Item>
        </NavDropdown>

        <NavDropdown title="📝 Post & Blog" id="blog-dropdown">
          <NavDropdown.Item href="/blog">Create Blog Post</NavDropdown.Item>
        </NavDropdown>

        <NavDropdown title="📊 Campaign Result" id="result-dropdown">
          <NavDropdown.Item
            onClick={() => {
              setCreateSurvey(false);
              setSurveyData(true);
            }}
          >
            View Active Surveys & Results
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>

      {/* Conditional Sections */}
      {createSurvey && (
        <div className="bg-white rounded shadow-sm mb-4">
          
          <SurveyCreateForm user={userData} />
        </div>
      )}

      {surveyData && (
        <div className="p-4 bg-white rounded shadow-sm mb-4">
          <h4 className="mb-3 text-secondary">Your Survey Campaigns</h4>
          <CampaignerSurveyPage />
        </div>
      )}

      {/* Toasts */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}

export default CampaignerDashboard