import React, { useEffect, useState, useContext, } from 'react';
import "./Dashboard.css"; // Include your custom styles here
import NoticeBoard from '../../Components/Notice/NoticeBorad';
import { useNavigate, useLocation } from "react-router-dom";
import ForumStat from "../Forum/ForumStatistics";
import { Button, Card, Row, Spinner, OverlayTrigger, Tooltip, Stack } from "react-bootstrap";
import { FaClipboardList, FaOm } from "react-icons/fa";
import CountUp from 'react-countup';
import { IoIosLogIn } from "react-icons/io";
import AnimatedStatsSlider from './AnimatedStatsSlider';
import { FcDonate } from "react-icons/fc";






const Dashboard = () => {

    const [loading, setLoading] = useState(false);
    const [notices, setNotices] = useState([]);


    const navigate = useNavigate();
    const location = useLocation();
    const [totalUsers, setTotalUsers] = useState(null);
    const [totalBeneficiaries, setTotalBeneficiaries] = useState(null);
    const [totalSupportReceived, setTotalSupportReceived] = useState(null);
    const [totalBloodDonors, setTotalBloodDonors] = useState(null);
    const [totalConferences, setTotalConferences] = useState(null);
    const [totalSurveyRespondents, setTotalSurveyRespondents] = useState(null);
    const token = localStorage.getItem("token");


    //fetch Notices
    const fetchNotices = async () => {
        setLoading(true);
        try {

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notices`, {
                method: 'GET',
                credentials: 'include', // Important for cookies or sessions
                headers: {
                    'Content-Type': 'application/json',

                },

            });
            if (!response.ok) throw new Error("Failed to fetch notices");
            const data = await response.json();
            setNotices(data);
            console.log('notice', data);

        } catch (error) {
            console.error("Error fetching notices:", error);
        } finally {
            setLoading(false);
        }
    };
    //fetch Notices
    const fetchTotalUsers = async () => {
        setLoading(true);
        try {

            const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
                method: 'GET',
                credentials: 'include', // Important for cookies or sessions
                headers: {
                    'Content-Type': 'application/json',

                },

            });
            if (!response.ok) throw new Error("Failed to fetch Statistics");
            const data = await response.json();
            setTimeout(() => {
                setTotalUsers(data.totalUsers);
                setTotalBloodDonors(data.totalBLDonors)
                setTotalBeneficiaries(data.totalBeneficiaries);
                setTotalSupportReceived(data.totalSupportReceived);
                setTotalConferences(data.totalConferences);
                setTotalSurveyRespondents(data.totalSurveyRespondents);
            }, 2000); // Simulate an API call delay
            console.log('Statistic', data);

        } catch (error) {
            console.error("Error fetching Statistics:", error);
        } finally {
            setLoading(false);
        }
    };

    const redirectToBenrficiarySupport = () => {
        navigate('/register/for_support');
    };

    const redirectToDonate = () => {
        localStorage.setItem("redirectToSEC", "money-donation");
        navigate('/donation');
    };


    const redirectToBlDonate = () => {
        localStorage.setItem("redirectToSEC", "blood-donation");
        navigate('/donation');
    };
    const redirectToMentorDonate = () => {
        localStorage.setItem("redirectToSEC", "blank-donation");
        navigate('/donation');
    };




    useEffect(() => {


        const fetchData = async () => {
            // Fetch notices and posts
            await fetchNotices();
            await fetchTotalUsers();
            // await fetchTotalBeneficiary();            
            // await fetchTotalSupportReceived();


            setLoading(false); // Ensure this is set after all operations complete
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="loading-container"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1050,
                }}
            >
                <Spinner animation="border" role="status" >
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    const renderTooltip = (props, tooltipText) => (
        <Tooltip id="button-tooltip" {...props}>
            {tooltipText}
        </Tooltip>
    );


    return (
       <>

            {/* notice Board */}
            <div

                style={{
                    cursor: "pointer",
                    position: "fixed",
                    top: "65px",
                    left: "0px", // Move to bottom-left corner
                    zIndex: 1000,
                }}>

                <NoticeBoard

                    notices={notices.map((notice) => ({
                        ...notice,
                        onClick: () => navigate(notice.link),
                    }))}
                />

            </div>
            <div className="background">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>

            </div>
            <div className='das' style={{ zIndex: "1000" }}><img src='om.webp' width={150} height={150} /></div>
            <div className='d-flex justify-content-center text-white  text-center ddd ' style={{ minHeight: `calc(100vh - 165px)`, }}  >
                <div className='hea' style={{ zIndex: "1000" }}>

                    <h1 className=''>Welcome to BSREM</h1>
                    <p className='txp'>Hindu for Global Community. <br /> <span style={{ fontWeight: "bold" }}> Supprot || Strengthen || Unite </span> </p>
                </div>

               <div className='px-5' style={{ zIndex: "1000", minHeight: "200px" }}>

                    <div style={{ height: "200px", marginBottom: "80px" }}>
                        <AnimatedStatsSlider
                            totalUsers={totalUsers}
                            totalBeneficiaries={totalBeneficiaries}
                            totalSupportReceived={totalSupportReceived}
                            totalBloodDonors={totalBloodDonors}
                            totalConferences={totalConferences}
                            totalSurveyRespondents={totalSurveyRespondents}
                        /></div>







                </div>


                
            </div>


            {/* Fetched Survey Stat only for Forum Page */}
            <div
                style={{
                    cursor: "pointer",
                    position: "relative", // Changed to relative to avoid affecting other elements   
                    bottom: 10,
                    left: "0px",
                    display: "inline-block", // Restrict clickable area to content only
                    zIndex: 1000,
                }}
                onClick={() => navigate('/survey-stats')}
            >
                <ForumStat />
            </div>




        </>


    )
}

export default Dashboard