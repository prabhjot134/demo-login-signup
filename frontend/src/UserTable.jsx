import React, { useState, useEffect, useRef } from 'react';
import { fetchUsersList } from './api';

function UserTable() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');        
    const [inputValue, setInputValue] = useState(''); 
    const timeRef = useState(null);


    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        console.log("Token being sent:", token);
        try {
        const { data } = await fetchUsersList(page, search);
        setUsers(data.users || []);
        setTotalPages(data.totalPages || 1);
    } catch (err) {
        console.error("Error fetching users:", err.response?.data || err.message);
    }
    };

    useEffect(() => { fetchUsers(); }, [page, search]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setInputValue(value);
        clearTimeout(timeRef.current);
        timeRef.current =
        setTimeout(() => {
            setSearch(value);   
            setPage(1);
        }, 1000);   
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <input
                type="text"
                placeholder="Filter by name or email..."
                value={inputValue}
                onChange={handleSearch}
                style={{ marginBottom: '12px', padding: '8px', width: '300px', fontSize: '14px' }}
            />
            <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ padding: '8px' }}>Full Name</th>
                        <th style={{ padding: '8px' }}>Email</th>
                        <th style={{ padding: '8px' }}>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u, i) => (
                        <tr key={i}>
                            <td style={{ padding: '8px' }}>{u.fullname}</td>
                            <td style={{ padding: '8px' }}>{u.email}</td>
                            <td style={{ padding: '8px' }}>{u.createdat}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ marginTop: '10px' }}>
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
                <span style={{ margin: '0 15px' }}>Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
        </div>
    );
}

export default UserTable;