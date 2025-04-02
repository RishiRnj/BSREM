import React from 'react';
import { Button } from 'react-bootstrap';
import { RiAccountPinBoxFill } from "react-icons/ri";

function RegisterLink({ onClick }) {
  return (
    <div className="d-grid my-2 ">
      <Button variant='outline-primary' size="lg" className='d-flex justify-content-center align-items-center' onClick={onClick}>
        Not Registered?{' '} <RiAccountPinBoxFill className='mx-2' />
        
          Create Account
        
      </Button>
    </div>
  );
}

export default RegisterLink;
