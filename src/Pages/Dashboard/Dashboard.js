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

                <div className='px-5' style={{ zIndex: "1000" }}>

                    <div style={{ height: "200px", marginBottom: "80px" }}>
                        <AnimatedStatsSlider
                            totalUsers={totalUsers}
                            totalBeneficiaries={totalBeneficiaries}
                            totalSupportReceived={totalSupportReceived}
                            totalBloodDonors={totalBloodDonors}
                            totalConferences={totalConferences}
                            totalSurveyRespondents={totalSurveyRespondents}
                        /></div>


                    <div className='kkk scrolling-content mt-5' style={{ zIndex: "1000", }}>
                        <Stack direction="horizontal" gap={3} className="scrolling-stack">


                            <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={props => renderTooltip(props, "Share whatever is on your mind but make sure your post is beneficial to Hindus.")}
                            >
                                <Button variant="primary" style={{ textWrap: "nowrap" }} onClick={() => navigate('/forum')}>
                                    Say <FaOm className='mb-1' />
                                </Button>
                            </OverlayTrigger>



                            <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={props => renderTooltip(props, "The money or goods you donate will be used for the benefit of the Hindu religion or the Community.")}
                            >
                                <Button variant="primary" style={{ textWrap: "nowrap" }} onClick={redirectToDonate}>
                                    Donation <FcDonate /> for Good Cause
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={props => renderTooltip(props, "Your Participation in this Survey is not Required but Essential one.")}
                            >
                                <Button variant="primary" style={{ textWrap: "nowrap" }} onClick={() => navigate('/open-survey/byAdmin')}>
                                    Survey for all
                                </Button>
                            </OverlayTrigger>






                            <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={props => renderTooltip(props, "This is our effort to strengthen every Hindu. If you are weak, click here to remove your weakness.")}
                            >
                                <Button variant="danger" style={{ textWrap: "nowrap" }} onClick={redirectToBenrficiarySupport}>
                                    Need support! Click here
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={props => renderTooltip(props, "Be a Hindu, buy and sell BSREM certified products. If you haven't applied for the certificate yet, do it soon.")}
                            >
                                <Button className='fw-bold' variant="warning" style={{ textWrap: "nowrap" }} onClick={() => navigate('/get-certificate')}>
                                    Get Certificate
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={props => renderTooltip(props, "Click to find out where the upcoming youth conference is being held and to register yourself for the conference at that location.")}
                            >
                                <Button variant="dark" style={{ textWrap: "nowrap" }} onClick={() => navigate('/youth')}>
                                    Youth Conference <FaClipboardList />
                                </Button>
                            </OverlayTrigger>


                            {!token && (

                                <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={props => renderTooltip(props, "Click to Login")}
                                >
                                    <Button variant="light" style={{ textWrap: "nowrap" }} onClick={() => navigate('/login')}>
                                        LogIn <IoIosLogIn />
                                    </Button>
                                </OverlayTrigger>

                            )}
                        </Stack>


                    </div>

                </div>


                {/* buttons */}
                <div style={{
                    cursor: "pointer",
                    position: "fixed", // Changed to relative to avoid affecting other elements            
                    right: "-85px",
                    top: "210px",
                    transform: "rotate(-90deg)", // Rotates the div by 45 degrees
                    zIndex: 1100,
                }}>
                    <OverlayTrigger
                        placement="left"
                        delay={{ show: 250, hide: 400 }}
                        overlay={props => renderTooltip(props, "Donors, where they can know details about the beneficiaries and help them accordingly. And Beneficiaries can find out here whether their application has been approved or not.")}
                    >
                        <Button className='text-white' variant="outline-primary" onClick={() => navigate('/donate')}>Donor Beneficiary Dashboard</Button>
                    </OverlayTrigger>
                </div>
                <div style={{
                    cursor: "pointer",
                    position: "fixed", // Changed to relative to avoid affecting other elements            
                    right: "-35px",
                    top: "390px",
                    transform: "rotate(-90deg)", // Rotates the div by 45 degrees
                    zIndex: 1100,
                }}>
                    <OverlayTrigger
                        placement="left"
                        delay={{ show: 250, hide: 400 }}
                        overlay={props => renderTooltip(props, "Donors, where they can know details about the beneficiaries and help them accordingly. And Beneficiaries can find out here whether their application has been approved or not.")}
                    >
                        <Button className='text-white' variant="outline-primary" onClick={redirectToBlDonate}>Donate Blood</Button>
                    </OverlayTrigger>
                </div>

                <div style={{
                    cursor: "pointer",
                    position: "fixed", // Changed to relative to avoid affecting other elements            
                    left: "-55px",
                    top: "395px",
                    transform: "rotate(90deg)", // Rotates the div by 45 degrees
                    zIndex: 1000,
                }}>
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={props => renderTooltip(props, "Donors, where they can know details about the beneficiaries and help them accordingly. And Beneficiaries can find out here whether their application has been approved or not.")}
                    >
                        <Button className='text-white' variant="outline-primary" onClick={redirectToMentorDonate}>Donate Mentorship</Button>
                    </OverlayTrigger>
                </div>
                <div style={{
                    cursor: "pointer",
                    position: "fixed", // Changed to relative to avoid affecting other elements            
                    left: "-88px",
                    top: "210px",
                    transform: "rotate(90deg)", // Rotates the div by 45 degrees
                    zIndex: 1000,
                }}>
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={props => renderTooltip(props, "Click to find out where the upcoming youth conference is being held and to register yourself for the conference at that location.")}
                    >
                        <Button className='text-white' variant="outline-primary" onClick={() => navigate('/youth')}>Register for Youth Conference</Button>
                    </OverlayTrigger>
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