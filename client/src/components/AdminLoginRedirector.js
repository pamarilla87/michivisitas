import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminLoginPage from './AdminLoginPage.js'; // Import the admin login page
import { useAuth } from '../context/AuthContext.js'; // Import the AuthProvider and useAuth hook

// Component to handle admin login redirection based on authentication status
export function AdminLoginRedirector() {
    const { isAuthenticated } = useAuth();

    // Redirect to dashboard if logged in, otherwise show admin login page
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <AdminLoginPage />;
}