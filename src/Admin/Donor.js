import React, { useEffect, useState } from "react";
import * as XLSX from 'xlsx';  // Import SheetJS
import { Button, InputGroup, Form, Row, Col, Card } from "react-bootstrap";



const Donor = () => {
    const [blood, setBlood] = useState(true)
    const [mentor, setMentor] = useState(false)

    const [allBloodDonors, setAllBloodDonors] = useState({
        donors: [],
        unRegisterDonors: []
    });
    const [allMentors, setAllMentors] = useState({
        mentors: [],
        unRegisterMentors: []
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }
        fetch(`${process.env.REACT_APP_API_URL}/user/api-donor`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        })
            .then((res) => res.json())
            .then((data) => {
                // Ensure the data properties exist before setting state
                setAllBloodDonors({
                    donors: data.donors || [], // Fallback to empty array if not defined
                    unRegisterDonors: data.unRegisterDonors || [] // Fallback to empty array if not defined
                });
                setAllMentors({
                    mentors: data.mentors || [], // Fallback to empty array if not defined
                    unRegisterMentors: data.unRegisterMentors || [] // Fallback to empty array if not defined
                });
            })
            .catch((err) => console.error("Error fetching beneficiaries:", err));
    }, []); // Empty dependency array ensures the effect runs only once on mount



    const downloadBloodDonerXLS = () => {
        const wb = XLSX.utils.book_new();

        // Sheet 1: Registered Donors
        const registeredSheet = XLSX.utils.json_to_sheet(allBloodDonors.donors || []);
        XLSX.utils.book_append_sheet(wb, registeredSheet, "Registered Donors");

        // Sheet 2: Unregistered Donors
        const unregisteredSheet = XLSX.utils.json_to_sheet(allBloodDonors.unRegisterDonors || []);
        XLSX.utils.book_append_sheet(wb, unregisteredSheet, "Unregistered Donors");

        // Download Excel file
        XLSX.writeFile(wb, "All_Blood_Donors.xlsx");
    };

    const downloadMentorXLS = () => {
        const wb = XLSX.utils.book_new();

        // Sheet 1: Registered Donors
        const registeredSheet = XLSX.utils.json_to_sheet(allMentors.mentors || []);
        XLSX.utils.book_append_sheet(wb, registeredSheet, "Registered Mentors");

        // Sheet 2: Unregistered Donors
        const unregisteredSheet = XLSX.utils.json_to_sheet(allMentors.unRegisterMentors || []);
        XLSX.utils.book_append_sheet(wb, unregisteredSheet, "Unregistered Mentors");

        // Download Excel file
        XLSX.writeFile(wb, "All_Mentors.xlsx");
    };


    // Combine both donors and unRegisterDonors into one list
    const combinedDonors = [...allBloodDonors.donors, ...allBloodDonors.unRegisterDonors];
    // Combine both mentore and unRegisterMentors into one list
    const combinedMentors = [...allMentors.mentors, ...allMentors.unRegisterMentors];

    return (
        <div>

            <div className="d-flex justify-content-center mx-auto">
                <Button className="m-3" variant="danger" onClick={() => { setBlood(true); setMentor(false); }}>Blood Donor Details</Button>
                <Button className="m-3" variant="success" onClick={() => { setBlood(false); setMentor(true); }}>Mentors Details</Button>
            </div>
            {blood && (
                <div>
                    <h1 className="text-center">Blood Donors Details</h1>
                    <ul>
                        {combinedDonors.length > 0 ? (
                            combinedDonors.map((donor, index) => (
                                <li key={index}>
                                    {donor.email ? donor.email : donor.donorName} -
                                    {donor.isProfileCompleted ? "Profile Completed" :
                                        donor.donationDate ? `Donation Date: ${donor.donationDate}` : "Profile Incomplete"}
                                </li>
                            ))
                        ) : (
                            <p>No Blood donors found</p>
                        )}
                    </ul>

                    {/* Download Button */}
                    <div className="text-center mt-3 mb-5">
                        <Button onClick={downloadBloodDonerXLS} variant="success">
                            Download Blood Donor XLS
                        </Button>
                    </div>
                </div>
            )}

            {mentor && (
                <div>
                    <h2>Mentors Details</h2>
                    <ul>
                        {combinedMentors.length > 0 ? (
                            combinedMentors.map((m, index) => (
                                <li key={index}>
                                    {m.updateFullName ? m.updateFullName : m.displayName ? m.displayName : m.username ? m.username : m.donorName} -
                                    {m.isProfileCompleted ? "Profile Completed" :
                                        m.donationDate ? `Donation Date: ${m.donationDate}` : "Profile Incomplete"}
                                </li>
                            ))
                        ) : (
                            <p>No Mentors found</p>
                        )}
                    </ul>

                    {/* Download Button */}
                    <div className="text-center mt-3 mb-5">
                        <Button onClick={downloadMentorXLS} variant="success">
                            Download Mentors XLS
                        </Button>
                    </div>
                </div>
            )}
            <div style={{ margin: "60px" }}>

            </div>


        </div>
    );
};

export default Donor;
