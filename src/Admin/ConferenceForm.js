import React, { useState } from 'react';
import { Button, Card, Col, Form, FormGroup, InputGroup, Row } from 'react-bootstrap';


const ConferenceForm = () => {
    const [venue, setVenue] = useState('');
    const [place, setPlace] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        console.log("clicked");

        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/conference/create-conference`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // No Content-Type for FormData
            },
            body: JSON.stringify({ venue, place, date, time, description }),
        });
        const data = await response.json();
        alert(data.message);
    };

    return (
        <FormGroup >
            <Card className='p-3 m-3'>
                <h2 className='text-center'>Create/Update Conference</h2>
                <Row>
                    <Col sm>
                        <InputGroup className="mb-3" >
                            <InputGroup.Text>Venue</InputGroup.Text>
                            <Form.Control aria-label="Venue" type="text"
                                placeholder="Venue"
                                value={venue}
                                onChange={(e) => setVenue(e.target.value)}
                                required />



                        </InputGroup>
                    </Col>

                    <Col sm>

                        <InputGroup className="mb-3" >
                            <InputGroup.Text>Place</InputGroup.Text>
                            <Form.Control aria-label="Place" type="text"
                                placeholder="Place"
                                value={place}
                                onChange={(e) => setPlace(e.target.value)}
                                required />

                        </InputGroup>
                    </Col>
                </Row>

                <Row>
                    <Col sm>
                        <Col>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>Date</InputGroup.Text>
                                <Form.Control
                                    type="date"
                                    placeholder="Date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                    aria-label="Date"
                                />
                            
                                <InputGroup.Text>Time</InputGroup.Text>
                                <Form.Control
                                    type="time"
                                    placeholder="Time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                    aria-label="Time"
                                />
                            </InputGroup>

                        </Col>
                    </Col>



                    <Col sm>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Description</InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                aria-label="Description"
                            />
                        </InputGroup>

                    </Col>
                </Row>



               

                <Button type="submit" onClick={handleSubmit}>Submit</Button>

            </Card>
        </FormGroup>
    );
};

export default ConferenceForm;