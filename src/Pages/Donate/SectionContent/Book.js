import { React, useState, useContext, useEffect } from 'react';
import { Card, InputGroup, Carousel, Button, Form, Row, Spinner, Col, Image, Modal } from 'react-bootstrap';

import AuthContext from "../../../Context/AuthContext";
import '../Donation.css';

const Book = () => {
    const { user } = useContext(AuthContext);
    const userId = user?.id;
    const isAuthenticated = !!user;
    const [activeSwitch, setActiveSwitch] = useState('Donate Books to the Community Library.');





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
                            label={<span className={activeSwitch === "Donate Books to the Community Library." ? "text-dark" : "text-muted"}>Donate Books to the Community Library.</span>}
                            checked={activeSwitch === "Donate Books to the Community Library."}
                            onChange={() => handleSwitchClick("Donate Books to the Community Library.")}
                        />

                    </Form>
                </div>

                <div>
                    <Form className='switch-container'>
                        <Form.Check
                            className="ms-2 m-1 doner"
                            type="switch"
                            id="custom-switch-doner2"
                            label={<span className={activeSwitch === "Find someone who needs your Book." ? "text-dark" : "text-muted"}>Find someone who needs your Book.</span>}
                            checked={activeSwitch === "Find someone who needs your Book."}
                            onChange={() => handleSwitchClick("Find someone who needs your Book.")}
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

export default Book