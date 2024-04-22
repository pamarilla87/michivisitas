import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css'; // Ensure this path matches the location of your CSS file

function WelcomePage() {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/form');  // assuming your form page is routed at '/form'
    };

    return (
        <div className="welcome-container">
            <h1>Bienvenido a MichiVisitas!</h1>
            <button onClick={handleNavigate}>Solicitud de Presupuesto</button>
        </div>
    );
}

export default WelcomePage;
