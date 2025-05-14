// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Form, Button, Card, Row, Col, Image, Spinner, Alert, ListGroup } from 'react-bootstrap';
// import { toast } from 'react-toastify';
// import QRCode from 'qrcode.react';
// // import axios from 'axios';

// const CompleteCampaignerProfile = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         username: '',
//         campaignUseFor: 'individual',
//         orgName: '',
//         orgAddress: '',
//         orgCity: '',
//         Mission: '',
//         campaignFor: '',
//         campaignDuration: 0,
//         campaignAmount: 0,
//         paymentSlip: null,
//         agreedCampaignerTerms: false
//     });

//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [qrCodeData, setQrCodeData] = useState('');
//     const [previewImage, setPreviewImage] = useState('');

//     // Pricing based on duration
//     const pricing = {
//         7: 200,
//         15: 300,
//         30: 400
//     };

//     useEffect(() => {
//         // Load user data if editing existing profile
//         const loadUserData = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
//                     method: "GET",
//                 credentials: "include",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//                 });

//                 const userData = response.data.user;
//                 if (userData.isCampaignerProfileCompleted) {
//                     navigate('/become-campaigner');
//                 }

//                 setFormData(prev => ({
//                     ...prev,
//                     username: userData.username || '',
//                     campaignUseFor: userData.campaignUseFor || 'individual',
//                     orgName: userData.orgName || '',
//                     orgAddress: userData.orgAddress || '',
//                     orgCity: userData.orgCity || '',
//                     Mission: userData.Mission || '',
//                     campaignFor: userData.campaignFor || '',
//                     campaignDuration: userData.campaignDuration || 0,
//                     campaignAmount: userData.campaignAmount || 0,
//                     agreedCampaignerTerms: userData.agreedCampaignerTerms || false
//                 }));

//             } catch (error) {
//                 toast.error('Failed to load user data');
//                 console.error(error);
//             }
//         };

//         loadUserData();
//     }, [navigate]);

//     useEffect(() => {
//         // Generate QR code when amount is set
//         if (formData.campaignAmount > 0) {
//             const qrData = `Payment for campaign: ${formData.campaignAmount} INR`;
//             setQrCodeData(qrData);
//         }
//     }, [formData.campaignAmount]);

//     const handleChange = (e) => {
//         const { name, value, type, checked, files } = e.target;

//         if (type === 'file') {
//             const file = files[0];
//             if (file) {
//                 const reader = new FileReader();
//                 reader.onloadend = () => {
//                     setPreviewImage(reader.result);
//                 };
//                 reader.readAsDataURL(file);
//                 setFormData({ ...formData, [name]: file });
//             }
//         } else if (type === 'checkbox') {
//             setFormData({ ...formData, [name]: checked });
//         } else {
//             setFormData({ ...formData, [name]: value });

//             // Update amount when duration changes
//             if (name === 'campaignDuration') {
//                 const duration = parseInt(value);
//                 setFormData(prev => ({
//                     ...prev,
//                     campaignAmount: pricing[duration] || 0
//                 }));
//             }
//         }
//     };

//     const validateForm = () => {
//         const newErrors = {};

//         if (!formData.username) newErrors.username = 'Campaigner name is required';
//         if (!formData.Mission) newErrors.Mission = 'Mission statement is required';
//         if (!formData.campaignFor) newErrors.campaignFor = 'Campaign category is required';
//         if (formData.campaignDuration <= 0) newErrors.campaignDuration = 'Duration is required';
//         if (formData.campaignAmount <= 0) newErrors.campaignAmount = 'Amount must be greater than 0';
//         if (!formData.paymentSlip) newErrors.paymentSlip = 'Payment slip is required';
//         if (!formData.agreedCampaignerTerms) newErrors.agreedCampaignerTerms = 'You must agree to the terms';

//         if (formData.campaignUseFor === 'organization') {
//             if (!formData.orgName) newErrors.orgName = 'Organization name is required';
//             if (!formData.orgAddress) newErrors.orgAddress = 'Organization address is required';
//             if (!formData.orgCity) newErrors.orgCity = 'Organization city is required';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validateForm()) return;

//         setLoading(true);

//         try {
//             const token = localStorage.getItem('token');
//             const formDataToSend = new FormData();

