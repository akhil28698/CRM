import React, { useState } from 'react';
import './TicketDetails.css';

const TicketDetails = ({ ticket, closeModal }) => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    { user: 'Customer', message: 'Hello, how can I assist you today?' },
    { user: 'Employee', message: 'I am having trouble logging in.' }
  ]);

  const [status, setStatus] = useState(ticket.status); // State for ticket status

  const handleSendMessage = () => {
    if (message.trim()) {
      setChat([...chat, { user: 'Employee', message }]);
      setMessage('');
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const response = await fetch(`https://your-api-url.com/tickets/${ticketId}`, {
        method: 'PUT', // Using PUT method to update the resource
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }), // Sending the new status in the request body
      });

      if (!response.ok) {
        throw new Error(`Failed to update ticket status: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Ticket status updated:`, data); // Optionally, handle the response data
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };


  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    updateTicketStatus(ticket.ticketId, newStatus); // Call a function to update the status in parent component
  };

  return (
    <div className="ticket-details-modal">
      <div className="ticket-details-content">
        <button className="close-btn" onClick={closeModal}>✖</button>
        <h3>Ticket Details</h3>
        <div className="ticket-info">
          <p><strong>Subject:</strong> {ticket.subject}</p>
          <p><strong>Date:</strong> {ticket.created_at}</p>
          <div className="ticket-status">
            <strong>Status:</strong>
            <select value={status} onChange={handleStatusChange}>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
        <div className="chat-section">
          <h4>Chat History</h4>
          <div className="chat-messages">
            {chat.map((entry, index) => (
              <div key={index} className={`chat-message ${entry.user.toLowerCase()}`}>
                <strong>{entry.user}:</strong> {entry.message}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
