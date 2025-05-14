// import React, { useState, useContext } from 'react'
// import { useNavigate } from "react-router-dom";
// import { Button, Nav, NavDropdown } from "react-bootstrap";
// import Conference from './Conference';
// import AdminNotices from './AdminNotices';
// import Donor from './Donor';
// import AdminDashboardToHandleBeneficiary from './BeneficiaryHandle';
// import AuthContext from "../Context/AuthContext";
// import Volunteer from './Volunteer';
// import Contact from './Contact';
// import SurveyCreateForm from '../Pages/OpenServey/SurveyCreation';
// import AdminSurveysPage from './SurveyOpen';
// import CampaignerList from './CampaignerList';


// const Admin = () => {
//   const navigate = useNavigate();
//   const [notice, setNotice] = useState(false)
//   const [conference, setConference] = useState(false)
//   const [doner, setDoner] = useState(false)
//   const [beneficiaries, setBeneficiaries] = useState(false)
//   const [volunteers, setVolunteers] = useState(false)
//   const [contact, setContact] = useState(false)
//   const [survey, setSurvey] = useState(false)
//   const [showSurvey, setShowSurvey] = useState(false)
//   const [showCampaigner, setShowCampaigner] = useState(false)
//   const { user } = useContext(AuthContext);  
//   const userId = user?.id;






//   return (
//     <>



//       <Nav justify variant="tabs" defaultActiveKey="" className="sticky-navAH">
//         <Nav.Item>
//           <Nav.Link href="#" className='fs-1 fw-bold'>Admin Pannel</Nav.Link>
//         </Nav.Item>
//       </Nav>
//       <div></div>


//       <Nav justify variant="tabs" defaultActiveKey="" className="sticky-navA">


//         <NavDropdown title="Doner & Volunteer" id="navbarScrollingDropdown" className="donation-dropdown" >
//           <NavDropdown.Item href="#" onClick={() => { setBeneficiaries(true); setConference(false); setDoner(false); setNotice(false); setVolunteers(false); setContact(false); setSurvey(false); setShowSurvey(false); setShowCampaigner(false);}}>Beneficiaries</NavDropdown.Item>
//           <NavDropdown.Item href="#" onClick={() => { setBeneficiaries(false); setConference(false); setDoner(true); setNotice(false); setVolunteers(false); setContact(false); setSurvey(false); setShowSurvey(false); setShowCampaigner(false);}}> Doners </NavDropdown.Item>
//           <NavDropdown.Divider />
//           <NavDropdown.Item href="#" onClick={() => { setBeneficiaries(false); setConference(false); setDoner(false); setNotice(false); setVolunteers(true); setContact(false); setSurvey(false); setShowSurvey(false); setShowCampaigner(false); }}>Volunteer</NavDropdown.Item>
//           <NavDropdown.Item href="#" onClick={() => { setBeneficiaries(false); setConference(false); setDoner(false); setNotice(false); setVolunteers(false); setContact(true); setSurvey(false); setShowSurvey(false); setShowCampaigner(false);}}>Want to Contact</NavDropdown.Item>
//           <NavDropdown.Item href="#" onClick={() => { setBeneficiaries(false); setConference(false); setDoner(false); setNotice(false); setVolunteers(false); setContact(false); setSurvey(false); setShowSurvey(false); setShowCampaigner(true);}}>Campaigner List</NavDropdown.Item>
//         </NavDropdown>

//         <NavDropdown title="Post & Blog" id="navbarScrollingDropdown" className="donation-dropdown" >
        
//         <NavDropdown.Item href={`/user/${userId}/profile`}>Create Posts</NavDropdown.Item>
//         <NavDropdown.Item href={`/blog`}>Create Blog Post</NavDropdown.Item>
//         </NavDropdown>


//         <NavDropdown title="Create Links" id="navbarScrollingDropdown2" className="donation-dropdown">
//           <NavDropdown.Item href="#" onClick={() => { setBeneficiaries(false); setConference(true); setDoner(false); setNotice(false); setVolunteers(false); setContact(false); setSurvey(false); setShowSurvey(false); setShowCampaigner(false); }}>Conference</NavDropdown.Item>
//           <NavDropdown.Item href="#" onClick={() => { setBeneficiaries(false); setConference(false); setDoner(false); setNotice(true); setVolunteers(false); setContact(false); setSurvey(false); setShowSurvey(false); setShowCampaigner(false); }}> Notice </NavDropdown.Item>
//           <NavDropdown.Item href="#" onClick={() => { setBeneficiaries(false); setConference(false); setDoner(false); setNotice(false); setVolunteers(false); setContact(false); setSurvey(true); setShowSurvey(false); setShowCampaigner(false); }}> Survey </NavDropdown.Item>
//           <NavDropdown.Divider />
//           <NavDropdown.Item href="#" onClick={() => { setBeneficiaries(false); setConference(false); setDoner(false); setNotice(false); setVolunteers(false); setContact(false); setSurvey(false); setShowSurvey(true); setShowCampaigner(false); }}>Show Survey </NavDropdown.Item>
//         </NavDropdown>

