import React from 'react';
import { Container, Table } from 'react-bootstrap';
import './DelEmployee.css'; // Custom styles

const DelEmployee = ({ employees }) => {

  // Function to format the date in a more readable way
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  // Filter out only the employees whose `deleted` field is true
  const deletedEmployees = employees.filter(employee => employee.deleted);

  return (
    <Container className="employee-list-container">
      <h1 className="text-center">Previous Employee Details</h1>

      {deletedEmployees.length > 0 ? (
        <Table responsive="md" striped bordered hover className="employee-table mt-4">
          <thead>
            <tr>
              <th>Id</th>
              <th>Username</th>
              <th>Email</th>
              <th>Date of Joining</th>
            </tr>
          </thead>
          <tbody>
            {deletedEmployees.map((employee, index) => (
              <tr key={index}>
                <td>{employee.id}</td>
                <td>{employee.username}</td>
                <td>{employee.email}</td>
                <td>{formatDate(employee.joined_date)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-center mt-5">No Previous employees found.</p>
      )}
    </Container>
  );
};

export default DelEmployee;