//             // Append all form data
//             Object.keys(formData).forEach(key => {
//                 if (key === 'paymentSlip' && formData[key]) {
//                     formDataToSend.append(key, formData[key]);
//                 } else {
//                     formDataToSend.append(key, formData[key]);
//                 }
//             });

//             const response = await fetch(
//                 `${process.env.REACT_APP_API_URL}/user/complete-campaigner-profile`,

//                 {
//                     method: 'POST',
//                     body: formDataToSend,
//                     headers: {

//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             );

//             toast.success('Campaigner profile completed successfully!');
//             navigate('/become-campaigner');

//         } catch (error) {
//             console.error(error);
//             toast.error(error.response?.data?.message || 'Failed to complete campaigner profile');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container py-5">
//             <Card className="shadow">
//                 <Card.Header className="bg-primary text-white">
//                     <h2>Complete Campaigner Profile</h2>
//                 </Card.Header>
//                 <Card.Body>
//                     <Form onSubmit={handleSubmit}>
//                         <Row>
//                             <Col md={6}>
//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Campaigner Name</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="username"
//                                         value={formData.username}
//                                         onChange={handleChange}
//                                         isInvalid={!!errors.username}
//                                     />
//                                     <Form.Control.Feedback type="invalid">
//                                         {errors.username}
//                                     </Form.Control.Feedback>
//                                 </Form.Group>

//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Campaign For</Form.Label>
//                                     <Form.Select
//                                         name="campaignUseFor"
//                                         value={formData.campaignUseFor}
//                                         onChange={handleChange}
//                                     >
//                                         <option value="individual">Individual</option>
//                                         <option value="organization">Organization</option>
//                                     </Form.Select>
//                                 </Form.Group>

//                                 {formData.campaignUseFor === 'organization' && (
//                                     <>
//                                         <Form.Group className="mb-3">
//                                             <Form.Label>Organization Name</Form.Label>
//                                             <Form.Control
//                                                 type="text"
//                                                 name="orgName"
//                                                 value={formData.orgName}
//                                                 onChange={handleChange}
//                                                 isInvalid={!!errors.orgName}
//                                             />
//                                             <Form.Control.Feedback type="invalid">
//                                                 {errors.orgName}
//                                             </Form.Control.Feedback>
//                                         </Form.Group>

//                                         <Form.Group className="mb-3">
//                                             <Form.Label>Organization Address</Form.Label>
//                                             <Form.Control
//                                                 as="textarea"
//                                                 rows={2}
//                                                 name="orgAddress"
//                                                 value={formData.orgAddress}
//                                                 onChange={handleChange}
//                                                 isInvalid={!!errors.orgAddress}
//                                             />
//                                             <Form.Control.Feedback type="invalid">
//                                                 {errors.orgAddress}
//                                             </Form.Control.Feedback>
//                                         </Form.Group>

//                                         <Form.Group className="mb-3">
//                                             <Form.Label>Organization City</Form.Label>
//                                             <Form.Control
//                                                 type="text"
//                                                 name="orgCity"
//                                                 value={formData.orgCity}
//                                                 onChange={handleChange}
//                                                 isInvalid={!!errors.orgCity}
//                                             />
//                                             <Form.Control.Feedback type="invalid">
//                                                 {errors.orgCity}
//                                             </Form.Control.Feedback>
//                                         </Form.Group>
//                                     </>
//                                 )}

//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Mission Statement</Form.Label>
//                                     <Form.Control
//                                         as="textarea"
//                                         rows={3}
//                                         name="Mission"
//                                         value={formData.Mission}
//                                         onChange={handleChange}
//                                         isInvalid={!!errors.Mission}
//                                     />
//                                     <Form.Control.Feedback type="invalid">
//                                         {errors.Mission}
//                                     </Form.Control.Feedback>
//                                 </Form.Group>

