import React, { useState } from 'react';

import { loginUser } from './api';

function Login({onAuthSuccess}) {
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const handleInput = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const {data} = await loginUser(credentials);
                localStorage.setItem('token', data.token); 
                localStorage.setItem('user', JSON.stringify(data.user));
                
                onAuthSuccess(data.user); 
            
        } catch (err) {
            const message = err.response?.data?.error || "Login failed";
        alert(message);
        }
    };

    return (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
            <h2>Login</h2>
                <input name="email" type="email" placeholder="Email" onChange={handleInput} required />            
                <input name="password" type="password" placeholder="Password" onChange={handleInput} required />
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;