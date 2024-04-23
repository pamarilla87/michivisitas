// src/components/NotFoundPage.js
import React from 'react';
import './NotFoundPage.css'; // Import the corresponding CSS file

function NotFoundPage() {
    return (
        <div className="not-found-container">
            <div className="not-found-card">
                <h1 className="not-found-title">404 - Page Not Found</h1>
                <p className="not-found-text">The page you are looking for does not exist.</p>
            </div>
        </div>
    );
}

export default NotFoundPage;
