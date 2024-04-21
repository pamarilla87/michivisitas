import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Corrected import

function SuccessPage() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login page if no token is found
            navigate('/admin-login');
            return;
        }

        try {
            // Decode the token to get user information
            const decoded = jwtDecode(token); // Corrected function call
            setUsername(decoded.username);
        } catch (error) {
            // Handle error if token is invalid or expired
            console.error('Invalid token:', error);
            localStorage.removeItem('token'); // Remove the invalid token
            navigate('/admin-login'); // Redirect to login page
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token
        navigate('/admin-login'); // Redirect to the login page
    };

    return (
        <div>
            <h1>Logged in successfully</h1>
            <p>Welcome to the dashboard, {username || 'User'}!</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default SuccessPage;
