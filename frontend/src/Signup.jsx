import React, { useState } from 'react';

import { signupUser } from './api';

function Signup({onAuthSuccess}) {
    const [user, setUser] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    const handleInput = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const sendData = async (e) => {
    e.preventDefault();
    try {
        const { data } = await signupUser(user);
        localStorage.setItem('token', data.token); 
        localStorage.setItem('user', JSON.stringify(data.user));
        onAuthSuccess(data.user);
    } catch (err) {
        alert(err.response?.data?.error || "Registration failed");
    }
};

    return (
        <form onSubmit={sendData} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
            <h2>Sign Up</h2>
            <input name="fullName" placeholder="Full Name" onChange={handleInput} required />
            <input name="email" type="email" placeholder="Email" onChange={handleInput} required />
            <input name="password" type="password" placeholder="Password" onChange={handleInput} required />
            <button type="submit">Register</button>
        </form>
    );
}

export default Signup;