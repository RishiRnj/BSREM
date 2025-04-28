import { React, useState, useContext, useEffect } from 'react';
import { Card, InputGroup, Carousel, Button, Form, Row, Spinner, Col, Image, Modal } from 'react-bootstrap';

import AuthContext from "../../../Context/AuthContext";
import '../Donation.css';



const Cloth = () => {
    const { user } = useContext(AuthContext);
    const userId = user?.id;
    const isAuthenticated = !!user;
    const [activeSwitch, setActiveSwitch] = useState('Donate Clothes to the Community Store.');

    
    // Toggle switch states
    const handleSwitchClick = (switchName) => {
        // setActiveSwitch(activeSwitch === switchName ? null : switchName);
        // If the clicked switch is already active, do nothing
        if (activeSwitch === switchName) return;

        // Otherwise, update the active switch
        setActiveSwitch(switchName);

    };

  return (
    <div>
        <div className="">
                        <div>
                            <Form className='switch-container'>
                                <Form.Check
                                    className="ms-2 me-2 doner"
                                    type="switch"
                                    id="custom-switch-doner1"
                                    label={<span className={activeSwitch === "Donate Clothes to the Community Store." ? "text-dark" : "text-muted"}>Donate Clothes to the Community Store.</span>}
                                    checked={activeSwitch === "Donate Clothes to the Community Store."}
                                    onChange={() => handleSwitchClick("Donate Clothes to the Community Store.")}
                                />
        
                            </Form>
                        </div>
        
                        <div>
                            <Form className='switch-container'>
                                <Form.Check
                                    className="ms-2 m-1 doner"
                                    type="switch"
                                    id="custom-switch-doner2"
                                    label={<span className={activeSwitch === "Find those, who need Clothes." ? "text-dark" : "text-muted"}>Find those, who need Clothes.</span>}
                                    checked={activeSwitch === "Find those, who need Clothes."}
                                    onChange={() => handleSwitchClick("Find those, who need Clothes.")}
                                />
                            </Form>
                        </div>
                        <div className='d-flex justify-content-center align-items-center mx-2'>
                            <div>
                                <Form className='switch-container'>
                                    <div className="d-flex align-items-center">
                                        <Form.Check
                                            className="ms-2 m-1 doner"
                                            type="switch"
                                            id="custom-switch-doner2"
                                            label=""
                                            checked={activeSwitch === `Support this Initiative by Donating Money..`}
                                            onChange={() => handleSwitchClick(`Support this Initiative by Donating Money..`)}
                                        />
                                        <span className={activeSwitch === `Support this Initiative by Donating Money..` ? "text-dark" : "text-muted"}>
                                            Support this Initiative by Donating Money.
                                        </span>
                                    </div>
                                </Form>
                            </div>
                        </div>
        
                    </div>
    </div>
  )
}

export default Cloth