import React, { useContext} from 'react';
import { useNavigate } from "react-router-dom";
import { FaHouseChimney, FaBuildingUser  } from "react-icons/fa6";
import { Button } from 'react-bootstrap';
import AuthContext from "../../Context/AuthContext";

const Butn = () => {
    const navigate = useNavigate(); // Use navigate to go back to previous page
    const { user } = useContext(AuthContext);
    const isAuthenticated = !!user;
    const userId = user?.id;
  return (
    <div className="d-flex justify-content-between mb-3">
            <div className='ms-auto me-auto'>
                {/* Back Button */}
                <Button 
                    variant="primary"
                    onClick={() => navigate('/forum')} // Go back to the previous page
                >
                  <FaHouseChimney />  Home
                </Button>
            </div>
            <div className='me-auto ms-auto'>
                {/* Back Button */}
                <Button
                    variant="secondary"
                    onClick={() => navigate(`/user/${userId}/profile`)} // Go back to the previous page
                >
                   <FaBuildingUser /> User Page
                </Button>
            </div>

            </div>
  )
}

export default Butn