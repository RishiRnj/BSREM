import React, { useEffect, useState } from 'react';



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
    <div>
      <h2>Contact Messages</h2>
      {loading ? (
        <p>Loading...</p>
      ) : messages.length === 0 ? (
        <p>No body contact or messages yet.</p>
      ) : (
        <ul>
          {messages.map((msg, index) => (
            <li key={index} style={{ marginBottom: '1rem' }}>
              <strong>{msg.name}</strong> ({msg.email}) - <strong>Phone:</strong> {msg.phone} - <strong>Address:</strong> {msg.address }, {msg.city}, {msg.district}, {msg.PIN} - {msg.formSelect}
              <p><strong>Message:</strong>{msg.formMsg}</p>
              <small>{new Date(msg.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Contact