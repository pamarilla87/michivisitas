import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import FormPage from './components/FormPage';
import ConfirmationPage from './components/ConfirmationPage';
import AdminLoginPage from './components/AdminLoginPage'; // Import the admin login page
import UserDashboard from './components/UserDashboard.js';
import PendingForms from './components/PendingForms'; // Ensure this component is created and imported
import { AuthProvider } from './context/AuthContext.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import NotFoundPage from './components/NotFoundPage.js';
import FormDetails from './components/FormDetails.js';
import EditForm from './components/EditForm.js';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/form" element={<FormPage />} />
                    <Route path="/confirmation" element={<ConfirmationPage />} />
                    <Route path="/admin-login" element={<AdminLoginPage />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <UserDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/pending-forms" element={
                        <ProtectedRoute>
                            <PendingForms />
                        </ProtectedRoute>
                    } />
                    <Route path="/form-details/:id" element={
                        <ProtectedRoute>
                                <FormDetails />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFoundPage />} />
                    <Route path="/edit-form/:id" element={
                        <ProtectedRoute>
                            <EditForm />
                        </ProtectedRoute>
                    } />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
