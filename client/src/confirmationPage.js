import React from 'react';
import { useLocation, Link } from 'react-router-dom'; // Import useLocation to access the navigation state

function ConfirmationPage() {
    const location = useLocation(); // Access location object
    const { id } = location.state || { id: 'Unknown ID' }; // Safely retrieve the ID or set a default

    return (
        <div>
            <h1>Recibimos tu solicitud!</h1>
            <p>Nos vamos a estar contactando al celu que nos brindaste.</p>
            <p>Presupuesto #: {id}</p>
            <p>
                <Link to="/">Solicitar otro presupuesto</Link>
            </p>
        </div>
    );
}

export default ConfirmationPage;
