import React from 'react';

function ForgotPasswordLink({ onClick }) {
    return (
        <div className="text-center py-1">
            Forgot Password? <span />
            <a href="#" onClick={onClick} className="text-decoration-none">
                Click to Reset!
            </a>
        </div>
    );
}

export default ForgotPasswordLink;
