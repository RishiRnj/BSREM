import React from 'react';
import { Button } from 'react-bootstrap';
import { RiAccountPinBoxFill } from "react-icons/ri";

function RegisterLink({ onClick }) {
  return (
    <div className="d-grid my-2 ">
      <Button variant='outline-primary' size="" className='d-flex justify-content-center align-items-center fs-5' onClick={onClick}>
        <RiAccountPinBoxFill className='mx-2' />
        
          Create Account 
        
      </Button>
    </div>
  );
}

export default RegisterLink;
