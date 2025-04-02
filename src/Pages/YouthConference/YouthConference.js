


import React, { useState, useEffect } from 'react';
import RegistrationForm from './RegistrationForm';

import { Button, Card, Col, Form, Spinner, InputGroup, Row, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
import ConferencePass from "./ConferencePass";
import "./Conference.css";
import { FaHandPointRight } from "react-icons/fa";

const YouthConference = () => {
  //   const [conferences, setConferences] = useState([]);
  //   const [selectedConference, setSelectedConference] = useState(null);
  //   const [showRegistrationOptions, setShowRegistrationOptions] = useState(false);
  //   const [action, setAction] = useState(''); // Store action for register or generate pass
  //   const [userEmail, setUserEmail] = useState('');

  //   const [isRegistered, setIsRegistered] = useState(false); // Track if user is registered
  //   const [participant, setParticipant] = useState(null); // Store participant details if registered

  //   const cardRef = useRef(null); // Reference for ID card
  //   const pdfRef = useRef(null); // Reference for PDF content
  //   const placeholderImage = "/pas.webp";

  //   const placeholderImageA4 = "/A4.png";

  //   const leftImg = "/logo192.webp";
  //   const rtImg = "/om.webp";
  //   const targetRef = useRef(null);
  //   const [loading, setLoading] = useState(false);
  //   const navigate = useNavigate();

  //   // Fetch all conferences
  //   useEffect(() => {
  //     const fetchConferences = async () => {
  //       const response = await fetch(`${process.env.REACT_APP_API_URL}/api/conference`);
  //       const data = await response.json();
  //       setConferences(data);
  //     };
  //     fetchConferences();
  //   }, []);

  //   const renderTooltip = (props, tooltipText) => (
  //     <Tooltip id="button-tooltip" {...props}>
  //       {tooltipText}
  //     </Tooltip>
  //   );

  //   const handleConferenceClick = (conference) => {
  //     setSelectedConference(conference);
  //     setShowRegistrationOptions(true); // Show the registration options when a conference is selected
  //     setIsRegistered(false);
  //     setAction("");
  //   };

  //   const handleActionClick = (actionType) => {
  //     if (actionType === 'register') {
  //       setIsRegistered(false);
  //       setParticipant("");
  //     }
  //     setAction(actionType); // Set the action type ('register' or 'generate-pass')
  //     setShowRegistrationOptions(false); // Hide the options after a selection is made
  //   };

  //   // Function to generate pass
  //   const generatePass = async (userEmail, id) => {
  //     if (!userEmail) return; // Skip if no email provided
  //     try {
  //       const response = await fetch(`${process.env.REACT_APP_API_URL}/api/conference/check-registration/${id}?email=${userEmail}`);
  //       const data = await response.json();
  //       if (data.isRegistered) {
  //         setIsRegistered(true);
  //         setParticipant(data.participant); // Store participant details
  //       } else {
  //         alert('User is not registered for this conference.');
  //       }
  //     } catch (error) {
  //       console.error('Error checking registration:', error);
  //     }
  //   };

  //   // Function to download as an image
  //   const downloadAsImage = async () => {
  //     try {
  //       const scale = 2; // Increase resolution
  //       const canvas = await html2canvas(cardRef.current, {
  //         scale: scale,
  //         useCORS: true,
  //         allowTaint: true,
  //       });

  //       const imgData = canvas.toDataURL("image/webp", 0.8);
  //       const link = document.createElement("a");
  //       link.href = imgData;
  //       link.download = `${participant.fullName}_IDCard.webp`;
  //       link.click();
  //     } catch (error) {
  //       console.error("Error downloading card as image:", error);
  //     }
  //   };

  //   const imagePreview = placeholderImage;


  //   return (
  //     <div className='p-3'>
  //       <h1 className='text-center'>Youth Conference Registration</h1>
  //       <div>
  //         <h2 className='text-center'>Upcoming Conferences</h2>
  //         <div className='d-flex justify-content-center'>
  //           <ul>
  //             {conferences.map((conference) => (
  //               <li key={conference._id}>
  //                 <OverlayTrigger
  //                   placement="bottom"
  //                   delay={{ show: 250, hide: 400 }}
  //                   overlay={props =>
  //                     renderTooltip(props, `Click here for download or generate conference pass for Venue- ${conference.venue} at City- ${conference.place} on ${new Date(conference.date).toLocaleDateString()}`)
  //                   }
  //                 >
  //                   <button onClick={() => handleConferenceClick(conference)}>
  //                     {conference.venue} - {conference.place} - {new Date(conference.date).toLocaleDateString()} - {conference.time}
  //                   </button>
  //                 </OverlayTrigger>
  //               </li>
  //             ))}
  //           </ul>
  //         </div>
  //       </div>

  //       {/* Show registration options */}
  //       {showRegistrationOptions && (
  //         <div className="text-center mt-3">
  //           <Button className='me-3' onClick={() => handleActionClick('register')}>Click Here to Register</Button>
  //           <Button className="ml-2" onClick={() => handleActionClick('generate-pass')}>Click Here to Generate Pass</Button>
  //         </div>
  //       )}

  //       {/* Conditionally render the registration form or pass generation action */}
  //       {action === 'register' && selectedConference && (
  //         <RegistrationForm
  //           venue={selectedConference.venue}
  //           place={selectedConference.place}
  //           id={selectedConference._id}
  //           selectedConference={selectedConference}
  //         />
  //       )}



  //       {action === 'generate-pass' && selectedConference && !participant && (
  //         <div className="text-center mt-3">
  //           <Card className="p-3 m-3">
  //             <h3>Generating Conference Pass for {selectedConference.venue}</h3>
  //             <p>Venue: {selectedConference.venue} | Place: {selectedConference.place} | Date: {new Date(selectedConference.date).toLocaleDateString()}</p>

  //             <div className="mt-3">
  //               <hr />
  //               <div className="p-3 d-flex justify-content-center">
  //                 <Button disabled>Enter registered email-id & Click Submit for Venue Pass</Button>
  //               </div>
  //               <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
  //                 {/* Email input column */}
  //                 <Col xs={12}>
  //                   <InputGroup className="mb-3">
  //                     <InputGroup.Text>Email</InputGroup.Text>
  //                     <Form.Control
  //                       aria-label="Email"
  //                       type="email"
  //                       placeholder="Enter your Email id"
  //                       value={userEmail}
  //                       onChange={(e) => setUserEmail(e.target.value)}
  //                       required
  //                     />
  //                     <Button
  //                       variant="outline-primary"
  //                       id="button-addon2"
  //                       onClick={() => generatePass(userEmail, selectedConference._id)} // Pass function reference
  //                     >
  //                       Submit
  //                     </Button>
  //                   </InputGroup>
  //                 </Col>
  //               </Row>
  //             </div>
  //           </Card>
  //         </div>
  //       )}

  //       {isRegistered && participant && (
  //         // <>

  //         //   {/* ID Card Section */}
  //         //   <div
  //         //     ref={cardRef}
  //         //     style={{
  //         //       width: "300px",
  //         //       height: "400px",
  //         //       margin: "20px auto",
  //         //       padding: "20px",
  //         //       border: "1px solid #ccc",
  //         //       borderRadius: "10px",
  //         //       textAlign: "center",
  //         //       backgroundImage: `url(${imagePreview})`,
  //         //       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  //         //     }}
  //         //   >

  //         //     <div
  //         //       style={{
  //         //         width: "100px",
  //         //         height: "100px",
  //         //         margin: " auto",
  //         //         borderRadius: "50%",
  //         //         overflow: "hidden",
  //         //         border: "2px solid #000",
  //         //       }}
  //         //     >
  //         //       {participant.userImage ? (
  //         //         <img
  //         //           src={participant?.userImage}
  //         //           alt="Volunteer"
  //         //           style={{ width: "100%", height: "100%", objectFit: "cover" }}
  //         //         />
  //         //       ) : (
  //         //         <div style={{ textAlign: "center", lineHeight: "100px" }}>
  //         //           No Image
  //         //         </div>
  //         //       )}
  //         //     </div>

  //         //     <h5 className='bg-primary text-white mt-2'>{participant.fullName} <span className='ms-2'> {participant.bloodGroup} </span> </h5>
  //         //     <div className="crd-detail">
  //         //       <p ><strong>Mobile: </strong> {`+${participant.phone}`} </p>

  //         //       <p> <strong> Ocopation: </strong>  {participant.occupation}</p>
  //         //     </div>



  //         //     <div className='mb-2'>
  //         //       <h4 className=' pt-2 m-0'> BSREM</h4>
  //         //       <span className=' mt-0' style={{ fontWeight: "bold" }}> "To Unite, Awaken & Strengthen."</span>
  //         //     </div>






  //         //     <h4 className='bg-primary text-white pb-1 m-0 '>Conference Pass </h4>
  //         //     <span style={{ fontWeight: "bold" }}>
  //         //       Venue: {selectedConference.venue},  {selectedConference.place} Date: {new Date(selectedConference.date).toLocaleDateString()} - {selectedConference.time}
  //         //     </span>



  //         //   </div>
  //         //   <div className='d-flex justify-content-between'>
  //         //   <Button onClick={downloadAsImage}>Download Pass</Button>
  //         //   <Button onClick={() => navigate('/dashboard')}>Back to <IoHome /></Button>
  //         //   </div>

  //         // </>

  //         <ConferencePass participant={participant} selectedConference={selectedConference} />
  //       )}
  //     </div>
  //   );
  // }


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

  // Function to generate pass
  // const generatePass = async (userEmail, id) => {
  //   if (!userEmail) return; // Skip if no email provided
  //   try {
  //     const response = await fetch(`${process.env.REACT_APP_API_URL}/api/conference/check-registration/${id}?email=${userEmail}`);
  //     const data = await response.json();
  //     if (data.isRegistered) {
  //       setIsRegistered(true);
  //       setParticipant(data.participant); // Store participant details
  //     } else {
  //       alert('User is not registered for this conference.');
  //     }
  //   } catch (error) {
  //     console.error('Error checking registration:', error);
  //   }
  // };

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
