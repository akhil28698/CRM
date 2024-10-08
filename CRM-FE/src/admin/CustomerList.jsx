import React, { useState } from 'react';
import { Button, Collapse, Table, Modal, Row, Col, Pagination, Alert } from 'react-bootstrap';
import './CustomerList.css'; // Custom styles for the customer list

const CustomerList = ({ customers }) => {
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isChatModalOpen, setChatModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(''); // State for status filter

  const customersPerPage = 4; // Number of customers to show per page

  // Pagination for customers
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(customers.length / customersPerPage);

  const handleTicketClick = (customer) => {
    setExpandedCustomer(expandedCustomer === customer ? null : customer);
  };

  const handleChatClick = (ticket) => {
    setSelectedTicket(ticket); // Set the selected ticket for the chat modal
    setChatModalOpen(true);    // Open the chat modal
  };

  const handleCloseChatModal = () => {
    setChatModalOpen(false);
    setSelectedTicket(null); // Clear selected ticket when closing modal
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

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
    <div className="container customer-list-container">
      <h1 className="text-center">Customer Details</h1>

      {/* Dropdown to filter tickets by status */}
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
            <th>Id</th>
            <th>Email</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((customer, index) => (
            <React.Fragment key={index}>
              <tr>
                <td>{customer.id}</td>
                <td>{customer.email}</td>
                <td>{customer.username}</td>
                <td>
                  <Button variant="primary" onClick={() => handleTicketClick(customer)}>
                    Tickets
                  </Button>
                </td>
              </tr>
              <tr>
                <td colSpan="4">
                  <Collapse in={expandedCustomer === customer}>
                    <div className="tickets-list">
                      {filteredTickets(customer.created_tickets).length > 0 ? (
                        <Table striped bordered hover className="mt-3">
                          <thead>
                            <tr>
                              <th>Ticket ID</th>
                              <th>Subject</th>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Assigned Employee</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredTickets(customer.created_tickets).map((ticket, idx) => (
                              <tr key={idx}>
                                <td>{ticket.id}</td>
                                <td>{ticket.subject}</td>
                                <td>{formatDate(ticket.created_at)}</td>
                                <td>{ticket.status}</td>
                                <td>{ticket.assigned ? ticket.assigned : 'Not Assigned'}</td>
                                <td>
                                  <Button variant="info" onClick={() => handleChatClick(ticket)}>
                                    Chat
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <Alert variant="danger" className="mt-3 text-center">
                          No Tickets Available
                        </Alert>
                      )}
                    </div>
                  </Collapse>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>

      {/* Pagination for Customer List */}
      <Pagination className="justify-content-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Chat Modal */}
      {isChatModalOpen && selectedTicket && (
        <Modal show={isChatModalOpen} onHide={handleCloseChatModal} centered size="md">
          <Modal.Header closeButton>
            <Modal.Title>Chat - {selectedTicket.subject}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={12}>
                {/* Chat Section */}
                <h5>Chat History</h5>
                <div className="chat-box">
                  <div className="messages">
                    {selectedTicket && selectedTicket.comments.length > 0 ? (
                      selectedTicket.comments
                        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) // Sort by date
                        .map((comment) => {
                          // Determine sender type
                          const isEmployee = comment.posted_by !== selectedTicket.created_by;

                          return (
                            <div
                              key={comment.id}
                              className={`message ${isEmployee ? 'employee-message' : 'customer-message'}`}
                              style={{ textAlign: isEmployee ? 'right' : 'left' }} // Aligning messages
                            >
                              <strong>{isEmployee ? 'Employee: ' : 'Customer: '}</strong>
                              <span>{comment.text}</span>
                              <div className="timestamp">{new Date(comment.created_at).toLocaleString()}</div> {/* Show timestamp */}
                            </div>
                          );
                        })
                    ) : (
                      <div>No messages available.</div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseChatModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};


export default CustomerList;