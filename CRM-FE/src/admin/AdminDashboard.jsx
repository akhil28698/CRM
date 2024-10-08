import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.webp';
import { FaSignOutAlt } from 'react-icons/fa';
import EmployeeList from './EmployeeList';
import CustomerList from './CustomerList';
import './AdminDashboard.css'; // Custom styles for additional design
import { useNavigate } from 'react-router-dom';
import DelEmployee from './DelEmployee';

const AdminDashboard = ({ adminName, tickets, dummyChats, createEmployeeAPI }) => {

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("Authorization");
    if (!token) {
      navigate("/admin");
    }
  }, [navigate]);

  const [visibleList, setVisibleList] = useState("employees");

  const handleButtonClick = (listType) => {
    setVisibleList(listType);
  };


  const handleLogout = () => {
    sessionStorage.removeItem("Authorization");
    sessionStorage.removeItem('username');
    navigate("/admin");
  }

  // getting data of employee and customers 
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchEmployees();
      await fetchCustomers();
    };
    fetchData();
  }, []);


  const fetchEmployees = async () => {
    try {
      const token = sessionStorage.getItem('Authorization');
      const response = await fetch('http://127.0.0.1:8000/users/?type=employee', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEmployees(data); // Assuming the backend returns an object with an 'employees' array
      }
      if (response.status === 401) {
        // If unauthorized, remove session tokens and redirect to login
        sessionStorage.removeItem("Authorization");
        sessionStorage.removeItem("username");
        navigate("/admin");  // Redirect to login page (or any route you use for login)
      }

    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const token = sessionStorage.getItem('Authorization');
      const response = await fetch('http://127.0.0.1:8000/users/?type=customer', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCustomers(data); // Assuming the backend returns an object with a 'customers' array
      } if (response.status === 401) {
        // If unauthorized, remove session tokens and redirect to login
        sessionStorage.removeItem("Authorization");
        sessionStorage.removeItem("username");
        navigate("/admin");  // Redirect to login page (or any route you use for login)
      }

    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };


  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <Container>
          <Row className="align-items-center">
            <Col md={1} xs={12}>
              <Link to={"/"}><img src={logo} height="50px" width="60px" alt="" /></Link>
            </Col>
            <Col md={3} xs={12} className="text-center text-md-start">
              <h4 className="mb-0">Welcome, {sessionStorage.getItem('username')}</h4>
            </Col>
            <Col md={6} xs={12} className="text-center my-2 my-md-0">
              <Button variant="primary" className="mx-2" onClick={() => handleButtonClick('employees')}>
                Employees
              </Button>
              <Button variant="primary" className="mx-2" onClick={() => handleButtonClick('customers')}>
                Customers
              </Button>
              <Button variant="primary" className="mx-2" onClick={() => handleButtonClick('delEmployee')}>
                Previous Employees
              </Button>
            </Col>
            <Col md={2} xs={12} className="text-end">
              <FaSignOutAlt className="logout-icon" onClick={handleLogout} />
            </Col>
          </Row>
        </Container>
      </header>

      <div className="content">
        {visibleList === 'employees' && (
          <EmployeeList
            employees={employees}
          />
        )}
        {visibleList === 'customers' && <CustomerList customers={customers} />}
        {visibleList === 'delEmployee' && <DelEmployee employees={employees} />}
      </div>
    </div>
  );
};

export default AdminDashboard;
