import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './SuccessPage.css';  // Make sure the CSS file is correctly linked

function SuccessPage() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin-login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setUsername(decoded.username);
        } catch (error) {
            console.error('Invalid token:', error);
            localStorage.removeItem('token');
            navigate('/admin-login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/admin-login');
    };

    const handleViewPending = () => {
        navigate('/pending-forms');
    };

    return (
        <div className="success-container">
            <div className="success-card">
                <h1 className="success-title">Logged in successfully</h1>
                <p className="success-text">Welcome to the dashboard, {username || 'User'}!</p>
                <button className="success-button" onClick={handleViewPending}>Solicitudes pendientes</button>
                <button className="success-button" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default SuccessPage;
