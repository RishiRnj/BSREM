import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConferenceForm from './ConferenceForm';
import ParticipantList from './ParticipantList';
import { Button, Row, Col, InputGroup, ButtonGroup, Card, Spinner  } from 'react-bootstrap';

import { FaEdit, FaBackspace } from 'react-icons/fa';

const Conference = () => {
  const [conferences, setConferences] = useState([]);
  const [selectedConference, setSelectedConference] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [showBtn, setShowBtn] = useState(true);
  const [showBackBtn, setShowBackBtn] = useState(false);
  const navigate = useNavigate();


  // Fetch all conferences
  useEffect(() => {
    const fetchConferences = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/conference`);
      const data = await response.json();
      setConferences(data);
      console.log(data.date);
      
    };
    fetchConferences();
  }, []);

  // Handle conference selection
  const onSelectConference = (conference) => {
    setSelectedConference(conference);
    setShowBtn(false)
    setShowCreateForm(false);
    setShowBackBtn(true)

  };

  const handleCreate = () => {
    setShowCreateForm(true);
  }
  const handleEdit = async (id) => {
    setShowCreateForm(false);
    setSelectedConference(null);
    console.log(id);

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. Redirecting to login.');
      window.location.href = '/login';
      return;
    }
  
    try {
      // Make a PUT request to update the conference status to 'archived' (or 'active')
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/conference/update-conference-status/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'archived', // Or 'active' depending on the desired status
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Status updated successfully:', data);
      } else {
        console.error('Error updating status:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const handleback = () => {
    setSelectedConference(null);
    setShowBtn(true)
    setShowBackBtn(false)
  }

  return (
    // <div className='mb-5'>
      
    //   {showBtn && (

    //     <div className='d-flex justify-content-around mb-2'>
    //       <div className=''>

    //         <Button onClick={handleCreate}>
    //           Create Conference
    //         </Button>

    //         {showArchived ? (
    //           <Button className='ms-3' onClick={() => setShowArchived(false)}>
    //             Active
    //           </Button>
    //         ) : (
    //           <Button className='ms-3' onClick={() => setShowArchived(true)}>
    //             Archive
    //           </Button>
    //         )}
    //       </div>
    //     </div>
    //   )}


    //   {showCreateForm && (
    //     <ConferenceForm />
    //   )}

    //   <div>
    //     <h4 className='text-center'>{showArchived ? "Archived" : "Active" } Conferences</h4>        
    //     <ul>
    //       {conferences
    //         .filter((conference) => showArchived ? conference.status === "archived" : conference.status === "active") // Only show active conferences
    //         .map((conference) => (
    //           <div className="d-flex justify-content-center" key={conference._id}>
    //             <Row className="p-1">
    //               <Col sm>
    //                 <ButtonGroup>
    //                   <Button                        
    //                     variant="dark"
    //                     onClick={() => onSelectConference(conference)}
    //                   >
    //                     {conference.venue} - {conference.place} -{" "}
    //                     {new Date(conference.date).toLocaleDateString()} -{" "}
    //                     {conference.time}
    //                   </Button>
    //                  { conference.status === "active" && (
    //                   <Button onClick={() => handleEdit(conference._id)}>
    //                     <FaEdit />
    //                   </Button>)}
    //                 </ButtonGroup>
    //               </Col>
    //             </Row>
    //           </div>
    //         ))}
    //     </ul>


    //     {showBackBtn && (
    //       <div className='d-flex justify-content-around mb-2'>
    //         <Button onClick={handleback}>
    //           Back <FaBackspace />
    //         </Button>
    //       </div>
    //     )}
    //   </div>
    //   {selectedConference && <ParticipantList conferenceId={selectedConference._id} venue={selectedConference.venue} place={selectedConference.place} />}

    //   <div style={{ height: "20px" }}></div>
    // </div>


    

<div className="mb-5">
  {/* Create + Archive Toggle Buttons */}
  {showBtn && (
    <div className="d-flex justify-content-center mb-4">
      <Button variant="primary" onClick={handleCreate}>
        ➕ Create Conference
      </Button>
      <Button
        variant={showArchived ? 'outline-secondary' : 'outline-success'}
        className="ms-3"
        onClick={() => setShowArchived(!showArchived)}
      >
        {showArchived ? 'Show Active' : 'Show Archive'}
      </Button>
    </div>
  )}

  {/* Create Form */}
  {showCreateForm && <ConferenceForm />}

  {/* Conference List */}
  <h4 className="text-center mb-3 text-info">
    {showArchived ? '📦 Archived Conferences' : '📅 Active Conferences'}
  </h4>

  <div className="d-flex flex-column gap-3 align-items-center">
    {conferences
      .filter((c) => (showArchived ? c.status === 'archived' : c.status === 'active'))
      .map((conference) => (
        <Card key={conference._id} className="w-75 shadow-sm">
          <Card.Body className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">{conference.venue}</h5>
              <p className="mb-0">
                <strong>Place:</strong> {conference.place} |{' '}
                <strong>Date:</strong>{' '}
                {new Date(conference.date).toLocaleDateString()} |{' '}
                <strong>Time:</strong> {conference.time}
              </p>
            </div>
            <div>
              <ButtonGroup>
                <Button variant="dark" onClick={() => onSelectConference(conference)}>
                  View Participants
                </Button>
                {conference.status === 'active' && (
                  <Button variant="warning" onClick={() => handleEdit(conference._id)}>
                    <FaEdit />
                  </Button>
                )}
              </ButtonGroup>
            </div>
          </Card.Body>
        </Card>
      ))}
  </div>

  {/* Back Button */}
  {showBackBtn && (
    <div className="d-flex justify-content-center mt-4">
      <Button variant="outline-primary" onClick={handleback}>
        <FaBackspace className="me-1" /> Back
      </Button>
    </div>
  )}

  {/* Participant List */}
  {selectedConference && (
    <ParticipantList
      conferenceId={selectedConference._id}
      venue={selectedConference.venue}
      place={selectedConference.place}
    />
  )}

  <div style={{ height: '20px' }}></div>
</div>

  );
};

export default Conference;