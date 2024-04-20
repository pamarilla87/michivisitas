import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormPage from './formPage';
import ConfirmationPage from './confirmationPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<FormPage />} />
                <Route path="/confirmation" element={<ConfirmationPage />} />
            </Routes>
        </Router>
    );
}

export default App;
