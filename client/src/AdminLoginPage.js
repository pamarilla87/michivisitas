import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });
            if (response.data.message === 'Logged in successfully') {
                localStorage.setItem('token', response.data.token); // Store the token
                navigate('/success'); // Redirect to success page
            } else {
                alert('Login failed');
            }
        } catch (error) {
            alert('Login error: ' + (error.response ? error.response.data.message : 'Network error'));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        handleLogin();
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default AdminLoginPage;
