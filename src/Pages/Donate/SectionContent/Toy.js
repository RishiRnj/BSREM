import { React, useState, useContext, useEffect } from 'react';
import { Card, InputGroup, Carousel, Button, Form, Row, Spinner, Col, Image, Modal } from 'react-bootstrap';

import AuthContext from "../../../Context/AuthContext";
import '../Donation.css';

const Toy = () => {
  const { user } = useContext(AuthContext);
    const userId = user?.id;
    const isAuthenticated = !!user;
    const [activeSwitch, setActiveSwitch] = useState('Donate Toys to the Community Store.');

    
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
                                          label={<span className={activeSwitch === "Donate Toys to the Community Store." ? "text-dark" : "text-muted"}>Donate Toys to the Community Store.</span>}
                                          checked={activeSwitch === "Donate Toys to the Community Store."}
                                          onChange={() => handleSwitchClick("Donate Toys to the Community Store.")}
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

export default Toy