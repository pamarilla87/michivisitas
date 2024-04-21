import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import FormPage from './FormPage';
import ConfirmationPage from './ConfirmationPage';
import AdminLoginPage from './AdminLoginPage'; // Import the admin login page
import SuccessPage from './SuccessPage';

function ProtectedRoute({ children }) {
    const isAuthenticated = localStorage.getItem('token'); // Check if user is logged in

    if (!isAuthenticated) {
        // Redirect to the login page if not authenticated
        return <Navigate to="/admin-login" replace />;
    }

    return children;  // Render children components if authenticated
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/form" element={<FormPage />} />
                <Route path="/confirmation" element={<ConfirmationPage />} />
                <Route path="/admin-login" element={<AdminLoginPage />} />
                <Route path="/success" element={
                    <ProtectedRoute>
                        <SuccessPage />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
