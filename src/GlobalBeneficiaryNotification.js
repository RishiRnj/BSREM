import { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const GlobalBeneficiaryNotification = () => {
  const [notification, setNotification] = useState(null);
  const [show, setShow] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/beneficiary/beneficiaries/notification`);
        const data = await response.json();
        console.log('Notification data:', data);
        
        if (data.showNotification) {
          setNotification(data);
          setShow(true);
        } else {
          setShow(false);
        }
      } catch (error) {
        console.error('Error fetching notification:', error);
        setShow(false);
      }
    };

    // Fetch initially
    fetchNotification();
    
    // Set up polling (e.g., every 5 minutes)
    const interval = setInterval(fetchNotification, 300000);
    
    return () => clearInterval(interval);
  }, []);

  // Don't show on certain pages or if notification shouldn't be shown
  if (!show || !notification || location.pathname.startsWith('/donate') || location.pathname.startsWith('/register/for_support') || location.pathname.startsWith('/admin') || location.pathname.startsWith('/login') || location.pathname.startsWith('/beneficiary/')) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '190px',
      right: '30px',
      width: '300px',
      zIndex: 1050,
      animation: 'slideIn 0.5s ease-out',
      
    }}>
      <Alert variant="info" dismissible onClose={() => setShow(false)}>
        <Alert.Heading>Help Needed</Alert.Heading>
        <p>
          {notification.message} <br/> <strong>{notification.data.beneficiaryName} </strong> needs your help with: <em> {notification.data.beneficiaryRequest}</em>
       <br/>
       <strong> Amount needed:</strong> {notification.data.beneficiaryAmtNeed}</p>
        <div className="d-flex justify-content-end">
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => window.location.href = `/donate`}
          >
            Support Now
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default GlobalBeneficiaryNotification;