//         {/* <Nav.Item>
//             <Nav.Link href={`/user/${userId}/profile`}>My Posts</Nav.Link>
            
//           </Nav.Item> */}
//       </Nav>

//       {conference && (
//         <div>
//           <Conference />
//         </div>
//       )}
//       {notice && (
//         <div className='p-3'>
//           <AdminNotices />
//         </div>
//       )}
//       {doner && (
//         <div className='p-3'>
//           <Donor />
//         </div>
//       )}
//       {beneficiaries && (
//         <div className='p-3'>
//           <AdminDashboardToHandleBeneficiary />
//         </div>
//       )}
//       {volunteers && (
//         <div className='p-3'>
//           <Volunteer/>
//         </div>
//       )}
//       {contact && (
//         <div className='p-3'>
//           <Contact/>
//         </div>
//       )}
//       {survey && (
//         <div className='p-3'>
//           <SurveyCreateForm user={user}/>
//         </div>
//       )}

//       {showSurvey && (
//         <div className='p-3'>
//           <AdminSurveysPage/>
//         </div>

//       )}

//       {showCampaigner && (
//         <div className='p-3'>
//           <CampaignerList/>
//         </div>

//       )}





//       <>
//         {/* <div className='mt-4'style={{
//         display: 'none',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: `calc(100vh - 165px)`
//       }}>
//           <Button onClick={() => navigate("/admin/notices")}
//            style={{
//             display: 'flex', alignItems: 'center', padding: '10px 20px',
//             backgroundColor: '#007bff',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer',
//           }}>Create Notice
//           </Button>

//           <Button className='mt-3' onClick={() => navigate("/admin/handleBeneficiary")}
//            style={{
//             display: 'flex', alignItems: 'center', padding: '10px 20px',
//             backgroundColor: '#007bff',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer',
//           }}>Handle Beneficiaries
//           </Button>

//           <Button className='mt-3' onClick={() => navigate("/admin/donor")}
//            style={{
//             display: 'flex', alignItems: 'center', padding: '10px 20px',
//             backgroundColor: '#007bff',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer',
//           }}>Handle Donors
//           </Button>
          
//           <Button className='mt-3' onClick={() => navigate("/admin/conference")}
//            style={{
//             display: 'flex', alignItems: 'center', padding: '10px 20px',
//             backgroundColor: '#007bff',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer',
//           }}>Handle Conference
//           </Button>

//         </div> */}

//         {/* <Nav justify variant="tabs" defaultActiveKey="" className="sticky-navA"> */}

//         {/* <Nav.Link href="/admin/handleBeneficiary">Beneficiaries</Nav.Link> */}
//         {/* <NavDropdown title="Donation" id="navbarScrollingDropdown" className="donation-dropdown" > */}
//         {/* <NavDropdown.Item href="/admin/handleBeneficiary" onClick={() => {setBeneficiaries(true); setConference(false); setDoner(false); setNotice(false);}}>Beneficiaries</NavDropdown.Item> */}
//         {/* <NavDropdown.Item href="/admin/donor" onClick={() => {setBeneficiaries(false); setConference(false); setDoner(true); setNotice(false);}}> Doners </NavDropdown.Item> */}
//         {/* <NavDropdown.Divider /> */}
//         {/* <NavDropdown.Item href="#action5"> Something else here </NavDropdown.Item> */}


//         {/* <Nav.Item> */}
//         {/* <Nav.Link href="#action4">Add Something</Nav.Link> */}
//         {/* <Nav.Link eventKey="link-1">Loooonger NavLink</Nav.Link> */}
//         {/* </Nav.Item> */}

//         {/* <Nav.Link href="/admin/conference"> Conference</Nav.Link> */}
//         {/* <NavDropdown title="Create Links" id="navbarScrollingDropdown2" className="donation-dropdown"> */}
//         {/*    <NavDropdown.Item href="#" onClick={() => {setBeneficiaries(false); setConference(true); setDoner(false); setNotice(false);}}>Conference</NavDropdown.Item> */}
//         {/* <NavDropdown.Item href="/admin/conference" onClick={() => {setBeneficiaries(false); setConference(true); setDoner(false); setNotice(false);}}>Conference</NavDropdown.Item> */}
//         {/* <NavDropdown.Item href="#" onClick={() => {setBeneficiaries(false); setConference(false); setDoner(false); setNotice(true);}}> Notice </NavDropdown.Item> */}
//         {/* <NavDropdown.Item href="/admin/notices" onClick={() => {setBeneficiaries(false); setConference(false); setDoner(false); setNotice(true);}}> Notice </NavDropdown.Item> */}
//         {/* <NavDropdown.Divider /> */}
//         {/* <NavDropdown.Item href="#action5"> Something else here </NavDropdown.Item> */}
//         {/* </NavDropdown> */}
//         {/* <Nav.Link eventKey="link-1">Loooonger NavLink</Nav.Link> */}

