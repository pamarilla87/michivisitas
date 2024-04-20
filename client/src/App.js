import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import FormPage from './FormPage';
import ConfirmationPage from './ConfirmationPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/form" element={<FormPage />} />
                <Route path="/confirmation" element={<ConfirmationPage />} />
            </Routes>
        </Router>
    );
}

export default App;
