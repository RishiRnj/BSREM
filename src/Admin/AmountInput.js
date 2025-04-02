import React from "react";
import { InputGroup, Form, Button } from "react-bootstrap";

const AmountInput = ({ 
    beneficiaryId, 
    amount, 
    isDisabled, 
    onAmountChange, 
    onAddAmount 
}) => {
    return (
        <InputGroup className="me-3">
            <Form.Control
                value={amount || ""}
                disabled={isDisabled}
                onChange={(e) => onAmountChange(beneficiaryId, e.target.value)}
                placeholder="Enter On-field Reference Note"
                aria-label="Enter On-field Reference Note"
                aria-describedby="basic-addon2"
                isInvalid={!amount && !isDisabled}
            />
            <Button
                disabled={isDisabled || !amount}
                variant="outline-secondary"
                id="button-addon2"
                onClick={() => onAddAmount(beneficiaryId, "expectedAmountOfMoney", amount)}
            >
                Add Expected Amount
            </Button>
            <Form.Control.Feedback type="invalid">
            Expected Amount must be entered!
            </Form.Control.Feedback>
        </InputGroup>
    );
};

export default AmountInput;
