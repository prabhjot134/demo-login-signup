
// const BASE_URL = 'http://localhost:5000';

// // Helper function to handle headers (adds Token if it exists)
// const getHeaders = () => {
//     const token = localStorage.getItem('token');
//     return {
//         'Content-Type': 'application/json',
//         ...(token ? { 'Authorization': `Bearer ${token}` } : {})
//     };
// };

// export const loginUser = async (credentials) => {
//     const response = await fetch(`${BASE_URL}/api/auth/login`, {
//         method: 'POST',
//         headers: getHeaders(),
//         body: JSON.stringify(credentials),
//     });
//     return response; 
// };

// export const signupUser = async (userData) => {
//     // Note: Adjusting URL to match your provided snippet (/signup vs /api/auth/signup)
//     const response = await fetch(`${BASE_URL}/api/auth/signup`, {
//         method: 'POST',
//         headers: getHeaders(),
//         body: JSON.stringify(userData),
//     });
//     return response;
// };

// export const fetchUsersList = async (page) => {
//     const response = await fetch(`${BASE_URL}/api/auth/users?page=${page}`, {
//         method: 'GET',
//         headers: getHeaders(),
//     });
//     return response;
// };


import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


export const loginUser = (credentials) => api.post('/api/auth/login', credentials);

export const signupUser = (userData) => api.post('/signup', userData);

export const fetchUsersList = (page, search = '') => 
    api.get(`/api/auth/users?page=${page}&search=${encodeURIComponent(search)}`);
export default api;