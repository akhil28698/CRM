import React, { useContext, useState } from "react";
import './LoginPage.css';
import { Form } from 'react-bootstrap';
import { ContextObj } from "../store/CRM_store";
import { useNavigate } from "react-router-dom";

const CustomerLogin = () => {
  const navigate = useNavigate();
  const { toggleForm, isLogin } = useContext(ContextObj);

  // State for tracking errors
  const [loginErrors, setLoginErrors] = useState({});
  const [signupErrors, setSignupErrors] = useState({});

  const handleSignUpSubmitCustomer = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const role = "CUSTOMER";

    try {
      const response = await fetch('http://127.0.0.1:8000/users/signin/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, role })
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('Authorization', data.token);
        sessionStorage.setItem('username', data.username);
        navigate('/customer/dashboard');
      } else {
        const data = await response.json();
        // Set signup errors
        setSignupErrors(data);
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleLoginSubmitCustomer = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const role = "CUSTOMER";

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
        navigate('/customer/dashboard');
      } else {
        const data = await response.json();
        setLoginErrors(data);
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
        {isLogin ? (
          <>
            <h2>Customer Login</h2>
            <Form onSubmit={handleLoginSubmitCustomer}>
              <div className="input-box">
                <input type="email" required name="email" />
                <label>Email</label>
                {loginErrors.email && <p className="error-text">{loginErrors.email}</p>} {/* Display email error */}
              </div>
              <div className="input-box">
                <input type="password" required name="password" />
                <label>Password</label>
                {loginErrors.password && <p className="error-text">{loginErrors.password}</p>} {/* Display password error */}
              </div>
              <button type="submit" className="login-btn">Login</button>
            </Form>
            <p className="toggle-text">
              Don't have an account? <span onClick={toggleForm}>Sign up</span>
            </p>
          </>
        ) : (
          <>
            <h2>Customer Sign Up</h2>
            <Form onSubmit={handleSignUpSubmitCustomer}>
              <div className="input-box">
                <input type="text" required name="username" />
                <label>Username</label>
                {signupErrors.username && <p className="error-text">{signupErrors.username}</p>} {/* Display username error */}
              </div>
              <div className="input-box">
                <input type="email" required name="email" />
                <label>Email</label>
                {signupErrors.email && <p className="error-text">{signupErrors.email}</p>} {/* Display email error */}
              </div>
              <div className="input-box">
                <input type="password" required name="password" />
                <label>Password</label>
                {signupErrors.password && <p className="error-text">{signupErrors.password}</p>} {/* Display password error */}
              </div>
              <button type="submit" className="login-btn">Sign Up</button>
            </Form>
            <p className="toggle-text">
              Already have an account? <span onClick={toggleForm}>Login</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerLogin;
