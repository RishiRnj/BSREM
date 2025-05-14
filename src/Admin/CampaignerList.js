// import React, {useEffect, useState}  from 'react'

// const CampaignerList = () => {
//     const [campaigners, setCampaigners] = useState([]);

//     useEffect(() => {
//         const fetchCampaigners = async () => {
//             try {
//                 const response = await fetch(`${process.env.REACT_APP_API_URL}/api/campaign/campaigners`, {
//                     headers: {
//                         'Authorization': `Bearer ${localStorage.getItem('token')}`
//                     }
//                 });
//                 if (!response.ok) throw new Error('Failed to fetch campaigners');
//                 const data = await response.json();
//                 console.log('campaigners', data);
                
//                 setCampaigners(data);
//             } catch (error) {
//                 console.error(error);
//             }
//         };
//         fetchCampaigners();
//     }, []);
//   return (
//     <div>CampaignerList</div>
//   )
// }

// export default CampaignerList

import React, { useEffect, useState } from 'react';
import { Table, Button, Badge, Image, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const CampaignerList = () => {
    const [campaigners, setCampaigners] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCampaigner, setSelectedCampaigner] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCampaigners();
    }, []);

    const fetchCampaigners = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/campaign/campaigners`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch campaigners');
            const data = await response.json();
            setCampaigners(data);
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const handleApprove = async (campaignerId) => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/campaign/approve/${campaignerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to approve campaigner');
            
            toast.success('Campaigner approved successfully');
            fetchCampaigners(); // Refresh the list
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const openDetailsModal = (campaigner) => {
        setSelectedCampaigner(campaigner);
        setShowModal(true);
    };

    return (
        <div className="container py-4 mb-5">
            <h2 className="mb-4">Campaigner Applications</h2>
            
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {campaigners.map(campaigner => (
                        <tr key={campaigner._id}>
                            <td>{campaigner.username || campaigner.updateFullName}</td>
                            <td>{campaigner.email}</td>
                            <td>
                                {campaigner.campaignUseFor === 'organization' ? 
                                    'Organization' : 'Individual'}
                            </td>
                            <td>{campaigner.campaignFor}</td>
                            <td>₹ {campaigner.campaignAmount}</td>
                            <td>
                                <Badge 
                                    bg={campaigner.campaignPaymentStatus === 'completed' ? 
                                        'success' : 'warning'}
                                >
                                    {campaigner.campaignPaymentStatus}
                                </Badge>
                            </td>
                            <td>
                                <Button 
                                    variant="info" 
                                    size="sm" 
                                    onClick={() => openDetailsModal(campaigner)}
                                    className="me-2"
                                >
                                    View
                                </Button>
                                {!campaigner.isCampaigner && (
                                    <Button 
                                        variant="success" 
                                        size="sm" 
                                        onClick={() => handleApprove(campaigner._id)}
                                        disabled={loading}
                                    >
                                        Approve
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Details Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                {selectedCampaigner && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>Campaigner Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row">
                                <div className="col-md-6">
                                    <h5>Basic Information</h5>
                                    <p><strong>Name:</strong> {selectedCampaigner.username || selectedCampaigner.updateFullName}</p>
                                    <p><strong>Email:</strong> {selectedCampaigner.email}</p>
                                    <p><strong>Mobile:</strong> {selectedCampaigner.mobile}</p>
                                    <p><strong>Type:</strong> {selectedCampaigner.campaignUseFor === 'organization' ? 'Organization' : 'Individual'}</p>
                                    
                                    {selectedCampaigner.campaignUseFor === 'organization' && (
                                        <>
                                            <p><strong>Organization Name:</strong> {selectedCampaigner.orgName}</p>
                                            <p><strong>Address:</strong> {selectedCampaigner.orgAddress}</p>
                                            <p><strong>City:</strong> {selectedCampaigner.orgCity}</p>
                                        </>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <h5>Campaign Details</h5>
                                    <p><strong>Category:</strong> {selectedCampaigner.campaignFor}</p>
                                    <p><strong>Mission:</strong> {selectedCampaigner.Mission}</p>
                                    <p><strong>Duration:</strong> {selectedCampaigner.campaignDuration} days</p>
                                    <p><strong>Amount:</strong> ₹ {selectedCampaigner.campaignAmount}</p>
                                    <p><strong>Payment Status:</strong> 
                                        <Badge bg={selectedCampaigner.campaignPaymentStatus === 'completed' ? 'success' : 'warning'} className="ms-2">
                                            {selectedCampaigner.campaignPaymentStatus}
                                        </Badge>
                                    </p>
                                </div>
                            </div>
                            
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <h5>Identity Proof</h5>
                                    <p><strong>ID Type:</strong> {selectedCampaigner.campaignerIDType}</p>
                                    <p><strong>ID Number:</strong> {selectedCampaigner.campaignerIDNumber}</p>
                                    {selectedCampaigner.campaignerIDImage && (
                                        <div className="mt-2">
                                            <Image 
                                                src={selectedCampaigner.campaignerIDImage} 
                                                thumbnail 
                                                style={{ maxHeight: '200px' }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <h5>Payment Proof</h5>
                                    {selectedCampaigner.paymentSlip && (
                                        <Image 
                                            src={selectedCampaigner.paymentSlip} 
                                            thumbnail 
                                            style={{ maxHeight: '200px' }}
                                        />
                                    )}
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Close
                            </Button>
                            {!selectedCampaigner.isCampaigner && (
                                <Button 
                                    variant="primary" 
                                    onClick={() => {
                                        handleApprove(selectedCampaigner._id);
                                        setShowModal(false);
                                    }}
                                    disabled={loading}
                                >
                                    Approve Campaigner
                                </Button>
                            )}
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default CampaignerList;