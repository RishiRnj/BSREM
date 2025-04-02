import React from 'react';
import { Form } from 'react-bootstrap';
import { FaEyeSlash, FaEye } from 'react-icons/fa';

function PasswordInput({ value, onChange, showPassword, togglePasswordVisibility }) {
  return (
    <Form.Group controlId="password" className="mb-3">
      <Form.Label>Password</Form.Label>
      <div className="d-flex align-items-center border border-primary rounded">
        <Form.Control
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Enter your password"
          required
          value={value}
          onChange={onChange}
          style={{ flex: 1 }}
        />
        <span
          onClick={togglePasswordVisibility}
          style={{ cursor: 'pointer', padding: '0px 20px' }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
    </Form.Group>
  );
}

export default PasswordInput;
