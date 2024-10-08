import React, { useContext, useState, useEffect } from 'react';
import CreateTicketModal from './CreateTicketModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.webp';
import { faSignOutAlt, faComments } from '@fortawesome/free-solid-svg-icons';
import { ContextObj } from '../store/CRM_store';
import './CustomerDashboard.css';
import { Container, Button, Modal, Row, Col, Form, Table, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Chatbot from './SChatbot';
import SChatbot from './SChatbot';


const CustomerDashboard = () => {
  const navigate = useNavigate();
  const {
    tickets,
    setTickets,
    handleCloseModals,
    handleOpenCreateTicketModal,
    isCreateTicketModalOpen,
    formatDate,
    showPopup,
    fetchTickets
  } = useContext(ContextObj);

  const [isChatbotOpen, setChatbotOpen] = useState(false); // State for chatbot visibility
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isTicketDetailsModalOpen, setTicketDetailsModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState(''); // State for chatbot answer

  useEffect(() => {
    const token = sessionStorage.getItem("Authorization");
    if (!token) {
      navigate("/customer");
    } else {
      fetchTickets(token);
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("Authorization");
    sessionStorage.removeItem('username');
    navigate("/customer");
  };

  const handleOpenTicketDetailsModal = (ticket) => {
    setSelectedTicket(ticket);
    setTicketDetailsModalOpen(true);
  };

  const handleCloseTicketDetailsModal = () => {
    setTicketDetailsModalOpen(false);
    setSelectedTicket(null); // Clear the chatbot answer when modal closes
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    const token = sessionStorage.getItem('Authorization');
    const messageData = {
      ticket_id: selectedTicket.id,
      text: newMessage,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/comments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const updatedMessage = { sender: 'customer', text: newMessage, posted_by: sessionStorage.getItem('username') };
      const updatedComments = [...selectedTicket.comments, updatedMessage];
      const updatedSelectedTicket = { ...selectedTicket, comments: updatedComments };
      const updatedTickets = tickets.map(ticket =>
        ticket.id === selectedTicket.id ? updatedSelectedTicket : ticket
      );

      setTickets(updatedTickets);
      setSelectedTicket(updatedSelectedTicket);
      setNewMessage(''); // Clear the input field
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } 
  };

    const [statusFilter, setStatusFilter] =  useState(null);
    // Handler for status filter change
    const handleStatusFilterChange = (e) => {
      setStatusFilter(e.target.value);
    };
  
    // Filter tickets by status
    const filteredTickets = (tickets) => {
      if (!statusFilter) return tickets; // If no filter is selected, return all tickets
      return tickets.filter(ticket => ticket.status.toLowerCase() === statusFilter.toLowerCase());
    };


  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <Container>
          <Row className="align-items-center">
            <Col md={1} xs={12}>
              <Link to={"/"}><img src={logo} height="50px" width="60px" alt="" /></Link>
            </Col>
            <Col md={3} xs={12} className="text-center text-md-start">
              <h4 className="dashboard-title">Welcome, {sessionStorage.getItem('username')}</h4>
            </Col>
            <Col md={4} xs={12} className="text-center my-2 my-md-0">
              <Button variant="primary" onClick={handleOpenCreateTicketModal}>
                Create New Ticket
              </Button>
            </Col>
            <Col md={4} xs={12} className="text-end">
              <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" onClick={handleLogout} />
            </Col>
          </Row>
        </Container>
      </header>

      {tickets.length === 0 ? (
        <Alert variant="danger" className='m-5 text-center'>You haven't raised a ticket yet!</Alert>
      ) : (
        <>
        

        <div className="container customer-list-container">
        <div className="filter-section">
        <label htmlFor="statusFilter" className="mr-2">Filter by Status: </label>
        <select id="statusFilter" value={statusFilter} onChange={handleStatusFilterChange} className="form-control w-25 d-inline-block">
          <option value="">All</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
          <Table responsive striped bordered hover className="mt-3 customer-table">
            <thead>
              <tr>
                <th>Ticket Id</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets(tickets).map((ticket, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td>{ticket.id}</td>
                    <td>{ticket.subject}</td>
                    <td>{formatDate(ticket.created_at)}</td>
                    <td>{ticket.status}</td>
                    <td>
                      <Button variant="primary" onClick={() => handleOpenTicketDetailsModal(ticket)}>
                        Comments
                      </Button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </div>
        </>
      )}

      {isCreateTicketModalOpen && <CreateTicketModal closeModal={handleCloseModals} />}

      {isTicketDetailsModalOpen && selectedTicket && (
        <Modal show={isTicketDetailsModalOpen} onHide={handleCloseTicketDetailsModal} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Ticket Details - {selectedTicket.subject}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <h5>Details</h5>
                <p><strong>Ticket ID:</strong> {selectedTicket.id}</p>
                <p><strong>Date:</strong> {formatDate(selectedTicket.created_at)}</p>
                <p><strong>Status:</strong> {selectedTicket.status}</p>
              </Col>

              <Col md={6}>
                <h5>Chat with Employee</h5>
                <div className="chat-box">
                  <div className="messages">
                    {selectedTicket.comments
                      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                      .map((msg, index) => {
                        const isUserMessage = msg.posted_by === sessionStorage.getItem('username');
                        return (
                          <div
                            key={index}
                            className={`message ${isUserMessage ? 'user-message' : 'other-message'}`}
                            style={{ textAlign: isUserMessage ? 'right' : 'left' }}
                          >
                            <strong>{isUserMessage ? 'You: ' : `${msg.posted_by}: `}</strong> {msg.text}
                          </div>
                        );
                      })}
                  </div>

                  <div className="chat-input">
                    <Form.Group className="chat-input-type">
                      <Form.Control
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                    </Form.Group>
                    <Button variant="primary" onClick={handleSendMessage}>
                      Send
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseTicketDetailsModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Chatbot Component */}
      <SChatbot />
    </div>
  );
};

export default CustomerDashboard;
