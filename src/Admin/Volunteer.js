import React, { useEffect, useState } from "react";
import * as XLSX from 'xlsx';  // Import SheetJS
import { Button, InputGroup, Form, Row, Col, Card } from "react-bootstrap";



const Volunteer = () => {
    const [allVolunteers, setAllVolunteers] = useState(null);

     useEffect(() => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                return;
            }
            fetch(`${process.env.REACT_APP_API_URL}/user/api-volunteers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            })
                .then((res) => res.json())
                .then((data) => {
                    // Ensure the data properties exist before setting state
                    setAllVolunteers(data.volunteers || []); // Fallback to empty array if not defined 
                    console.log("vol", data);
                                       
                })
                .catch((err) => console.error("Error fetching beneficiaries:", err));
        }, []); // Empty dependency array ensures the effect runs only once on mount

        const downloadBloodDonerXLS = () => {
                const wb = XLSX.utils.book_new();
        
                // Sheet 1: Registered Donors
                const registeredSheet = XLSX.utils.json_to_sheet(allVolunteers || []);
                XLSX.utils.book_append_sheet(wb, registeredSheet, "Volunteers");
        
               
        
                // Download Excel file
                XLSX.writeFile(wb, "All_Volunteers.xlsx");
            };
    


  return (


    <div>
        <div>
                            <h1 className="text-center">Voluntears Details</h1>
                            <ul>
                                {allVolunteers?.length > 0 ? (
                                    allVolunteers?.map((v, index) => (
                                        <li key={index}>
                                            {v.updateFullName ? v.updateFullName : v.displayName ? v.displayName : v.username ? v.username : v.email} -
                                            {v.isProfileCompleted ? "Profile Completed" : "Profile Incomplete"}
                                        </li>
                                    ))
                                ) : (
                                    <p>No Voluntears found</p>
                                )}
                            </ul>
        
                            {/* Download Button */}
                            <div className="text-center mt-3 mb-5">
                                <Button onClick={downloadBloodDonerXLS} variant="success">
                                    Download Voluntears XLS
                                </Button>
                            </div>
                        </div>
        

    </div>
  )
}

export default Volunteer