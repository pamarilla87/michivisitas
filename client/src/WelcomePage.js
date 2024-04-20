import React from 'react';
import { useNavigate } from 'react-router-dom';

function WelcomePage() {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/form');  // assuming your form page is routed at '/form'
    };

    return (
        <div className="welcome-container">
            <h1>Welcome to MichiVisitas!</h1>
            <p>Click the button below to request a quote for our services.</p>
            <button onClick={handleNavigate}>Solicitud de Presupuesto</button>
        </div>
    );
}

export default WelcomePage;
