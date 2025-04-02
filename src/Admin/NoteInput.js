import React from "react";
import { InputGroup, Form, Button } from "react-bootstrap";

const NoteInput = ({ 
    beneficiaryId, 
    note, 
    isDisabled, 
    onNoteChange, 
    onAddNote 
}) => {
    return (
        <InputGroup className="me-3">
            <Form.Control
                value={note || ""}
                disabled={isDisabled}
                onChange={(e) => onNoteChange(beneficiaryId, e.target.value)}
                placeholder="Enter On-field Reference Note"
                aria-label="Enter On-field Reference Note"
                aria-describedby="basic-addon2"
                isInvalid={!note && !isDisabled}
            />
            <Button
                disabled={isDisabled || !note}
                variant="outline-secondary"
                id="button-addon2"
                onClick={() => onAddNote(beneficiaryId, "noteByVerifier", note)}
            >
                Add Note
            </Button>
            <Form.Control.Feedback type="invalid">
                Note must be entered!
            </Form.Control.Feedback>
        </InputGroup>
    );
};

export default NoteInput;
