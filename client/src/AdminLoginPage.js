import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './adminLoginPage.css'; // Make sure to link to a CSS file for styling

function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            if (response.data.message === 'Logged in successfully') {
                localStorage.setItem('token', response.data.token);
                navigate('/success');
            } else {
                setError(response.data);
            }
        } catch (error) {
            setError('Combinación de usuario y contraseña inválidos');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleLogin();
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nombre de usuario" />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                    {error && <div className="error-message">{error}</div>}
                </form>
            </div>
        </div>
    );
}

export default AdminLoginPage;
