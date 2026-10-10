import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

function Login() {
  const navigate = useNavigate();
  const [contact, setContact] = useState({ email: '', password: '' });
  
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setContact((preValue) => ({ ...preValue, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    setErrorMsg('');

    if (contact.email.trim() === '' || contact.password.trim() === '') {
      setErrorMsg('Please fill in both your email and password.');
      return;
    }

    if (!contact.email.includes('@')) {
      setErrorMsg('Please enter a valid email address containing an @ symbol.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, contact.email, contact.password);
      navigate('/');
    } catch (error) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        setErrorMsg('Incorrect details or email not registered. Please try again or sign up for a free account.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMsg('The email format is invalid.');
      } else {
        setErrorMsg('Login failed: ' + error.message);
      }
    }
  };

  return (
    <div className="page-wrapper">
      <div className="box login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              name="email" 
              type="email" 
              onChange={handleChange} 
              value={contact.email} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              name="password" 
              type="password" 
              onChange={handleChange} 
              value={contact.password} 
              required 
            />
          </div>
          
          <button type="submit" className="primary-btn">Login</button>
          
          {/* Conditionally render the error message directly below the button */}
          {errorMsg && (
            <p style={{ color: 'red', fontSize: '14px', textAlign: 'center', marginTop: '15px' }}>
              {errorMsg}
            </p>
          )}

        </form>
        <Link to="/signup" className="switch-link">Don't have an account? Sign up</Link>
      </div>
    </div>
  );
}

export default Login;