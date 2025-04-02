import React from 'react'
import { TbDeviceMobileMessage } from "react-icons/tb";
import { Button } from 'react-bootstrap';

function LogInMobile({ onClick }) {
    return (
        <div className="d-grid mb-2">

            <Button
                variant="outline-secondary"
                onClick={onClick}
                className="d-flex align-items-center justify-content-center mb-2"

            > <TbDeviceMobileMessage className='me-2' />  Sign In with Phone No.</Button>
        </div>
    );
}

export default LogInMobile