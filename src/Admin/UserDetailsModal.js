import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material';

const UserDetailsModal = ({ user, onClose }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (user?.respondent) {
                try {
                    setLoading(true);
                    setError(null);
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${user.respondent}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to fetch user details: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    setUserData(data);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                    setError(error.message);
                    setUserData(null);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserDetails();

        // Cleanup function to reset state when modal closes
        return () => {
            setUserData(null);
            setLoading(false);
            setError(null);
        };
    }, [user]);

    return (
        <Modal
            open={!!user}
            onClose={onClose}
            aria-labelledby="user-details-modal"
            aria-describedby="user-details-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                maxHeight: '80vh',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 1,
                outline: 'none',
                overflowY: 'auto'
            }}>
                <Typography variant="h6" component="h2" mb={2}>
                    User Details
                </Typography>
                
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (userData || user) ? (
                    <Box sx={{ mt: 2 }}>
                        <Typography><strong>Name:</strong> {(userData?.respondentName || user?.respondentName) || 'Not provided'}</Typography>
                        <Typography><strong>User Type:</strong> {(userData?.anonymousId || user?.anonymousId) ? 'Guest User' : 'Registered User'}</Typography>
                        {(userData?.email || user?.email) && <Typography><strong>Email:</strong> {userData?.email || user?.email}</Typography>}
                        {(userData?.mobile || user?.userId) && <Typography><strong>Contact No:</strong> {userData?.mobile || user?.userId}</Typography>}
                        {(userData?.anonymousId || user?.anonymousId) && <Typography><strong>Anonymous ID:</strong> {userData?.anonymousId || user?.anonymousId}</Typography>}
                        {(userData?.createdAt || user?.createdAt) && <Typography><strong>Account Created:</strong> {new Date(userData?.createdAt || user?.createdAt).toLocaleDateString()}</Typography>}
                    </Box>
                ) : (
                    <Typography>No user data available</Typography>
                )}
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                        onClick={onClose}
                        variant="contained"
                        disabled={loading}
                    >
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default UserDetailsModal;