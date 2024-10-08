import React, { useContext } from "react";
import './LoginPage.css';
import { Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const role = "ADMIN";
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
        navigate('/admin/dashboard');
      }
      if (response.status == 404) {
        alert("User with these credentails not found");
      }
      if (response.status == 401) {
        alert("Invalid user credentials");
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="form-box">
        <h2>Admin Login</h2>
        <Form onSubmit={handleLoginSubmit}>
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

export default AdminLogin;
