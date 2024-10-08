import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.webp';
import { faSignOutAlt, faKey } from '@fortawesome/free-solid-svg-icons';
import { Container, Button, Modal, Row, Col, Form, Alert } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import './EmployeeDashboard.css';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ContextObj } from '../store/CRM_store';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { tickets, fetchTickets, formatDate, setTickets } = useContext(ContextObj);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isTicketDetailsModalOpen, setIsTicketDetailsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');

  const [status, setStatus] = useState(''); // To keep track of the selected status

  useEffect(() => {
    const token = sessionStorage.getItem("Authorization");
    if (!token) {
      navigate("/employee");
    } else {
      fetchTickets(token);
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("Authorization");
    sessionStorage.removeItem('username');
    navigate("/employee");
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handleCloseChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordChangeError('');
    setPasswordChangeSuccess('');
  };

  const handlePasswordChangeSubmit = async () => {
    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError('New passwords do not match.');
      return;
    }

    try {
      const token = sessionStorage.getItem("Authorization");
      const old_password = oldPassword;
      const new_password = newPassword;
      const response = await fetch('http://127.0.0.1:8000/users/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ old_password, new_password })
      });

      if (response.ok) {
        setPasswordChangeSuccess('Password changed successfully!');
        handleCloseChangePasswordModal();
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        const errorData = await response.json();
        if (errorData.old_password) {
          setPasswordChangeError(errorData.old_password[0]);
        } else if (errorData.new_password) {
          setPasswordChangeError(errorData.new_password[0]);
        } else {
          setPasswordChangeError('Failed to change password. Please try again.');
        }
      }
    } catch (error) {
      setPasswordChangeError('Failed to change password. Please try again.');
    }
  };

  const handleChatClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsTicketDetailsModalOpen(true);
    setStatus(ticket.status); // Set the current status of the ticket in state
  };

  const handleCloseTicketDetailsModal = () => {
    setIsTicketDetailsModalOpen(false);
    setSelectedTicket(null);
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
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const newComment = {
        text: newMessage,
        posted_by: sessionStorage.getItem('username'),
        created_at: new Date().toISOString(),
      };

      const updatedComments = [...selectedTicket.comments, newComment];
      const updatedSelectedTicket = { ...selectedTicket, comments: updatedComments };

      const updatedTickets = tickets.map(ticket =>
        ticket.id === selectedTicket.id ? updatedSelectedTicket : ticket
      );

      setTickets(updatedTickets);
      setSelectedTicket(updatedSelectedTicket);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  // Handle select change for status update
  const handleChange = (event) => {
    const selectedStatus = event.target.value;
    setStatus(selectedStatus);

    // Make an API call with the selected status
    if (selectedTicket) {
      fetchStatus(selectedStatus, selectedTicket.id);
    }
  };

  // Fetch API call when status is selected
  const fetchStatus = async (status, id) => {
    const token = sessionStorage.getItem("Authorization");

    try {
      const response = await fetch(`http://127.0.0.1:8000/tickets/update-status/${id}/`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ status }), 
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      console.log('Status updated:', data);

      // Update the selected ticket's status in the state
      const updatedTicket = { ...selectedTicket, status };
      setSelectedTicket(updatedTicket);

      // Update the tickets list
      const updatedTickets = tickets.map(ticket =>
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      );
      setTickets(updatedTickets);
    } catch (error) {
      console.error('Error:', error);
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
      {/* Header */}
      <header className="dashboard-header">
        <Container>
          <Row className="align-items-center">
            <Col md={1} xs={12}>
              <Link to={"/"}><img src={logo} height="50px" width="60px" alt="" /></Link>
            </Col>
            <Col md={3} xs={12} className="text-center text-md-start">
              <h4 className="mb-0">Welcome {sessionStorage.getItem('username')}</h4>
            </Col>
            <Col md={4} xs={12} className="text-center my-2 my-md-0">
              <Button variant="warning" className="mr-2" onClick={handleChangePassword}>
                <FontAwesomeIcon icon={faKey} /> Change Password
              </Button>
            </Col>
            <Col md={4} xs={12} className="text-end">
              <FaSignOutAlt className="logout-icon" onClick={handleLogout} />
            </Col>
          </Row>
        </Container>
      </header>

      <Container className="employee-list-container">
        {tickets.length === 0 ? (
          <Alert variant="danger" className='m-5 text-center'>No tickets assigned to you.</Alert>
        ) : (
          <>
                  <div className="filter-section">
        <label htmlFor="statusFilter" className="mr-2">Filter by Status: </label>
        <select id="statusFilter" value={statusFilter} onChange={handleStatusFilterChange} className="form-control w-25 d-inline-block">
          <option value="">All</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

          <Table responsive="md" striped bordered hover className="employee-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Status</th>
                <th>Customer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets(tickets).map((ticket, idx) => (
                <tr key={idx}>
                  <td>{ticket.id}</td>
                  <td>{ticket.subject}</td>
                  <td>{formatDate(ticket.created_at)}</td>
                  <td>{ticket.status}</td>
                  <td>{ticket.created_by}</td>
                  <td>
                    <div variant="info" className="btn btn-primary" onClick={() => handleChatClick(ticket)}>
                      Comments
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          </>
        )}
      </Container>

      {/* Ticket Details & Chat Modal */}
      {isTicketDetailsModalOpen && selectedTicket && (
        <Modal show={isTicketDetailsModalOpen} onHide={handleCloseTicketDetailsModal} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Ticket Details - {selectedTicket.subject}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                {/* Ticket Details */}
                <h5>Details</h5>
                <p>
                  <strong>Ticket ID:</strong> {selectedTicket.id}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(selectedTicket.created_at)}
                </p>
                <p>
                  <strong>Status:</strong> {selectedTicket.status}
                </p>
                <p>
                  <label htmlFor="status-select">Select Status:</label>
                  <select id="status-select" value={status} onChange={handleChange}>
                    <option value="">--Choose Status--</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </p>
              </Col>

              <Col md={6}>
                {/* Chat Section */}
                <h5>Chat with Customer</h5>
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

      {/* Change Password Modal */}
      <Modal show={isChangePasswordModalOpen} onHide={handleCloseChangePasswordModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {passwordChangeError && <Alert variant="danger">{passwordChangeError}</Alert>}
          {passwordChangeSuccess && <Alert variant="success">{passwordChangeSuccess}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" onClick={handlePasswordChangeSubmit}>
              Change Password
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EmployeeDashboard;