//         {/* <Nav.Item>
//          <Nav.Link href={`/user/${userId}/profile`}>My Posts</Nav.Link>
         
//        </Nav.Item> */}
//         {/* </Nav> */}

//       </>

//     </>



//   )
// }

// export default Admin

import React, { useState, useContext } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import {
  FaUserFriends, FaClipboardList, FaBullhorn, FaBlog, FaHandsHelping, FaEnvelopeOpenText, FaChartPie,
  FaOm
} from 'react-icons/fa';

import Conference from './Conference';
import AdminNotices from './AdminNotices';
import Donor from './Donor';
import AdminDashboardToHandleBeneficiary from './BeneficiaryHandle';
import AuthContext from "../Context/AuthContext";
import Volunteer from './Volunteer';
import Contact from './Contact';
import SurveyCreateForm from '../Pages/OpenServey/SurveyCreation';
import AdminSurveysPage from './SurveyOpen';
import CampaignerList from './CampaignerList';

const Admin = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'conference': return <Conference />;
      case 'notices': return <AdminNotices />;
      case 'donors': return <Donor />;
      case 'beneficiaries': return <AdminDashboardToHandleBeneficiary />;
      case 'volunteers': return <Volunteer />;
      case 'contact': return <Contact />;
      case 'createSurvey': return <SurveyCreateForm user={user} />;
      case 'showSurveys': return <AdminSurveysPage />;
      case 'campaigners': return <CampaignerList />;
      default: return (
        <div className="text-center mb-5 ">
          <h2>Welcome to the Admin Panel</h2>
          <p>Select an option from the sidebar to begin.</p>
        </div>
      );
    }
  };

  return (
    <Container fluid className="admin-panel">
      <Row>
        {/* Sidebar */}
        <Col md={2} className="bg-light p-3 border-end" style={{ minHeight: 'calc(100vh - 115px)' }}>
          <h4 className="text-center fw-bold mb-4">Admin Panel</h4>
          <Nav className="flex-column" variant="pills">
            <Nav.Item>
              <Nav.Link active={activeSection === 'beneficiaries'} onClick={() => setActiveSection('beneficiaries')}>
                <FaUserFriends className="me-2" /> Beneficiaries
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link active={activeSection === 'donors'} onClick={() => setActiveSection('donors')}>
                <FaHandsHelping className="me-2" /> Donors
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link active={activeSection === 'volunteers'} onClick={() => setActiveSection('volunteers')}>
                <FaUserFriends className="me-2" /> Volunteers
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link active={activeSection === 'contact'} onClick={() => setActiveSection('contact')}>
                <FaEnvelopeOpenText className="me-2" /> Contact Requests
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link active={activeSection === 'campaigners'} onClick={() => setActiveSection('campaigners')}>
                <FaUserFriends className="me-2" /> Campaigner List
              </Nav.Link>
            </Nav.Item>

            <hr />

            <Nav.Item>
              <Nav.Link active={activeSection === 'conference'} onClick={() => setActiveSection('conference')}>
                <FaClipboardList className="me-2" /> Conference Links
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link active={activeSection === 'notices'} onClick={() => setActiveSection('notices')}>
                <FaBullhorn className="me-2" /> Notices
              </Nav.Link>
            </Nav.Item>

            <hr />

            <Nav.Item>
              <Nav.Link active={activeSection === 'createSurvey'} onClick={() => setActiveSection('createSurvey')}>
                <FaClipboardList className="me-2" /> Create Survey
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link active={activeSection === 'showSurveys'} onClick={() => setActiveSection('showSurveys')}>
                <FaChartPie className="me-2" /> Show Surveys
              </Nav.Link>
            </Nav.Item>

            <hr />

            <Nav.Item>
              <Nav.Link href={`/blog`}>
                <FaBlog className="me-2" /> Create Blog
              </Nav.Link>
              <Nav.Link href={`/user/${userId}/profile`}>
                <FaOm className="me-2" /> Create Post 
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>

        {/* Content Area */}
        <Col md={10} className="p-4">
          {renderSection()}
        </Col>
      </Row>
    </Container>
  );
};

export default Admin;
