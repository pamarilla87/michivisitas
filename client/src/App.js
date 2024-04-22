import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import FormPage from './components/FormPage';
import ConfirmationPage from './components/ConfirmationPage';
import AdminLoginPage from './components/AdminLoginPage'; // Import the admin login page
import SuccessPage from './components/SuccessPage';
import PendingForms from './components/PendingForms'; // Ensure this component is created and imported


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
                <Route path="/pending-forms" element={
                    <ProtectedRoute>
                        <PendingForms />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
