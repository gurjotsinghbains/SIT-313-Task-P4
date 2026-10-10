import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase'; 

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login'); 
    } catch (error) {
      alert('Error signing out: ' + error.message);
    }
  };

  return (
    <div className="navbar">
      <div>
        <Link to="/">DEV@Deakin</Link>
      </div>
      <div>
        <input type="text" placeholder="Search..." className="nav-search" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <Link to="/post">Post</Link>
        
        {/* Conditional rendering: If user exists, show email and Sign Out. Otherwise, show Login */}
        {user ? (
          <>
            <span style={{ color: 'white', fontSize: '14px' }}>
              Hi, {user.email}
            </span>
            <button 
              onClick={handleSignOut} 
              style={{ padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', border: 'none' }}
            >
              Sign out
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;