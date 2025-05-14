


import React, { useState, useEffect } from 'react';
import RegistrationForm from './RegistrationForm';

import { Button, Card, Col, Form, Spinner, InputGroup, Row, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
import ConferencePass from "./ConferencePass";
import "./Conference.css";
import { FaHandPointRight } from "react-icons/fa";

const YouthConference = () => {
  


  const [conferences, setConferences] = useState([]);
  const [selectedConference, setSelectedConference] = useState(null);
  const [showRegistrationOptions, setShowRegistrationOptions] = useState(true);
  const [action, setAction] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [participant, setParticipant] = useState(null);

  const renderTooltip = (props, tooltipText) => (
    <Tooltip id="button-tooltip" {...props}>
      {tooltipText}
    </Tooltip>
  );

  const handleConferenceClick = (conference) => {
    setSelectedConference(conference);
     setShowRegistrationOptions(true);
    setAction(''); // Reset action
  };




  const handleActionClick = (actionType) => {
    if (actionType === 'register') {
      setShowRegistrationOptions(false)
      setIsRegistered(false);
      setParticipant("");
    }
    setAction(actionType); // Set the action type ('register' or 'generate-pass') 
    setShowRegistrationOptions(false)     
  };

  // Fetch all conferences
  useEffect(() => {
    const fetchConferences = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/conference`);
      const data = await response.json();
      setConferences(data);
    };
    fetchConferences();
  }, []);

  

//new 
  const generatePass = async (userEmail, id) => {
    if (!userEmail) return; // Skip if no email provided
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/conference/check-registration/${id}?email=${userEmail}`);
      const data = await response.json();
  
      if (data.isRegistered) {
        setIsRegistered(true);
        setParticipant(data.participant); // Store participant details
      } else {
        if (data.message === "Participant is not Hindu.") {
          alert('This conference is only for Hindu participants.');
        } else {
          alert('User is not registered for this conference.');
        }
      }
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  };
  
  return (
    <div className="p-3">
      <h2 className="text-center">Youth Conference Registration</h2>

      {/* Selected Conference (if any) */}
      {selectedConference && showRegistrationOptions && (
        <div className="text-center mb-3">
          <hr />
          <h2>Selected Conference</h2>
          <Card className="p-3">
            <h3>
              <span style={{ color: "Highlight" }} >Venue:</span> {selectedConference.venue},
            </h3>
            <h3>
              <span style={{ color: "Highlight" }}>City:</span> {selectedConference.place}
            </h3>
            <h5><Badge>Date: {new Date(selectedConference.date).toLocaleDateString()} - {selectedConference.time}</Badge> </h5>



            <div className='btns-container'>
              <div className=" mb-2 mt-3 ffff-div">
                <Button className="ffff" onClick={() => handleActionClick('register')}>Click Here to Register</Button>
                <Button onClick={() => handleActionClick('generate-pass')}>Click Here to Generate Pass</Button>
              </div>

              {/* Reset Button */}
              <div className="mt-2">
                <Button variant="danger" onClick={() => setSelectedConference(null)}>
                  Back to All Conferences
                </Button>
              </div>
            </div>

          </Card>
        </div>
      )}

      {/* Conference List (only if no selection) */}
      {!selectedConference && (
        <>
          <h2 className="text-center">Upcoming Conferences</h2>
          <div className="d-flex justify-content-center">
          <ul> 
              {conferences
                .filter((conference) => conference.status === "active") // Only show active conferences
                .map((conference) => (
                  <li>
                  <div className="d-flex flex-column" key={conference._id}>
                    
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 250, hide: 400 }}
                      overlay={props =>
                        renderTooltip(props, `Click here to register or generate a pass for Venue- ${conference.venue} at City- ${conference.place} on ${new Date(conference.date).toLocaleDateString()}`)
                      }
                    >
                      
            
             
                      
              <button
                       className='m-2' onClick={() => handleConferenceClick(conference)}>
                        {conference.venue} - {conference.place} - {new Date(conference.date).toLocaleDateString()} - {conference.time}
                      </button>
                      
                      
                     
                    </OverlayTrigger>
                  </div>
                  </li>
                ))}
                </ul> 
            
          </div>
        </>
      )}

      {/* Show registration form */}
      {action === 'register' && selectedConference && (
        
        <div className='mb-5'>
          <div className='d-flex justify-content-center'>
          <Button variant="danger" onClick={() => setSelectedConference(null)}>
                  Back to All Conferences
                </Button></div>
          <RegistrationForm
            venue={selectedConference.venue}
            place={selectedConference.place}
            date={selectedConference.date}
            id={selectedConference._id}
            selectedConference={selectedConference}
          />
        </div>
      )}

      {/* Show pass generation section */}
      {action === 'generate-pass' && selectedConference && !participant && (
        <div className="text-center mt-3">
          {/* Reset Button */}
          <div className="mt-2">
                <Button variant="danger" onClick={() => setSelectedConference(null)}>
                  Back to All Conferences
                </Button>
              </div>
          <Card className="p-3 m-3">
            <h3>Generating Conference Pass for {selectedConference.venue}</h3>
            <p>Venue: {selectedConference.venue} | Place: {selectedConference.place} <br/> Date: {new Date(selectedConference.date).toLocaleDateString()}</p>

            <div className="mt-3">
              <hr />
              <div className="p-3 d-flex justify-content-center">
                <Button disabled>Enter registered email-id & Click Submit for Venue Pass</Button>
              </div>
              <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Col xs={12}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>Email</InputGroup.Text>
                    <Form.Control
                      aria-label="Email"
                      type="email"
                      placeholder="Enter your Email id"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                    />
                    <Button
                      variant="outline-primary"
                      onClick={() => generatePass(userEmail, selectedConference._id)}
                    >
                      Submit
                    </Button>
                  </InputGroup>
                </Col>
              </Row>
            </div>
          </Card>
        </div>
      )}

      {/* Show Conference Pass if registered */}
      {isRegistered && participant && (
        <div className='mb-5'>
          <ConferencePass participant={participant} selectedConference={selectedConference} />
        </div>
      )}
    </div>
  );
}


export default YouthConference;
