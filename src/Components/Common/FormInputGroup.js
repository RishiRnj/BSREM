import React from 'react';
import { Col, InputGroup, Badge } from 'react-bootstrap';

const FormInputGroup = ({
  label,
  name,
  title,
  value,
  onChange,
  error,
  required = false,
  type = 'text',
  placeholder = '',
  md = 6,
}) => {
  return (
    <Col md={md} className="mb-2">
      <InputGroup>
        <InputGroup.Text style={{ fontWeight: 'bold' }}>
          {label}
        </InputGroup.Text>
        <input
          type={type}
          className="form-control"
          placeholder={placeholder || label}
          aria-label={label}
          aria-describedby={`basic-addon-${name}`}
          name={name}
          title={title}
          value={value}
          required={required}
          onChange={onChange}
        />
      </InputGroup>
      {error && (
        <div className="text-center mt-1">
          <Badge bg="danger">{error}</Badge>
        </div>
      )}
    </Col>
  );
};

export default FormInputGroup;
