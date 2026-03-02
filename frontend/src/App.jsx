import React, { useState, useEffect } from 'react';
import Signup from './Signup';
import Login from './Login';
import UserTable from './UserTable';

function App() {

  const [isLoginView, setIsLoginView] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setLoggedInUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedInUser(null);
};

if (loggedInUser) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial' }}>
        <h1>Welcome, {loggedInUser.FullName}</h1>
        <div style={{ marginTop: '30px' }}>
          <h2>All Registered Users</h2>
          <UserTable />
        </div>

        <button 
          onClick={handleLogout} 
          style={{ marginTop: '30px', padding: '10px 20px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>User Management System</h1>
      <div>
        <button onClick={() => setIsLoginView(true)}>Go to Login</button>
        <button onClick={() => setIsLoginView(false)} style={{ marginLeft: '10px' }}> Signup</button>
      </div>
      <hr />
      <div style={{ marginTop: '20px' }}>
        {isLoginView ? 
          <Login onAuthSuccess={(user) => setLoggedInUser(user)} /> : 
        <Signup onAuthSuccess={(user) => setLoggedInUser(user)} />
        }
      </div>
    </div>
  );
}

export default App;