import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';  // Import SheetJS

const ParticipantList = ({ conferenceId, venue }) => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/conference/${conferenceId}/participants`);
        const data = await response.json();
        console.log("participants", data);
        
        setParticipants(data);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    if (conferenceId) {
      fetchParticipants();
    }
  }, [conferenceId]);


  // Function to Export Table as XLS File
  const downloadXLS = () => {
    const ws = XLSX.utils.json_to_sheet(participants);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participants");

    // Download Excel file
    XLSX.writeFile(wb, `${venue}_participants.xlsx`);
  };

  return (
    <div className='p-5'>
      <h4 className='text-center'>Registered Participants</h4>
      {participants.length > 0 ? (
        <>
        {/* Scrollable Table Container */}
        <div style={{ overflowX: 'auto', width: '100%' }}>
        <Table striped bordered hover style={{ minWidth: '900px'}}>
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Age</th>
              <th>Bl Gr.</th>
              <th>Qualification</th>
              <th>Occupation</th>
              <th>Locality</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{participant.fullName}</td>
                <td>{participant.email}</td>
                <td>{participant.phone}</td>
                <td>{participant.age}</td>
                <td>{participant.bloodGroup}</td>
                <td>{participant.qualification}</td>
                <td>{participant.occupation}</td>
                <td>{participant.locality}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>
        {/* Download Button */}
        <div className="text-center mt-3">
          <Button onClick={downloadXLS} variant="success">
            Download XLS
          </Button>
        </div>
        </>
      ) : (
        <p>No participants registered yet.</p>
      )}
      
    </div>
  );
};

export default ParticipantList;
