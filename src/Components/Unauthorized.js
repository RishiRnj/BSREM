import React from 'react'
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: `calc(100vh - 65px)`
      }}>

        <div >
          <h1 className='text-center'> Unauthorized Access!
          </h1>
        </div>


        <div className='mt-4 mb-4'>
          <Button center onClick={() => navigate("/forum")} style={{
            display: 'flex', alignItems: 'center', padding: '10px 20px',
          }}> Go to Home
          </Button>
          </div>
      </div>
    </>
  )
}

export default Unauthorized