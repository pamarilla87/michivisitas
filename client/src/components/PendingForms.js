import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './PendingForms.css';
import { formatDate } from '../utils/utils';

function PendingForms() {
    const [forms, setForms] = useState([]);
    const navigate = useNavigate();

    const fetchPendingForms = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/form/pending-forms');
            if (response.ok) {
                const { forms } = await response.json();
                const formattedForms = forms.map(form => ({
                    ...form,
                    fechaDesde: formatDate(form.fechaDesde),
                    fechaHasta: formatDate(form.fechaHasta),
                    fechaCreacion: formatDate(form.createdAt)
                }));
                setForms(formattedForms);
            } else {
                console.error('Failed to fetch pending forms');
            }
        } catch (error) {
            console.error('Error fetching pending forms:', error);
        }
    }, []);

    useEffect(() => {
        fetchPendingForms();
    }, [fetchPendingForms]);
/*
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
*/
    const goBack = () => {
        navigate('/dashboard');
    };

    const handleViewDetails = (id) => {
        navigate(`/form-details/${id}`);
    };

    return (
        <div className="pending-forms-container">
            <div className="button-group">
                <button onClick={goBack} className="volver-button">Volver</button>
                <button onClick={fetchPendingForms} className="refresh-button">Refresh</button>
            </div>
            <table className="pending-forms-table">
                <thead>
                    <tr>
                        <th>Presupuesto ID</th>
                        <th>Nombre</th>
                        <th>Fecha Desde</th>
                        <th>Fecha Hasta</th>
                        <th>Fecha del Presupuesto</th>
                        <th>WhatsApp</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {forms.map(form => (
                        <tr key={form._id}>
                            <td>{form.presupuestoNumero}</td>
                            <td>{form.nombre}</td>
                            <td>{form.fechaDesde}</td>
                            <td>{form.fechaHasta}</td>
                            <td>{form.fechaCreacion}</td>
                            <td>{form.whatsapp}</td>
                            <td>
                                <button onClick={() => handleViewDetails(form._id)} className="view-button">
                                    Ver
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PendingForms;
