import React from 'react'
import { Modal, Button, Form, Spinner, ProgressBar, ListGroup, Nav, Navbar, Row, Col, Card } from "react-bootstrap";
import './VideoBanner.css'; // External CSS file for styling
import { Player, ControlBar, ReplayControl } from 'video-react';
import "video-react/dist/video-react.css"; // Optional if using video-react


const CarForCharity = () => {
  return (
    <div>
      <Nav justify variant="tabs" defaultActiveKey="" sticky="top">
        <Navbar.Brand className='fs-3 px-1 fw-bold' >
          <div title='Car for Nobel Cause'> CNC</div></Navbar.Brand>
        <Nav.Item>
          <Nav.Link href="">Active</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="">Becon</Nav.Link>
         
        </Nav.Item>
        <Nav.Item className='bg-warning'>
          <Nav.Link href="">Donate Old Car</Nav.Link>
         
        </Nav.Item>
      </Nav>
      
      {/* Video contener section */}
        <div className="video-container d-flex align-items-center">
          <video autoPlay loop muted className="background-video">
            <source src="/carVid.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>



          <div className='cnc-object'>
            <img src='back2.webp' />

          </div>
          <div className='cnc' >

            <h1 className='text-center fw-bold'>Donate Your Vehicle<br /> to Support a Nobel Cause</h1>
            <div className='d-flex justify-content-center'>
              <Button variant='warning' size='lg' className='fs-3' >Give Today</Button>
            </div>

          </div>

          <div className="video-footer-text">
            <span ><strong>Car for Nobel Cause</strong></span> <span />
            <span >Initiative of BSREM</span>
            <p>Your contribution makes a lasting impact ❤️</p>
          </div>
        

      </div> 


      <div className='p-3 bg-warning mt-4 show-msg'>
        <div className='s_msg'>
          
            <Card.Header className='fs-4'>We Make Donating a Vehicle Easy!</Card.Header>
            <Card.Body>
              CARS makes donating your car easy. We take care of everything from the pick-up and sale to sending you the donation receipt and necessary tax documents. CARS is committed to treating every vehicle donor with gratitude and great service while delivering the highest possible returns to our partners. To date, CARS has returned more than $450+ million to our nonprofit partners because of vehicles donors like you. Thank you!
            </Card.Body>

          

        </div>
        <div className='tow-Obj'>
          <object type="image/svg+xml" data='/towk.svg' className='tow-cls' />
        </div>

      </div>




      <object type="image/svg+xml" data='/flyingHears.svg' className='bbbb_ob py-5' />
    </div>
  )
}

export default CarForCharity