import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { Google } from 'react-bootstrap-icons';

function GoogleLoginButton({ onClick, loading }) {
  return (
    <div className="d-grid">
    <Button
      variant="outline-danger"
      onClick={onClick}
      className="d-flex align-items-center justify-content-center mb-2"
      disabled={loading}
    >
      {loading ? (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="me-2"
          />
          Loading...
        </>
      ) : (
        <>
          <Google className="me-2" /> Sign in with Google
        </>
      )}
    </Button>
    </div>
  );
}

export default GoogleLoginButton;
