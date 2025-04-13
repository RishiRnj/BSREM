import React, { useContext, useEffect, useState } from 'react'
import { Row, Col, InputGroup, Badge, Card } from 'react-bootstrap'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { GoVerified, GoDotFill, GoDot } from "react-icons/go";
import "./JoinUs.css"; // Include your custom styles here
import { BiPencil } from 'react-icons/bi';
import { GrFormNext } from 'react-icons/gr';
import { useNavigate, useLocation } from 'react-router-dom';


const PreFieldData = ({ isUser, isStepOneCompleted }) => {
    // console.log('LOGIN USER:', isUser);


    const [formData, setFormData] = useState({
        userImage: isUser?.userImage,
        firstName: isUser?.updateFullName || isUser?.displayName || isUser?.username || "",
        email: isUser?.email || "",
        mobile: isUser?.mobile || "+91 1234567890",
        dob: isUser?.dob || "",
        age: isUser?.age || "",
        bloodGroup: isUser?.bloodGroup || "",
        hobby: isUser?.hobby || "",
        occupationCategory: isUser?.occupationCategory || "",
        occupation: isUser?.occupation || "",
        moreAboutOccupation: isUser?.moreAboutOccupation || "",

        origin: isUser?.origin || "",
        address: isUser?.address || "",
        city: isUser?.city || "",
        district: isUser?.district || "",
        state: isUser?.state || "",
        PIN: isUser?.PIN || "",
        country: isUser?.country || "",
    });

    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();
    const id = isUser?._id || isUser?.userId || isUser?.user?._id || isUser?.user?.userId || isUser?.user?._id;

    console.log('FORM DATA:', id);

   

    const handleUpdatePro = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Please log in to access this page.");
            }
    
            const apiUrl = `${process.env.REACT_APP_API_URL}/user/profile/reUpdate/${id}`;
            console.log("API URL:", apiUrl);  // Log the API URL
            console.log("Token:", token);    // Log the token for debugging
    
            const response = await fetch(apiUrl, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (!response.ok) {
                throw new Error(response.status === 401
                    ? "Session expired. Please log in again."
                    : "Failed to fetch user profile.");
            }
    
            localStorage.setItem("redirectAfterUpdate", location.pathname);
            navigate(`/user/${id}/update-profile`, { replace: true });
    
        } catch (error) {
            console.error("Error in checkUserProfile:", error);
            localStorage.setItem("redirectAfterUpdate", location.pathname);
            navigate("/login", { state: { from: location }, replace: true });
            throw error;
        }
    };
    

    return (
        <div className='pt-2'  >
            <Card className='px-3 m-2 shadow-sm' style={{ borderRadius: "10px"}}>


                <Row className='mt-3'>
                    <Col sm className='d-flex justify-content-center align-items-center'>
                        {formData.userImage && (
                            <img src={formData.userImage} alt="Profile" width="100" height="100" style={{ borderRadius: "50%" }} />
                        )}

                    </Col>
                </Row>
                {step === 1 && (
                    <>


                        <Row>
                            <Col sm className='m-1'>
                                <InputGroup>
                                    <InputGroup.Text style={{ fontWeight: "bold" }}>Name</InputGroup.Text>
                                    <input type="text" className="form-control" value={formData.firstName} readOnly />
                                </InputGroup>
                            </Col>

                            <Col sm className='m-1'>
                                <InputGroup>
                                    <InputGroup.Text style={{ fontWeight: "bold" }}>Email</InputGroup.Text>
                                    <input type="text" className="form-control" value={formData.email} readOnly />
                                </InputGroup>
                            </Col>
                        </Row>

                        <Row>

                            <Col sm className='m-1'>
                                <div className="position-relative">
                                    <PhoneInput
                                        disabled={formData?.mobile}

                                        value={formData.mobile}
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

                                </div>
                            </Col>

                            <Col sm className='m-1'>
                                <InputGroup>
                                    <InputGroup.Text style={{ fontWeight: "bold" }}>Blood Group</InputGroup.Text>
                                    <input type="text" className="form-control" value={formData.bloodGroup} readOnly />
                                </InputGroup>

                            </Col>

                            <Col sm className='m-1'>
                                <div className="position-relative">
                                    <InputGroup className="" >
                                        <InputGroup.Text style={{ fontWeight: "bold" }}>D.O.B</InputGroup.Text>
                                        <input className="form-control" value={formData.dob} readOnly />
                                    </InputGroup>

                                    {formData.dob && (

                                        <Badge
                                            className="position-absolute"
                                            style={{ right: 20, top: "50%", transform: "translateY(-50%)", color: "white" }}
                                        > Age: {formData.age} years</Badge>

                                    )}
                                </div>
                            </Col>


                        </Row>

                        <Row>
                            <Col sm className='m-1'>
                                <InputGroup>
                                    <InputGroup.Text style={{ fontWeight: "bold" }}>Interested In</InputGroup.Text>
                                    <input type="text" className="form-control" value={formData.hobby} readOnly />
                                </InputGroup>

                            </Col>
                            <Col sm className='m-1'>
                                <InputGroup>
                                    <InputGroup.Text style={{ fontWeight: "bold" }}>Occupation Category</InputGroup.Text>
                                    <input type="text" className="form-control" value={formData.occupationCategory} readOnly />
                                </InputGroup>
                            </Col>
                        </Row>
                        <div className='d-flex justify-content-around m-1' >
                        <button className='btn btn-primary m-2' onClick={handleUpdatePro}>Edit User Info <BiPencil/> </button>
                            <button className='btn btn-danger m-2' onClick={() => setStep(2)}>Next <GrFormNext/> </button>


                        </div>

                    </>
                )}


                {step === 2 && (
                    <>
                        <Row>
                            <Col sm className='m-1'>
                                <InputGroup>
                                    <InputGroup.Text style={{ fontWeight: "bold" }}>Occupation</InputGroup.Text>
                                    <input type="text" className="form-control" value={formData.occupation} readOnly />
                                </InputGroup>
                            </Col>
                            <Col sm className='m-1'>
                                <InputGroup>
                                    <InputGroup.Text style={{ fontWeight: "bold" }}>More about Occupation</InputGroup.Text>
                                    <input type="text" className="form-control" value={formData.moreAboutOccupation} readOnly />
                                </InputGroup>
                            </Col>
                            <Col sm className='m-1'>
                                <InputGroup>
                                    <InputGroup.Text style={{ fontWeight: "bold" }}>Locality</InputGroup.Text>
                                    <input type="text" className="form-control" value={formData.address} readOnly />
                                </InputGroup>
                            </Col>

                        </Row>

                        <Row>
                            <Col sm className='m-1'>

                                <InputGroup>
                                    <InputGroup.Text style={{ fontWeight: "bold" }}>City</InputGroup.Text>
                                    <input type="text" className="form-control" value={formData.city} readOnly />
                                </InputGroup>
                            </Col>
                            <Col sm className='m-1'>

                                <InputGroup>
                                    <InputGroup.Text style={{ fontWeight: "bold" }}>District</InputGroup.Text>
                                    <input type="text" className="form-control" value={formData.district} readOnly />
                                </InputGroup>
                            </Col>

                            <Col sm className='m-1'>

                                <InputGroup>
                                    <InputGroup.Text style={{ fontWeight: "bold" }}>State</InputGroup.Text>
                                    <input type="text" className="form-control" value={formData.state} readOnly />
                                </InputGroup>
                            </Col>


                        </Row>
                        <Row>
                            <Col sm className='m-1'>

                                <InputGroup>
                                    <InputGroup.Text style={{ fontWeight: "bold" }}>Origin</InputGroup.Text>
                                    <input type="text" className="form-control" value={formData.origin} readOnly />
                                </InputGroup>
                            </Col>
                            <Col sm className='m-1'>

                                <InputGroup>
                                    <InputGroup.Text style={{ fontWeight: "bold" }}>Country</InputGroup.Text>
                                    <input type="text" className="form-control" value={formData.country} readOnly />
                                </InputGroup>
                            </Col>
                        </Row>
                        <div className='d-flex justify-content-around m-1'>
                            <button className='btn btn-primary m-2' onClick={handleUpdatePro}>Edit User Info <BiPencil/> </button>
                            <button className='btn btn-danger m-2' onClick={() => isStepOneCompleted(true)}>Next <GrFormNext/> </button>

                        </div>

                    </>
                )}
            </Card>



        </div>
    )
}

export default PreFieldData