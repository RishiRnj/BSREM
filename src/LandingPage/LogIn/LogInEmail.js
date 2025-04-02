import React from 'react'
import { FaAt } from "react-icons/fa";
import { Button } from 'react-bootstrap';

function LogInEmail({ onClick }) {
    return (
        <div className="d-grid mb-2">

            <Button
                variant="outline-dark"
                onClick={onClick}
                className="d-flex align-items-center justify-content-center mb-2"

            > <FaAt className="me-2" />  Sign In with Email</Button>
        </div>
    );
}

export default LogInEmail