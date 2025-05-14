import React, { useEffect, useState } from 'react';
  import { Card, Spinner, Alert } from 'react-bootstrap';


const Contact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/contactFrm/info`) // Adjust the endpoint path as needed
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch contact messages');
        return response.json();
      })
      .then(data => {
        setMessages(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
        setLoading(false);
      });
  }, []);

  return (
    // <div className='pb-5'>
    //   <h2>Contact Messages</h2>
    //   {loading ? (
    //     <p>Loading...</p>
    //   ) : messages.length === 0 ? (
    //     <p>No body contact or messages yet.</p>
    //   ) : (
    //     <ul>
    //       {messages.map((msg, index) => (
    //         <Card key={index} style={{ marginBottom: '1rem' }}>
    //           <strong>{msg.name}</strong> ({msg.email}) - <strong>Phone:</strong> {msg.phone} - <strong>Address:</strong> {msg.address }, {msg.city}, {msg.district}, {msg.PIN} - {msg.formSelect}
    //           <p><strong>Message:</strong>{msg.formMsg}</p>
    //           <small>{new Date(msg.createdAt).toLocaleString()}</small>
    //         </Card>
    //       ))}
    //     </ul>
    //   )}
    // </div>

  

<div className="pb-5">
  <h2 className="mb-4 text-primary">📨 Contact Messages</h2>

  {loading ? (
    <div className="text-center">
      <Spinner animation="border" variant="primary" />
      <p className="mt-2">Loading messages...</p>
    </div>
  ) : messages.length === 0 ? (
    <Alert variant="info">Nobody has contacted you yet.</Alert>
  ) : (
    <div className="d-flex flex-column gap-3">
      {messages.map((msg, index) => (
        <Card key={index} className="shadow-sm">
          <Card.Body>
            <Card.Title className="mb-2">
              {msg.name} <small className="text-muted">({msg.email})</small>
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              <strong>Phone:</strong> {msg.phone}
            </Card.Subtitle>

            <Card.Text className="mb-1">
              <strong>Address:</strong> {msg.address}, {msg.city}, {msg.district}, {msg.PIN}
            </Card.Text>

            <Card.Text className="mb-2">
              <strong>Inquiry Type:</strong> {msg.formSelect}
            </Card.Text>

            <Card.Text>
              <strong>Message:</strong> <br />
              {msg.formMsg}
            </Card.Text>

            <Card.Footer className="text-end text-muted bg-transparent border-0">
              {new Date(msg.createdAt).toLocaleString()}
            </Card.Footer>
          </Card.Body>
        </Card>
      ))}
    </div>
  )}
</div>

  )
}

export default Contact