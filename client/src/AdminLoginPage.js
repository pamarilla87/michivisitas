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
                navigate('/success'); // Redirect to success page
            } else {
                alert('Login failed');
            }
        } catch (error) {
            alert('Login error: ' + error.message);
        }
    };

    return (
        <div>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default AdminLoginPage;
