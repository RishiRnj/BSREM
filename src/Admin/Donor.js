import React, { useEffect, useState } from "react";

const Donor = () => {
    const [allBloodDonors, setAllBloodDonors] = useState({
        donors: [],
        unRegisterDonors: []
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }
        fetch(`${process.env.REACT_APP_API_URL}/user/api-donor`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
        }})
            .then((res) => res.json())
            .then((data) => {
                // Ensure the data properties exist before setting state
                setAllBloodDonors({
                    donors: data.donors || [], // Fallback to empty array if not defined
                    unRegisterDonors: data.unRegisterDonors || [] // Fallback to empty array if not defined
                });
            })
            .catch((err) => console.error("Error fetching beneficiaries:", err));
    }, []); // Empty dependency array ensures the effect runs only once on mount

    // Combine both donors and unRegisterDonors into one list
    const combinedDonors = [...allBloodDonors.donors, ...allBloodDonors.unRegisterDonors];

  return (
    <div>
        <h1 className="text-center">Donor Details</h1>
        
        <div>
            <h2>Blood Donors</h2>
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
                    <p>No donors found</p>
                )}
            </ul>
        </div>

       
    </div>
  );
};

export default Donor;
