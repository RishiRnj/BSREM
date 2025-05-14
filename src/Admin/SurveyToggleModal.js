import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const SurveyToggleModal = ({ show, onHide, onSubmit }) => {
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = () => {
    if (!budget || !duration) return alert('Please fill all fields');
    onSubmit({ budget, duration });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Activate Survey</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Budget</Form.Label>
            <Form.Control type="number" value={budget} onChange={e => setBudget(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Duration (Days)</Form.Label>
            <Form.Control type="number" value={duration} onChange={e => setDuration(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SurveyToggleModal;
