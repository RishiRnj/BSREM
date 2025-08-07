import React from 'react'
import { Card, Button, Stack, Spinner, OverlayTrigger, Tooltip, } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaClipboardList, FaOm } from "react-icons/fa";
import { IoIosLogIn } from "react-icons/io";
import { FcDonate } from "react-icons/fc";



const ButtonRow = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");


    const renderTooltip = (props, tooltipText) => (
        <Tooltip id="button-tooltip" {...props}>
            {tooltipText}
        </Tooltip>
    );

      const redirectToBenrficiarySupport = () => {
        navigate('/register/for_support');
    };

    const redirectToDonate = () => {
        localStorage.setItem("redirectToSEC", "money-donation");
        navigate('/donation');
    };


  return (
    <>
            <div style={{ position: "relative", }}>
                
                <div className='extP' style={{ paddingBottom: "" }}> {/* Reserve space for footer */}
                    <div
                        className="statisticsB"
                        style={{
                            position: "fixed",
                            bottom: "120px", // Space for footer
                            left: "0",
                            right: "0",
                            overflow: "hidden",
                            whiteSpace: "nowrap",                            
                            // padding: "4px 0",                            
                            boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <div className="scrolling-content">
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

                            {/* <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={props => renderTooltip(props, "Be a Hindu, buy and sell BSREM certified products. If you haven't applied for the certificate yet, do it soon.")}
                            >
                                <Button className='fw-bold' variant="warning" style={{ textWrap: "nowrap" }} onClick={() => navigate('/get-certificate')}>
                                    Get Certificate
                                </Button>
                            </OverlayTrigger> */}

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
                </div>
            </div>
        </>
  )
}

export default ButtonRow