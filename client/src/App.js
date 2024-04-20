import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import FormPage from './FormPage';
import ConfirmationPage from './ConfirmationPage';
import AdminLoginPage from './AdminLoginPage'; // Import the admin login page
import SuccessPage from './SuccessPage';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/form" element={<FormPage />} />
                <Route path="/confirmation" element={<ConfirmationPage />} />
                <Route path="/admin-login" element={<AdminLoginPage />} />
                <Route path="/success" element={<SuccessPage />} />
            </Routes>
        </Router>
    );
}

export default App;
