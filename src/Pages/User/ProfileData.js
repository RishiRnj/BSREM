import { useEffect, useState, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import { Button, Row, Col, InputGroup, Form, Badge, Container } from 'react-bootstrap'
import { FaBackward } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from "../../Components/Common/LoadingSpinner";
import { GoVerified, GoDotFill, GoDot } from "react-icons/go";
import { GrNext } from "react-icons/gr";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';



const ProfileData = () => {
    const { user } = useContext(AuthContext);
    console.log("users at profile", user);

    const currentUser = user;
    const userId = currentUser?.id;
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [step, setStep] = useState(1);


    useEffect(() => {
        if (!userId) return; // wait until userId is available
        fetchUserData();
    }, [userId]);

    const fetchUserData = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log("id", userId);
            const token = localStorage.getItem("token");
            if (!token) throw new Error("User not authenticated.");

            const userRes = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
                credentials: 'include', // if you're using cookies/sessions
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // if using JWT
                }
            });

            if (!userRes.ok) throw new Error("Failed to fetch user data");
            const userData = await userRes.json();
            setUserData(userData);
            console.log('data user at profile', userData);
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Unable to load user profile.");
        } finally {
            setLoading(false);
        }
    };



    if (loading) {
        return <LoadingSpinner />;
    }


    if (error) {
        return (
            <div>
                <p className="text-danger">{error}</p>
                <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
        );
    }

    // step change
  const handleSettingStep1 = () => {
    setStep(1); // Proceed to the next step
  };

  const handleSettingStep2 = () => {
    setStep(2); // Proceed to the next step
  };

  const handleSettingStep3 = () => {
    setStep(3); // Proceed to the next step
  };

  const handleNext = () => {
    setStep(2);
  }
  const handleNext2 = () => {
    setStep(3);
  }



    return (
        <div>
            <div>
                <h1 className='text-center p-3'>User Profile Data</h1>
            </div>
            <div className="d-flex justify-content-end m-3">
                <Button onClick={() => navigate(-1)} variant="primary">
                    <FaBackward /> Back to Main
                </Button>
            </div>

            <Container className="border p-3 rounded shadow m-2">
              <h2 className="text-center mb-4">Profile Details</h2>

            {step === 1 && (
                            <>
                              <Row>
                                <Col sm>
                                <div className="position-relative mb-2">
                                  <InputGroup className="" >
                                    <InputGroup.Text style={{ fontWeight: "bold" }}>User Email</InputGroup.Text>
                                    <Form.Control aria-label="User Email"  value={userData?.email} readOnly disabled />
                                  </InputGroup>
                                  <GoVerified
                                          className="position-absolute"
                                          style={{
                                            right: 10,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "green",
                                          }}
                                        /> 
                                  
                                  
                                  </div>
                                </Col>
            
                                <Col sm>
                                <div className="position-relative mb-2">
                                <InputGroup className="" >
                                    <InputGroup.Text style={{ fontWeight: "bold" }}>Username</InputGroup.Text>
                                    <Form.Control aria-label="User Email"  value={userData?.username} readOnly disabled />
                                  </InputGroup> 

                                  <GoVerified
                                          className="position-absolute"
                                          style={{
                                            right: 10,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "green",
                                          }}
                                        />        </div>                         
                                </Col>
                              </Row>
            
                              <Row>
                                <Col sm>
                                  <div >
                                    <InputGroup className="mb-2"  >
                                      <InputGroup.Text style={{ fontWeight: "bold" }}>Full Name</InputGroup.Text>
                                      <Form.Control
                                        aria-label="Full Name"
                                        type="text"
                                        name="updateFullName"
                                        placeholder="Enter your Updated Name..."
                                        value={userData?.updateFullName || ""} // Always set value to an empty string if undefined
                                        // onChange={handleChange} // Only provide `onChange` if editable                            
                                        // required
                                      />
                                      
                                    </InputGroup>
                                  </div>
            
                                </Col>
            
                                <Col sm>
                                  
                                    
                                    <div className="position-relative mb-2">
                                      <PhoneInput
                                        name="mobile"
                                        placeholder='Enter Phone Number'
                                        disabled
                                        country={'in'}
                                        value={userData?.mobile || ""}
            
                                        inputProps={{ name: 'mobile' }}
                                        inputStyle={{ width: '100%', borderRadius: '5px' }}
                                      />
                                      
                                        <GoVerified
                                          className="position-absolute"
                                          style={{
                                            right: 10,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "green",
                                          }}
                                        />
                                      
            
                                      {/* {savedDataLS && (
                                        <BiSolidEdit
                                          onClick={EditMobile}
                                          className="position-absolute"
                                          style={{ right: 10, top: "50%", transform: "translateY(-50%)", color: "blue", cursor: 'pointer' }}
                                        />
                                      )} */}
                                    </div>
            
                                  {/* ) : (
            
                                    // If mobile does not exist, show the mobile number in InputGroup
                                    <InputGroup className="mb-2" onClick={handleInputFocus}>
                                      <InputGroup.Text style={{ fontWeight: "bold" }}>Mobile No.</InputGroup.Text>
                                      <Form.Control
                                        aria-label="Mobile No."
                                        type="tel"
                                        name="mobile"
                                        value={userData.mobile || ""}
                                        readOnly
                                        placeholder="Enter your Mobile No"
                                      />
                                      {error ? <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={props => renderTooltip(props, "Mobile No is Mendatory, Enter your Mobile No")}
                                      ><InputGroup.Text><BsBracesAsterisk /></InputGroup.Text></OverlayTrigger> : ""}
                                    </InputGroup>
                                  )} */}
                                </Col>
                              </Row>
            
            
                              <Row>
                                <Col sm>
                                  <InputGroup className="mb-2">
                                    <InputGroup.Text id="basic-addon1" style={{ fontWeight: "bold" }}>Gender</InputGroup.Text>
                                    <Form.Control 
                                      value={userData?.gender} required
                                    //   onChange={handleChange}
                                    />
                                     
            
                                  </InputGroup>
                                </Col>
            
                                <Col sm>
                                  <InputGroup className="mb-2">
                                    <InputGroup.Text id="basic-addon1" style={{ fontWeight: "bold" }}>Religion</InputGroup.Text>
                                    <Form.Control 
                                      value={userData?.religion}  disabled={!!userData?.religion} // disables only if value exists
                                    //   onChange={handleChange}
                                    />
            
                                  </InputGroup>
                                </Col>
            
                              </Row>
                              <Row>
                                <Col sm>
                                  <div className="position-relative mb-2">
                                    <InputGroup className="mb-2" >
                                      <InputGroup.Text style={{ fontWeight: "bold" }}>Date of Birth</InputGroup.Text>
                                      <Form.Control type="date" name="dob" value={userData?.dob} 
                                    //   onChange={handleChange} required 
                                      />
                                    </InputGroup>
            
                                    {userData?.dob && (
                                      <Badge
                                        className="position-absolute"
                                        style={{ right: 40, top: "50%", transform: "translateY(-50%)", color: "white" }}
                                      > {userData?.age} years</Badge>
                                    )}
                                  </div>
                                </Col>
                              </Row>
            
            
                              {/* Next Button */}
                              <Row>
                                <Col>
                                  <div className='d-flex justify-content-center'>
                                    <Button className="w-80" onClick={handleNext} variant="primary" type='submit'>
                                      Next <GrNext />
                                    </Button>
                                  </div>
                                </Col>
                              </Row>
            
                            </>
                          )}
            
                          {step === 2 && (
                            <>
                              <Row>
                                <Col sm>
                                  <InputGroup className="mb-3" >
                                    <InputGroup.Text style={{ fontWeight: "bold" }}>Interested in</InputGroup.Text>
                                    <Form.Control
                                    //   as="select"
                                      aria-label="Interested in"
                                      name="hobby"
                                      value={userData?.hobby}
                                    //   onChange={handleChange}
                                    //   required
                                    />
                                      
                                  </InputGroup>
            
                                </Col>
            
                                <Col sm>
                                  <InputGroup className="mb-3" >
                                    <InputGroup.Text style={{ fontWeight: "bold" }}>Blood Group</InputGroup.Text>
                                    <Form.Control
                                    //   as="select"
                                      aria-label="Blood Group"
                                      name="bloodGroup"
                                      value={userData?.bloodGroup}
                                    //   onChange={handleChange}
                                    //   required
                                    />
                                      {/* <option value="">Select Blood Group</option>
                                      <option value="A+">A+</option>
                                      <option value="A-">A-</option>
                                      <option value="B+">B+</option>
                                      <option value="B-">B-</option>
                                      <option value="O+">O+</option>
                                      <option value="O-">O-</option>
                                      <option value="AB+">AB+</option>
                                      <option value="AB-">AB-</option>
                                    </Form.Control> */}
                                  </InputGroup>
                                </Col>
                              </Row>
            
                              <Row>
                                {/* Occupation Category Select */}
                                <Col sm>
                                  <InputGroup className="mb-3">
                                    <InputGroup.Text style={{ fontWeight: "bold" }}>Occupation Category</InputGroup.Text>
                                    <Form.Control
                                    //   as="select"
                                      aria-label="Occupation Category"
                                      name="occupationCategory"
                                      value={userData?.occupationCategory}
                                    //   onChange={handleChange}
                                    //   required
                                    />
                                      
                                  </InputGroup>
                                </Col>
            
                                {/* Occupation Select (Only shown when category is selected) */}
                                {userData?.occupationCategory && (
                                  <Col sm>
                                    <InputGroup className="mb-3">
                                      <InputGroup.Text style={{ fontWeight: "bold" }}>Occupation</InputGroup.Text>
                                      <Form.Control
                                        // as="select"
                                        aria-label="Occupation"
                                        name="occupation"
                                        value={userData?.occupation}
                                        // onChange={handleChange}
                                        // required
                                      />
                                        
                                    </InputGroup>
                                  </Col>
                                )}
            
            
            
                              </Row>
            
                              <Row>
                                <Col sm>
                                  
                                    <InputGroup className="mb-3" >
                                      <InputGroup.Text style={{ fontWeight: "bold" }}>Occupation Details</InputGroup.Text>
                                      <Form.Control aria-label="More About Occupation"
                                        name="moreAboutOccupation"
                                        value={userData?.moreAboutOccupation}
                                        // onChange={handleChange}
                                        type="text"
                                        placeholder="Tell us about your Occupation..."
                                      />
                                    </InputGroup>
                                  
            
                                </Col>
                              </Row>
            
                              {/* Next Button */}
            
                              <Row>
                                <Col >
                                  <div className='d-flex justify-content-center'>
                                    <Button className="w-80" onClick={handleNext2} variant="primary" type='submit'>
                                      Next <GrNext />
                                    </Button>
                                  </div>
                                </Col>
                              </Row>
                            </>
            
                          )}
            
                          {step === 3 && (
                            <>
                              <Row>
                                <Col sm>
                                  <InputGroup className="mb-2" >
                                    <InputGroup.Text style={{ fontWeight: "bold" }}>Residential status</InputGroup.Text>
                                    <Form.Control
                                    //   as="select"
                                      aria-label="Residential status"
                                      name='origin'
                                      value={userData?.origin}
                                    //   onChange={handleChange}
                                    //   required
                                    />
                                      {/* <option value="">Choose Origin</option>
                                      <option value="Indian Hindu">Hindus Living in India</option>
                                      <option value="Gobal Hindu">Hindus Living Outside India</option>
                                    </Form.Control> */}
                                  </InputGroup>
            
                                </Col>
            
                                <Col sm>
                                  
                                    <InputGroup className="mb-2" >
                                      <InputGroup.Text style={{ fontWeight: "bold" }}>Locality</InputGroup.Text>
                                      <Form.Control
                                        name='address'
                                        placeholder="House No, St. No, Locality"
                                        value={userData?.address}
                                        // onChange={handleChange}
                                        // required
                                         />
                                    </InputGroup>
                                  
            
                                </Col>
                              </Row>
            
                              <Row>
                                <Col sm>
                                  
                                    <InputGroup className="mb-2" >
                                      <InputGroup.Text style={{ fontWeight: "bold" }}>City</InputGroup.Text>
                                      <Form.Control name='city'
                                        placeholder='Enter City'
                                        value={userData?.city}
                                        // onChange={handleChange}
                                        // required 
                                        />
                                    </InputGroup>
                                 
            
                                </Col>
            
                                <Col sm>
                                  
                                    <InputGroup className="mb-2" >
                                      <InputGroup.Text style={{ fontWeight: "bold" }}>District</InputGroup.Text>
                                      <Form.Control
                                        name='district'
                                        placeholder='Enter District Name'
                                        value={userData?.district}
                                        // onChange={handleChange}
                                        disabled
                                      />
                                    </InputGroup>
                                  
            
                                </Col>
                              </Row>
            
                              <Row>
                                <Col sm>
                                  
                                    
                                      <InputGroup className="mb-2" >
                                        <InputGroup.Text style={{ fontWeight: "bold" }}>State</InputGroup.Text>
                                        <Form.Control
                                         
                                          aria-label="State"
                                          name='state'
                                          placeholder='Choose State'
                                          value={userData?.state}
                                        //   onChange={handleChange}
                                        //   required={userData.origin === "Indian Hindu"}
                                        />                                         
                                      </InputGroup>
                                   
                                  
            
            
                                </Col>
            
                                {(userData?.origin === "Gobal Hindu") && (
                                  <Col sm>
                                    <>
                                      
                                        <InputGroup className="mb-2" >
                                          <InputGroup.Text style={{ fontWeight: "bold" }}>Country</InputGroup.Text>
                                          <Form.Control
                                            name='country'
                                            placeholder="Name your Country or Territory or Region"
                                            value={userData?.country}
                                            // onChange={handleChange}
                                            // required={userData.origin === "Gobal Hindu"} 
                                            />
                                        </InputGroup>
                                      
            
                                      
                                    </>
                                  </Col>
                                )}
            
            
                                <Col sm>
                                  
                                    <InputGroup className="mb-2" >
                                      <InputGroup.Text style={{ fontWeight: "bold" }}>{userData?.origin === "Indian Hindu" ? 'PIN Code' : "ZIP Code"}</InputGroup.Text>
                                      <Form.Control name='PIN' placeholder={userData?.origin === "Indian Hindu" ? 'PIN Code' : "ZIP Code"} value={userData?.PIN} 
                                    //   onChange={handleChange} required
                                      />
                                    </InputGroup>
                                  
            
                                </Col>
            
            
                              </Row>
            
                             
            
            
            
                              {/* <div className='d-flex justify-content-center'>
                                <Button type="submit" className="w-80" disabled={loading} variant='secondary'>
                                  {loading ? (
                                    <span>
                                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" style={{ marginRight: '8px' }}></span>
                                      Submitting... <BsFillSendArrowUpFill />
                                    </span>
                                  ) : (
                                    <>Submit <BsFillSendFill /></>  // Correctly rendered as a React component
                                  )}
                                </Button>
                              </div> */}
            
                            </>
                          )}
            
                          <div className='d-flex justify-content-center' style={{ fontSize: "30px" }}>
                            <div onClick={handleSettingStep1} style={{ cursor: "pointer" }}> {step === 1 ? (<GoDotFill />) : (<GoDot />)} </div>
                            <div onClick={handleSettingStep2} style={{ cursor: "pointer" }}> {step === 2 ? (<GoDotFill />) : (<GoDot />)} </div>
                            <div onClick={handleSettingStep3} style={{ cursor: "pointer" }}> {step === 3 ? (<GoDotFill />) : (<GoDot />)} </div>
            
            
                          </div>
                          </Container>




        </div>
    )
}

export default ProfileData