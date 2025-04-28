import React, { useState, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { Button, Nav, NavDropdown } from "react-bootstrap";
import Conference from './Conference';
import AdminNotices from './AdminNotices';
import Donor from './Donor';
import AdminDashboardToHandleBeneficiary from './BeneficiaryHandle';
import AuthContext from "../Context/AuthContext";
import Volunteer from './Volunteer';
import Contact from './Contact';


const Admin = () => {
  const navigate = useNavigate();
  const [notice, setNotice] = useState(false)
  const [conference, setConference] = useState(false)
  const [doner, setDoner] = useState(false)
  const [beneficiaries, setBeneficiaries] = useState(false)
  const [volunteers, setVolunteers] = useState(false)
  const [contact, setContact] = useState(false)
  const { user } = useContext(AuthContext);  
  const userId = user?.id;






  return (
    <>



      <Nav justify variant="tabs" defaultActiveKey="" className="sticky-navAH">
        <Nav.Item>
          <Nav.Link href="#" className='fs-1 fw-bold'>Admin Pannel</Nav.Link>
        </Nav.Item>
      </Nav>
      <div></div>


      <Nav justify variant="tabs" defaultActiveKey="" className="sticky-navA">


        <NavDropdown title="Doner & Volunteer" id="navbarScrollingDropdown" className="donation-dropdown" >
          <NavDropdown.Item href="#" onClick={() => { setBeneficiaries(true); setConference(false); setDoner(false); setNotice(false); setVolunteers(false); setContact(false); }}>Beneficiaries</NavDropdown.Item>
          <NavDropdown.Item href="#" onClick={() => { setBeneficiaries(false); setConference(false); setDoner(true); setNotice(false); setVolunteers(false); setContact(false); }}> Doners </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#" onClick={() => { setBeneficiaries(false); setConference(false); setDoner(false); setNotice(false); setVolunteers(true); setContact(false); }}>Volunteer</NavDropdown.Item>
          <NavDropdown.Item href="#" onClick={() => { setBeneficiaries(false); setConference(false); setDoner(false); setNotice(false); setVolunteers(false); setContact(true); }}>Want to Contact</NavDropdown.Item>
        </NavDropdown>

        <NavDropdown title="Post & Blog" id="navbarScrollingDropdown" className="donation-dropdown" >
        
        <NavDropdown.Item href={`/user/${userId}/profile`}>Create Posts</NavDropdown.Item>
        <NavDropdown.Item href={`/blog`}>Create Blog Post</NavDropdown.Item>
        </NavDropdown>


        <NavDropdown title="Create Links" id="navbarScrollingDropdown2" className="donation-dropdown">
          <NavDropdown.Item href="#" onClick={() => { setBeneficiaries(false); setConference(true); setDoner(false); setNotice(false); setVolunteers(false); setContact(false); }}>Conference</NavDropdown.Item>
          <NavDropdown.Item href="#" onClick={() => { setBeneficiaries(false); setConference(false); setDoner(false); setNotice(true); setVolunteers(false); setContact(false); }}> Notice </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#"> Something else here </NavDropdown.Item>
        </NavDropdown>

        {/* <Nav.Item>
            <Nav.Link href={`/user/${userId}/profile`}>My Posts</Nav.Link>
            
          </Nav.Item> */}
      </Nav>

      {conference && (
        <div>
          <Conference />
        </div>
      )}
      {notice && (
        <div className='p-3'>
          <AdminNotices />
        </div>
      )}
      {doner && (
        <div className='p-3'>
          <Donor />
        </div>
      )}
      {beneficiaries && (
        <div className='p-3'>
          <AdminDashboardToHandleBeneficiary />
        </div>
      )}
      {volunteers && (
        <div className='p-3'>
          <Volunteer/>
        </div>
      )}
      {contact && (
        <div className='p-3'>
          <Contact/>
        </div>
      )}





      <>
        {/* <div className='mt-4'style={{
        display: 'none',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: `calc(100vh - 165px)`
      }}>
          <Button onClick={() => navigate("/admin/notices")}
           style={{
            display: 'flex', alignItems: 'center', padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}>Create Notice
          </Button>

          <Button className='mt-3' onClick={() => navigate("/admin/handleBeneficiary")}
           style={{
            display: 'flex', alignItems: 'center', padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}>Handle Beneficiaries
          </Button>

          <Button className='mt-3' onClick={() => navigate("/admin/donor")}
           style={{
            display: 'flex', alignItems: 'center', padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}>Handle Donors
          </Button>
          
          <Button className='mt-3' onClick={() => navigate("/admin/conference")}
           style={{
            display: 'flex', alignItems: 'center', padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}>Handle Conference
          </Button>

        </div> */}

        {/* <Nav justify variant="tabs" defaultActiveKey="" className="sticky-navA"> */}

        {/* <Nav.Link href="/admin/handleBeneficiary">Beneficiaries</Nav.Link> */}
        {/* <NavDropdown title="Donation" id="navbarScrollingDropdown" className="donation-dropdown" > */}
        {/* <NavDropdown.Item href="/admin/handleBeneficiary" onClick={() => {setBeneficiaries(true); setConference(false); setDoner(false); setNotice(false);}}>Beneficiaries</NavDropdown.Item> */}
        {/* <NavDropdown.Item href="/admin/donor" onClick={() => {setBeneficiaries(false); setConference(false); setDoner(true); setNotice(false);}}> Doners </NavDropdown.Item> */}
        {/* <NavDropdown.Divider /> */}
        {/* <NavDropdown.Item href="#action5"> Something else here </NavDropdown.Item> */}


        {/* <Nav.Item> */}
        {/* <Nav.Link href="#action4">Add Something</Nav.Link> */}
        {/* <Nav.Link eventKey="link-1">Loooonger NavLink</Nav.Link> */}
        {/* </Nav.Item> */}

        {/* <Nav.Link href="/admin/conference"> Conference</Nav.Link> */}
        {/* <NavDropdown title="Create Links" id="navbarScrollingDropdown2" className="donation-dropdown"> */}
        {/*    <NavDropdown.Item href="#" onClick={() => {setBeneficiaries(false); setConference(true); setDoner(false); setNotice(false);}}>Conference</NavDropdown.Item> */}
        {/* <NavDropdown.Item href="/admin/conference" onClick={() => {setBeneficiaries(false); setConference(true); setDoner(false); setNotice(false);}}>Conference</NavDropdown.Item> */}
        {/* <NavDropdown.Item href="#" onClick={() => {setBeneficiaries(false); setConference(false); setDoner(false); setNotice(true);}}> Notice </NavDropdown.Item> */}
        {/* <NavDropdown.Item href="/admin/notices" onClick={() => {setBeneficiaries(false); setConference(false); setDoner(false); setNotice(true);}}> Notice </NavDropdown.Item> */}
        {/* <NavDropdown.Divider /> */}
        {/* <NavDropdown.Item href="#action5"> Something else here </NavDropdown.Item> */}
        {/* </NavDropdown> */}
        {/* <Nav.Link eventKey="link-1">Loooonger NavLink</Nav.Link> */}

        {/* <Nav.Item>
         <Nav.Link href={`/user/${userId}/profile`}>My Posts</Nav.Link>
         
       </Nav.Item> */}
        {/* </Nav> */}

      </>

    </>



  )
}

export default Admin