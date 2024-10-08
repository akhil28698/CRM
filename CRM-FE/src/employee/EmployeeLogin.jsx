import React, { useContext } from "react";
import './LoginPage.css';
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const EmployeeLogin = () => {
  const navigate = useNavigate();
  const handleLoginEmployee = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const role = "EMPLOYEE";
    try {
      const response = await fetch('http://127.0.0.1:8000/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, role })
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('Authorization', data.token);
        sessionStorage.setItem('username', data.username);
        navigate('/employee/dashboard');
      }
      if (response.status == 404) {
        alert("User with these login credentails not found");
      }

      if (response.status == 401) {
        alert("User login credentails are not valid");
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="form-box">
        <h2>Employee Login</h2>
        <Form onSubmit={handleLoginEmployee}>
          <div className="input-box">
            <input type="email" required name="email" />
            <label>Email</label>
          </div>
          <div className="input-box">
            <input type="password" required name="password" />
            <label>Password</label>
          </div>
          <button type="submit" className="login-btn">Login</button>
        </Form>
      </div>
    </div>
  );
};

export default EmployeeLogin;
