import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faUser, faUserTie } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import CustomerDashboard from './customer/CustomerDashboard';
import EmployeeDashboard from './employee/EmployeeDashboard'
import AdminDashboard from './admin/AdminDashboard';

const App = () => {

  return (
    <>
      <div className="home-container">
        <div className="header">
          <h1>Welcome to the CRM System</h1>
          <p>Select your role to continue</p>
        </div>
        <div className="link-container">
          <Link to="/admin" className="link-box">
            <FontAwesomeIcon icon={faUserShield} size="3x" />
            <span>Admin</span>
          </Link>
          <Link to="/customer" className="link-box">
            <FontAwesomeIcon icon={faUser} size="3x" />
            <span>Customer</span>
          </Link>
          <Link to="/employee" className="link-box">
            <FontAwesomeIcon icon={faUserTie} size="3x" />
            <span>Employee</span>
          </Link>
        </div>
      </div>


      {/* <AdminDashboard />
      <CustomerDashboard />
      <EmployeeDashboard /> */}
    </>


  );
};

export default App;


