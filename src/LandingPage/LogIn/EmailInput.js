import React from 'react';
import { Form } from 'react-bootstrap';

function EmailInput({ value, onChange }) {
  return (
    <Form.Group controlId="email" className="mb-3">
      <Form.Label>Email</Form.Label>
      <Form.Control 
        type="email" 
        placeholder="Enter your email" 
        name="email" 
        required 
        autoFocus 
        value={value} 
        onChange={onChange} 
      />
    </Form.Group>
  );
}

export default EmailInput;
