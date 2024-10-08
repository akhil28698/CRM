import React, { useState } from 'react';
import { Button, Collapse, Table, Container, Modal, Form, Pagination } from 'react-bootstrap';
import './EmployeeList.css'; // Custom styles

const EmployeeList = ({ employees }) => {
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    username: '',
    email: '',
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 4;

  // Filter employees where deleted is false
  const activeEmployees = employees.filter(employee => !employee.deleted);

  // Calculate the number of pages
  const totalPages = Math.ceil(activeEmployees.length / employeesPerPage);

  // Get current employees for the current page
  const currentEmployees = activeEmployees.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setGeneratedPassword(''); // Clear password
    setEmployeeEmail('');
    refreshwindow();// Clear email
  };
  const refreshwindow = () => {
    window.location.reload();
  }

  const handleShowCreateModal = () => setShowCreateModal(true);

  const handleEmployeeClick = (employee) => {
    setExpandedEmployee(expandedEmployee === employee ? null : employee);
  };

  const handleChatClick = (ticket) => {
    setSelectedTicket(ticket);
    setShowChatModal(true);
  };

  const handleCloseChatModal = () => {
    setShowChatModal(false);
    setSelectedTicket(null); // Reset selected ticket
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('Authorization');
    try {
      const response = await fetch('http://127.0.0.1:8000/users/add-employee/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(newEmployee),
      });

      const result = await response.json();

      if (response.ok) {
        setGeneratedPassword(result.password); // Assuming backend returns password
        setEmployeeEmail(newEmployee.email);
        setShowCreateModal(true); // Open modal
      } else {
        alert('Failed to create employee');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteEmployee = async (employee) => {
    const token = sessionStorage.getItem('Authorization');
    const id = employee.id;

    try {
      const response = await fetch(`http://127.0.0.1:8000/users/delete-user/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });

      if (response.ok) {
        alert("Employee archive successfully");
        window.location.reload(); // Refresh the page
      } else {
        alert('Failed to archive employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <Container className="employee-list-container">
      <h1 className="text-center">Employee Details</h1>
      <Button variant="success" className="mb-3" onClick={handleShowCreateModal}>
        Create Employee
      </Button>

      <Table responsive="md" striped bordered hover className="employee-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Username</th>
            <th>Email</th>
            <th>Date of Joining</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((employee, index) => (
            <React.Fragment key={index}>
              <tr>
                <td>{employee.id}</td>
                <td>{employee.username}</td>
                <td>{employee.email}</td>
                <td>{formatDate(employee.joined_date)}</td>
                <td>
                  <div>
                    <Button variant="primary" onClick={() => handleEmployeeClick(employee)}>
                      Tickets
                    </Button> &nbsp;
                    <div className='btn btn-danger' onClick={() => handleDeleteEmployee(employee)}>Archive</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan="6">
                  <Collapse in={expandedEmployee === employee}>
                    <div className="tickets-list">
                      {employee.assigned_tickets.length > 0 ? (
                        <Table responsive="md" striped bordered hover className="mt-3">
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
                            {employee.assigned_tickets.map((ticket, idx) => (
                              <tr key={idx}>
                                <td>{ticket.id}</td>
                                <td>{ticket.subject}</td>
                                <td>{formatDate(ticket.created_at)}</td>
                                <td>{ticket.status}</td>
                                <td>{ticket.created_by}</td>
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
                        <h4 className="text-center alert alert-danger">No Data</h4>
                      )}
                    </div>
                  </Collapse>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>

      {/* Pagination Controls */}
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

      {/* Create Employee Modal */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {generatedPassword ? (
            <div>
              <p>Employee created successfully!</p>
              <p>Email: {employeeEmail}</p>
              <p>Password: {generatedPassword}</p>
            </div>
          ) : (
            <Form onSubmit={handleCreateEmployee}>
              <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={newEmployee.username}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Button variant="primary" className="mt-3" type="submit">
                Create
              </Button>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Chat Modal */}
      <Modal show={showChatModal} onHide={handleCloseChatModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedTicket ? `Chat for Ticket: ${selectedTicket.subject}` : 'Chat'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="messages">
            {selectedTicket && selectedTicket.comments && selectedTicket.comments.length > 0 ? (
              selectedTicket.comments
                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                .map((comment) => {
                  const isEmployee = comment.posted_by === selectedTicket.assigned;
                  return (
                    <div
                      key={comment.id}
                      className={`message ${isEmployee ? 'employee-message' : 'customer-message'}`}
                      style={{ textAlign: isEmployee ? 'right' : 'left' }}
                    >
                      <strong>{isEmployee ? 'Employee: ' : 'Customer: '}</strong>
                      <span>{comment.text}</span>
                      <div className="timestamp">{new Date(comment.created_at).toLocaleString()}</div>
                    </div>
                  );
                })
            ) : (
              <div>No messages available.</div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseChatModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EmployeeList;
