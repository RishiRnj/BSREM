// // GlobalSurveyNotification.js
import { useEffect, useState, useContext } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from './Context/AuthContext';
import { useLocation } from 'react-router-dom';



const GlobalSurveyNotification = () => {
  const [pendingSurveys, setPendingSurveys] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize localStorage
  useEffect(() => {
    if (!localStorage.getItem('dismissedSurveys')) {
      localStorage.setItem('dismissedSurveys', JSON.stringify([]));
    }
    if (!localStorage.getItem('completedSurveys')) {
      localStorage.setItem('completedSurveys', JSON.stringify([]));
    }
  }, []);

  const checkPendingSurveys = async () => {
    try {
      const headers = {};
    const token = localStorage.getItem('token');
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/surveys/pending`, {
      headers
    });

    if (!response.ok) throw new Error('Failed to fetch pending surveys');
      
      const surveys = await response.json();
      
      
      
      // Filter dismissed surveys
      const dismissed = JSON.parse(localStorage.getItem('dismissedSurveys') || '[]');
      const filteredSurveys = surveys.filter(survey => 
        !dismissed.includes(survey._id.toString())
      );

      // For anonymous users, filter completed surveys
      if (!user) {
        const completed = JSON.parse(localStorage.getItem('completedSurveys') || '[]');
        const finalSurveys = filteredSurveys.filter(survey => 
          !completed.includes(survey._id.toString())
        );
        setPendingSurveys(finalSurveys);
      } else {
        setPendingSurveys(filteredSurveys);
      }
    } catch (err) {
      console.error('Error checking pending surveys:', err);
    }
  };

  useEffect(() => {
    checkPendingSurveys();
    const interval = setInterval(checkPendingSurveys, 300000);
    return () => clearInterval(interval);
  }, [user]);

  const handleDismiss = () => {
    const dismissed = pendingSurveys.map(survey => ({
      id: survey._id.toString(),
      timestamp: Date.now()
    }));
    localStorage.setItem('dismissedSurveys', 
      JSON.stringify([
        ...JSON.parse(localStorage.getItem('dismissedSurveys') || '[]'), 
        ...dismissed
      ])
    );
    setPendingSurveys([]);
  };

  // Don't show on survey pages or if no pending surveys
  if (location.pathname.startsWith('/open-survey/') || location.pathname.startsWith('/admin') || pendingSurveys.length === 0 || location.pathname.startsWith('/beneficiary/')) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '25px',
      right: '30px',
      width: '300px',
      zIndex: 1050,
      animation: 'slideIn 0.5s ease-out'
    }}>
      <Alert variant="info" dismissible onClose={handleDismiss}>
        <Alert.Heading>Survey Reminder</Alert.Heading>
        <p>You have {pendingSurveys.length} pending survey(s) to complete.</p>
        <Button 
          variant="primary" 
          size="sm"
          onClick={() => navigate(`/open-survey/byAdmin/${pendingSurveys[0]._id}/active`)}
        >
          Take Survey Now
        </Button>
      </Alert>
    </div>
  );
};

export default GlobalSurveyNotification;