//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Campaign Category</Form.Label>
//                                     <Form.Select
//                                         name="campaignFor"
//                                         value={formData.campaignFor}
//                                         onChange={handleChange}
//                                         isInvalid={!!errors.campaignFor}
//                                     >
//                                         <option value="">Select category</option>
//                                         <option value="education">Education</option>
//                                         <option value="health care">Health Care</option>
//                                         <option value="social service">Social Service</option>
//                                         <option value="business">Business</option>
//                                     </Form.Select>
//                                     <Form.Control.Feedback type="invalid">
//                                         {errors.campaignFor}
//                                     </Form.Control.Feedback>
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Campaign Duration (Days)</Form.Label>
//                                     <Form.Select
//                                         name="campaignDuration"
//                                         value={formData.campaignDuration}
//                                         onChange={handleChange}
//                                         isInvalid={!!errors.campaignDuration}
//                                     >
//                                         <option value="0">Select duration</option>
//                                         <option value="7">7 Days (INR 200)</option>
//                                         <option value="15">15 Days (INR 300)</option>
//                                         <option value="30">30 Days (INR 400)</option>
//                                     </Form.Select>
//                                     <Form.Control.Feedback type="invalid">
//                                         {errors.campaignDuration}
//                                     </Form.Control.Feedback>
//                                 </Form.Group>

//                                 {formData.campaignAmount > 0 && (
//                                     <>
//                                         <Form.Group className="mb-3">
//                                             <Form.Label>Campaign Amount (INR)</Form.Label>
//                                             <Form.Control
//                                                 type="text"
//                                                 value={formData.campaignAmount}
//                                                 readOnly
//                                             />
//                                         </Form.Group>

//                                         <div className="mb-3 text-center">
//                                             <h5>Scan QR Code to Pay</h5>
//                                             <div className="border p-2 d-inline-block">
//                                                 <QRCode 
//                                                     value={qrCodeData} 
//                                                     size={128} 
//                                                     level="H"
//                                                 />
//                                             </div>
//                                             <p className="mt-2 text-muted">
//                                                 Please upload payment slip after payment
//                                             </p>
//                                         </div>
//                                     </>
//                                 )}

//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Payment Slip (Screenshot)</Form.Label>
//                                     <Form.Control
//                                         type="file"
//                                         name="paymentSlip"
//                                         accept="image/*"
//                                         onChange={handleChange}
//                                         isInvalid={!!errors.paymentSlip}
//                                     />
//                                     <Form.Control.Feedback type="invalid">
//                                         {errors.paymentSlip}
//                                     </Form.Control.Feedback>
//                                     {previewImage && (
//                                         <Image 
//                                             src={previewImage} 
//                                             thumbnail 
//                                             className="mt-2" 
//                                             style={{ maxHeight: '200px' }}
//                                         />
//                                     )}
//                                 </Form.Group>

//                                 <Form.Group className="mb-3">
//                                     <Form.Check
//                                         type="checkbox"
//                                         name="agreedCampaignerTerms"
//                                         label={
//                                             <span>
//                                                 I agree to the <a href="/terms" target="_blank">Campaigner Terms and Conditions</a>
//                                             </span>
//                                         }
//                                         checked={formData.agreedCampaignerTerms}
//                                         onChange={handleChange}
//                                         isInvalid={!!errors.agreedCampaignerTerms}
//                                     />
//                                     <Form.Control.Feedback type="invalid">
//                                         {errors.agreedCampaignerTerms}
//                                     </Form.Control.Feedback>
//                                 </Form.Group>
//                             </Col>
//                         </Row>

//                         <div className="d-flex justify-content-end mt-4">
//                             <Button 
//                                 variant="primary" 
//                                 type="submit" 
//                                 disabled={loading}
//                             >
//                                 {loading ? (
//                                     <>
//                                         <Spinner
//                                             as="span"
//                                             animation="border"
//                                             size="sm"
//                                             role="status"
//                                             aria-hidden="true"
//                                         />
//                                         <span className="ms-2">Submitting...</span>
//                                     </>
//                                 ) : 'Complete Profile'}
//                             </Button>
//                         </div>
//                     </Form>
//                 </Card.Body>
//             </Card>
//         </div>
//     );
// };

// export default CompleteCampaignerProfile;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Row, Col, Image, Spinner, Alert, ListGroup, Tabs, Tab } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import './OpenSurvey.css';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import LoadingSpinner from '../../Components/Common/LoadingSpinner';



const CompleteCampaignerProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        campaignUseFor: 'individual',
        campaignerIDType: 'PAN',
        campaignerIDNumber: '',
        campaignerIDImage: null,
        orgName: '',
        orgAddress: '',
        orgCity: '',
        Mission: '',
        campaignFor: '',
        campaignDuration: 0,
        campaignAmount: 0,
        paymentSlip: null,

        agreedCampaignerTerms: false
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const [idImagePreview, setIdImagePreview] = useState(null);
    const [activeTab, setActiveTab] = useState('phonepe');
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedField, setSelectedField] = useState(null); // new
    
            const cropperRef = useRef(null);
            const [aspectRatio, setAspectRatio] = useState(7 / 9); // Default aspect ratio
    


    const dummyImage = '/ps1.webp';
    const dummyImageI = '/id1.webp'; 

    const phonepe200 = '/pp200.webp';
    const phonepe300 = '/pp300.webp';
    const phonepe400 = '/pp400.webp';
    const googlepay200 = '/gp200.webp';
    const googlepay300 = '/gp300.webp';
    const googlepay400 = '/gp400.webp';
    const paytm200 = '/ptm200.webp';
    const paytm300 = '/ptm300.webp';
    const paytm400 = '/ptm400.webp';


    // QR code images mapping
    const qrCodes = {
        phonepe: {
            200: phonepe200,
            300: phonepe300,
            400: phonepe400
        },
        googlepay: {
            200: googlepay200,
            300: googlepay300,
            400: googlepay400
        },
        paytm: {
            200: paytm200,
            300: paytm300,
            400: paytm400
        }
    };


    // Pricing based on duration
    const pricing = {
        7: 200,
        15: 300,
        30: 400
    };

    useEffect(() => {
        // Load user data if editing existing profile
        const loadUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                const userData = data.user;
                if (userData.isCampaignerProfileCompleted) {
                    navigate('/open-survey/create-own-survey');
                }

                setFormData(prev => ({
                    ...prev,
                    username: userData.updateFullName || '',
                    campaignUseFor: userData.campaignUseFor || 'individual',
                    orgName: userData.orgName || '',
                    orgAddress: userData.orgAddress || '',
                    orgCity: userData.orgCity || '',
                    Mission: userData.Mission || '',
                    campaignFor: userData.campaignFor || '',
                    campaignDuration: userData.campaignDuration || 0,
                    campaignAmount: userData.campaignAmount || 0,
                    agreedCampaignerTerms: userData.agreedCampaignerTerms || false
                }));

            } catch (error) {
                toast.error('Failed to load user data');
                console.error(error);
            }
        };

        loadUserData();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'file') {
            const file = files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setSelectedImage(reader.result);
                    setSelectedField(name); // track which field (either 'paymentSlip' or 'campaignerIDImage')
                };
                reader.readAsDataURL(file);
                setFormData({ ...formData, [name]: file });
            }
            
        } else if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else {
            const newFormData = { ...formData, [name]: value };

            // Update amount when duration changes
            if (name === 'campaignDuration') {
                const duration = parseInt(value);
                newFormData.campaignAmount = pricing[duration] || 0;
            }

            setFormData(newFormData);
        }
    };


    // const handleCrop = () => {
    //     const cropperInstance = cropperRef.current?.cropper;
    //     if (cropperInstance) {
    //         const croppedData = cropperInstance.getCroppedCanvas({
    //             width: 400,
    //             height: 600,
    //         }).toDataURL();
    
    //         if (selectedField === "paymentSlip") {
    //             setPreviewImage(croppedData); // make sure you define this state
    //         } else if (selectedField === "campaignerIDImage") {
    //             setIdImagePreview(croppedData);
    //         }
    
    //         setFormData(prev => ({ ...prev, [selectedField]: croppedData })); // Optional: set the cropped image into form
    //         setSelectedImage(null);
    //         setSelectedField(null);
    //     }
    // };
    

    const handleCrop = () => {
        const cropperInstance = cropperRef.current?.cropper;
    
        if (cropperInstance && selectedField) {
            cropperInstance.getCroppedCanvas({
                width: 400,
                height: 600,
            }).toBlob((blob) => {
                if (blob) {
                    const croppedFile = new File([blob], `${selectedField}-cropped.webp`, { type: "image/webp" });
    
                    // Update preview
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        if (selectedField === "paymentSlip") {
                            setPreviewImage(reader.result);
                        } else if (selectedField === "campaignerIDImage") {
                            setIdImagePreview(reader.result);
                        }
                    };
                    reader.readAsDataURL(croppedFile);
    
                    // Store the cropped file in formData
                    setFormData(prev => ({
                        ...prev,
                        [selectedField]: croppedFile
                    }));
    
                    setSelectedImage(null);
                    setSelectedField(null);
                }
            }, 'image/webp');
        }
    };
    

    const renderPaymentQR = () => {
        const amount = formData.campaignAmount;
        if (!amount || amount === 0) return null;

        const paymentMethod = activeTab;
        const qrImage = qrCodes[paymentMethod][amount];

        return (
            <div className="text-center">
                <Image
                    src={qrImage}
                    fluid
                    className="border p-2"
                    style={{ maxHeight: '250px' }}
                    alt={`${paymentMethod} QR code for INR ${amount}`}
                />
                <div className="mt-3">
                    <p className="mb-1"><strong>Amount to Pay: INR {amount}</strong></p>
                    <p className="text-muted">Scan this {paymentMethod} QR code to pay</p>
                </div>
            </div>
        );
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username) newErrors.username = 'Campaigner name is required';
        if (!formData.Mission) newErrors.Mission = 'Mission statement is required';
        if (!formData.campaignFor) newErrors.campaignFor = 'Campaign category is required';
        if (formData.campaignDuration <= 0) newErrors.campaignDuration = 'Duration is required';
        if (formData.campaignAmount <= 0) newErrors.campaignAmount = 'Amount must be greater than 0';
        if (!formData.paymentSlip) newErrors.paymentSlip = 'Payment slip is required';
        if (!formData.agreedCampaignerTerms) newErrors.agreedCampaignerTerms = 'You must agree to the terms';
        if (!formData.campaignerIDImage) newErrors.campaignerIDImage = `${formData.campaignerIDType} image is required`;
        
        

        if (formData.campaignUseFor === 'organization') {
            if (!formData.orgName) newErrors.orgName = 'Organization name is required';
            if (!formData.orgAddress) newErrors.orgAddress = 'Organization address is required';
            if (!formData.orgCity) newErrors.orgCity = 'Organization city is required';
            if (!formData.campaignerIDType) newErrors.campaignerIDType = 'Organization ID type is required';
            if (!formData.campaignerIDNumber) newErrors.campaignerIDNumber = 'Organization ID proof number is required';
        }
        if (formData.campaignUseFor === 'individual') {
            if (!formData.campaignerIDType) newErrors.campaignerIDType = 'ID Document type is required';
            if (!formData.campaignerIDNumber) newErrors.campaignerIDNumber = 'ID proof number is required';
            
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const formDataToSend = new FormData();

            // // Append all form data
            // Object.keys(formData).forEach(key => {
            //     if (key === 'paymentSlip' && formData[key]) {
            //         formDataToSend.append(key, formData[key]);
            //     } else {
            //         formDataToSend.append(key, formData[key]);
            //     }
            // });

            Object.keys(formData).forEach(key => {
                const value = formData[key];
            
                if (value instanceof File) {
                    formDataToSend.append(key, value);
                } else {
                    formDataToSend.append(key, value);
                }
            });
            

            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/campaign/complete-campaigner-profile`,
                {
                    method: 'POST',
                    body: formDataToSend,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.log('Full error response:', errorData);
                throw new Error('Failed to complete campaigner profile');
            }

            toast.success('Campaigner profile completed successfully!');
            navigate('/open-survey/create-own-survey');

        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Failed to complete campaigner profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }



    return (
        <div className="container py-4 ">
            <Card className="shadow mb-5">
                <Card.Header className="bg-primary text-white">
                    <h2>Complete Campaigner Profile</h2>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Campaigner Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        isInvalid={!!errors.username}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.username}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Campaign For</Form.Label>
                                    <Form.Select
                                        name="campaignUseFor"
                                        value={formData.campaignUseFor}
                                        onChange={handleChange}
                                    >
                                        <option value="individual">Individual</option>
                                        <option value="organization">Organization</option>
                                    </Form.Select>
                                </Form.Group>
                                {formData.campaignUseFor === 'individual' && (
                                    <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Identity Proof Document</Form.Label>
                                        <Form.Select
                                            name="campaignerIDType"
                                            value={formData.campaignerIDType}
                                            onChange={handleChange}
                                            isInvalid={!!errors.campaignerIDType}
                                        >
                                            <option value="PAN">PAN</option>
                                            <option value="Aadhaar">Aadhaar</option>                                            
                                            <option value="Epic">Voter ID</option>
                                            <option value="Driving Licence">Driving Licence</option>
                                            <option value="Passport">Passport</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                        {errors.campaignerIDType}
                                    </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                            <Form.Label>ID Proof Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="campaignerIDNumber"
                                                value={formData.campaignerIDNumber}
                                                onChange={handleChange}
                                                isInvalid={!!errors.campaignerIDNumber}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.campaignerIDNumber}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        </>
                                )}

                                {formData.campaignUseFor === 'organization' && (
                                    <>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Organization Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="orgName"
                                                value={formData.orgName}
                                                onChange={handleChange}
                                                isInvalid={!!errors.orgName}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.orgName}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                        <Form.Label>Identity Proof Document</Form.Label>
                                        <Form.Select
                                            name="campaignerIDType"
                                            value={formData.campaignerIDType}
                                            onChange={handleChange}
                                            isInvalid={!!errors.campaignerIDType}
                                        >
                                            <option value="PAN">PAN</option>
                                            <option value="Socity Registration">Socity Registration</option>
                                            <option value="Trust Registration">Trust Registration</option>
                                            <option value="Company Registration">Company Registration</option>
                                            
                                            
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                        {errors.campaignerIDType}
                                    </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                            <Form.Label>ID Proof Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="campaignerIDNumber"
                                                value={formData.campaignerIDNumber}
                                                onChange={handleChange}
                                                isInvalid={!!errors.campaignerIDNumber}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.campaignerIDNumber}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Organization Address</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                name="orgAddress"
                                                value={formData.orgAddress}
                                                onChange={handleChange}
                                                isInvalid={!!errors.orgAddress}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.orgAddress}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Organization City</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="orgCity"
                                                value={formData.orgCity}
                                                onChange={handleChange}
                                                isInvalid={!!errors.orgCity}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.orgCity}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </>
                                )}

                                <Form.Group className="mb-3">
                                    <Form.Label>Mission Statement</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={1}
                                        name="Mission"
                                        value={formData.Mission}
                                        onChange={handleChange}
                                        isInvalid={!!errors.Mission}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.Mission}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Campaign Category</Form.Label>
                                    <Form.Select
                                        name="campaignFor"
                                        value={formData.campaignFor}
                                        onChange={handleChange}
                                        isInvalid={!!errors.campaignFor}
                                    >
                                        <option value="">Select category</option>
                                        <option value="education">Education</option>
                                        <option value="health care">Health Care</option>
                                        <option value="social service">Social Service</option>
                                        <option value="business">Business</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.campaignFor}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Campaign Duration (Days)</Form.Label>
                                    <Form.Select
                                        name="campaignDuration"
                                        value={formData.campaignDuration}
                                        onChange={handleChange}
                                        isInvalid={!!errors.campaignDuration}
                                    >
                                        <option value="0">Select duration</option>
                                        <option value="7">7 Days (INR 200)</option>
                                        <option value="15">15 Days (INR 300)</option>
                                        <option value="30">30 Days (INR 400)</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.campaignDuration}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                {formData.campaignAmount > 0 && (
                                    <>
                                        <div className="mb-3">
                                            <h5>Payment Options</h5>
                                            <Tabs
                                                activeKey={activeTab}
                                                onSelect={(k) => setActiveTab(k)}
                                                className="mb-3"
                                            >
                                                <Tab eventKey="phonepe" title="PhonePe">
                                                    {renderPaymentQR()}
                                                </Tab>
                                                <Tab eventKey="googlepay" title="Google Pay">
                                                    {renderPaymentQR()}
                                                </Tab>
                                                <Tab eventKey="paytm" title="Paytm">
                                                    {renderPaymentQR()}
                                                </Tab>
                                            </Tabs>

                                            <div className="alert alert-info">
                                                <strong>Payment Instructions:</strong>
                                                <ol className="mb-0">
                                                    <li>Select your preferred payment app</li>
                                                    <li>Scan the QR code with your app</li>
                                                    <li>Verify the amount matches automatically</li>
                                                    <li>Complete the payment</li>
                                                    <li>Upload the payment screenshot below</li>
                                                </ol>
                                            </div>
                                        </div>


                                        {!previewImage && (
                                            <Form.Group className="mb-3">
                                                <Form.Label>Payment Slip (Screenshot)</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    name="paymentSlip"
                                                    accept="image/*"
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.paymentSlip}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.paymentSlip}
                                                </Form.Control.Feedback>
                                                {/* {previewImage && (
                                                <Image
                                                    src={previewImage}
                                                    thumbnail
                                                    className="mt-2"
                                                    style={{ maxHeight: '200px' }}
                                                    alt="Payment slip preview"
                                                />

                                            )} */}
                                            </Form.Group>
                                        )}
                                        {!idImagePreview && (
                                            <Form.Group className="mb-3">
                                                <Form.Label>Upload {formData.campaignerIDType} Document</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    name="campaignerIDImage"
                                                    accept="image/*"
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.campaignerIDImage}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.campaignerIDImage}
                                                </Form.Control.Feedback>
                                                {/* {idImagePreview && (
                                                <Image
                                                    src={idImagePreview}
                                                    thumbnail
                                                    className="mt-2"
                                                    style={{ maxHeight: '200px' }}
                                                    alt="ID Document preview"
                                                />
                                            )} */}
                                            </Form.Group>)}

                                        <Form.Group className="mb-4">
                                            <Row>
                                                <Col >
                                                    <Form.Label>Payment Slip (Screenshot)</Form.Label>
                                                    <div className="position-relative">
                                                        <Form.Control
                                                            type="file"
                                                            name="paymentSlip"
                                                            accept="image/*"
                                                            onChange={handleChange}
                                                            isInvalid={!!errors.paymentSlip}
                                                            className="d-none"
                                                            id="paymentSlipInput"
                                                        />
                                                        <label htmlFor="paymentSlipInput" className="custom-upload-labels">
                                                            <Image
                                                                title='Click to upload Payment Slip'
                                                                src={previewImage || dummyImage}
                                                                thumbnail
                                                                className="upload-previews"
                                                                alt="Payment Slip"
                                                            />
                                                        </label>
                                                        
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.paymentSlip}
                                                        </Form.Control.Feedback>
                                                    </div>
                                                </Col>

                                                {/* ID Document Upload */}
                                                <Col >
                                                    <Form.Label>Upload {formData.campaignerIDType} Document</Form.Label>
                                                    <div className="position-relative">
                                                        <Form.Control
                                                            type="file"
                                                            name="campaignerIDImage"
                                                            accept="image/*"
                                                            onChange={handleChange}
                                                            isInvalid={!!errors.campaignerIDImage}
                                                            className="d-none"
                                                            id="idImageInput"
                                                        />
                                                        <label htmlFor="idImageInput" className="custom-upload-labels">
                                                            <Image
                                                             title='Click to upload ID'
                                                                src={idImagePreview || dummyImageI}
                                                                thumbnail
                                                                className="upload-previews"
                                                                alt="ID Document"
                                                            />
                                                        </label>
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.campaignerIDImage}
                                                        </Form.Control.Feedback>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Form.Group>

                                    </>
                                )}

                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        name="agreedCampaignerTerms"
                                        label={
                                            <span>
                                                I agree to the <a href="/terms" target="_blank">Campaigner Terms and Conditions</a>
                                            </span>
                                        }
                                        checked={formData.agreedCampaignerTerms}
                                        onChange={handleChange}
                                        isInvalid={!!errors.agreedCampaignerTerms}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.agreedCampaignerTerms}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Submit button remains the same */}
                        <div className="d-flex justify-content-end mt-4">
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        <span className="ms-2">Submitting...</span>
                                    </>
                                ) : 'Complete Profile'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            {selectedImage && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderRadius: "8px",
                            width: "90%",
                            maxWidth: "400px",
                            textAlign: "center",
                        }}
                    >
                        <h5>Crop Image</h5>
                        <Cropper
                            src={selectedImage}
                            style={{ width: "100%", height: "auto" }}
                            initialAspectRatio={aspectRatio}
                            aspectRatio={aspectRatio}
                            guides={false}
                            background={true}
                            rotatable={true}
                            dragMode="move"
                            ref={cropperRef}
                        />
                        <div style={{ marginTop: "10px" }}>
                            <button
                                onClick={handleCrop}
                                style={{
                                    marginRight: "10px",
                                    backgroundColor: "#007bff",
                                    color: "#fff",
                                    padding: "5px 10px",
                                    borderRadius: "5px",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedImage(null);
                                    setSelectedField(null);
                                  }}
                                style={{
                                    backgroundColor: "gray",
                                    color: "#fff",
                                    padding: "5px 10px",
                                    borderRadius: "5px",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompleteCampaignerProfile;