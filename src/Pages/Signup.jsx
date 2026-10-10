import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Signup() {
  const navigate = useNavigate();
  const [contact, setContact] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setContact((preValue) => ({ ...preValue, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (contact.password !== contact.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, contact.email, contact.password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        displayName: contact.name,
        email: contact.email,
        createdAt: new Date()
      });

      navigate('/login');
    } catch (error) {
      alert('Error signing up: ' + error.message);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="box signup-box">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name*</label>
            <input name="name" type="text" onChange={handleChange} value={contact.name} required />
          </div>
          <div className="form-group">
            <label>Email*</label>
            <input name="email" type="email" onChange={handleChange} value={contact.email} required />
          </div>
          <div className="form-group">
            <label>Password*</label>
            <input name="password" type="password" onChange={handleChange} value={contact.password} required />
          </div>
          <div className="form-group">
            <label>Confirm Password*</label>
            <input name="confirmPassword" type="password" onChange={handleChange} value={contact.confirmPassword} required />
          </div>
          <button type="submit" className="primary-btn">Sign Up</button>
        </form>
        <Link to="/login" className="switch-link">Already have an account? Login</Link>
      </div>
    </div>
  );
}

export default Signup;