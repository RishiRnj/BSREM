import React from 'react'
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";


const Admin = () => {
  const navigate = useNavigate();


  return (
    <>
    
    
    
   
    <div><h1 className="text-center mb-4"> Admin </h1></div>

    <div className='mt-4'style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: `calc(100vh - 165px)`
      }}>
          <Button onClick={() => navigate("/admin/notices")}
           style={{
            display: 'flex', alignItems: 'center', padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}>Create Notice
          </Button>

          <Button className='mt-3' onClick={() => navigate("/admin/handleBeneficiary")}
           style={{
            display: 'flex', alignItems: 'center', padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}>Handle Beneficiaries
          </Button>

        </div>

        </>



  )
}

export default Admin