import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './ConfirmationPage.css'; // Ensure to link the CSS for styling

function ConfirmationPage() {
    const location = useLocation();
    const { id } = location.state || { id: 'Unknown ID' };

    return (
        <div className="confirmation-container">
            <div className="confirmation-card">
                <h1>¡Recibimos tu solicitud!</h1>
                <p>Nos estaremos contactando al número que nos brindaste.</p>
                <p>Presupuesto #: {id}</p>
                <Link to="/form" className="new-request-link">Solicitar otro presupuesto</Link>
            </div>
        </div>
    );
}

export default ConfirmationPage;
