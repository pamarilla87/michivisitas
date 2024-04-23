import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './FormDetails.css'; // Import the CSS styles
import { calculateAdditionalData, formatDateToDDMMYYYY } from '../utils/utils'; // Import the formatDate function for date formatting

function FormDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [additionalData, setAdditionalData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); // State for handling errors

    useEffect(() => {
        const fetchFormDetails = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/form/form-details/${id}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                const additionalResults = calculateAdditionalData(data);
                if (additionalResults.error) {
                    setError(additionalResults.error);
                    setIsLoading(false);
                    return;
                }
                data.fechaDesde = formatDateToDDMMYYYY(data.fechaDesde);
                data.fechaHasta = formatDateToDDMMYYYY(data.fechaHasta);
                data.fechaCreacion = formatDateToDDMMYYYY(data.createdAt);
                setForm(data);
                setAdditionalData(additionalResults);
            } catch (error) {
                setError(error.message);
                console.error('Failed to fetch form details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFormDetails();
    }, [id]);

    const goBack = () => {
        navigate(-1);
    };

    const sendWhatsApp = () => {
        if (form && form.whatsapp) {
            const message = encodeURIComponent(`Hola ${form.nombre}, como estas? Te contacto desde Michivisitas por el presupuesto ${form.presupuestoNumero}`);
            window.open(`https://wa.me/549${form.whatsapp}?text=${message}`, '_blank');
        }
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!form) {
        return <p>No form details available.</p>;
    }

    return (
        <div className="form-details-container">
            {isLoading ? (
                <p>Loading...</p>
            ) : form ? (
                <div>
                    <h1>Detalles del Presupuesto</h1>
                    <div className="detail-item">
                        <label>Presupuesto ID:</label>
                        <div className="detail-value">{form.presupuestoNumero}</div>
                    </div>
                    <div className="detail-item">
                        <label>Nombre:</label>
                        <div className="detail-value">{form.nombre}</div>
                    </div>
                    <div className="detail-item">
                        <label>Desde:</label>
                        <div className="detail-value">{form.fechaDesde}</div>
                    </div>
                    <div className="detail-item">
                        <label>Hasta:</label>
                        <div className="detail-value">{form.fechaHasta}</div>
                    </div>
                    <div className="detail-item">
                        <label>Dirección:</label>
                        <div className="detail-value">{form.direccion}</div>
                    </div>
                    <div className="detail-item">
                        <label>Cantidad de michis:</label>
                        <div className="detail-value">{form.cantidadMichis}</div>
                    </div>
                    <div className="detail-item">
                        <label>Frecuencia de visitas:</label>
                        <div className="detail-value">{form.frecuenciaVisita}</div>
                    </div>
                    <div className="detail-item">
                        <label>Cantidad de visitas por día:</label>
                        <div className="detail-value">{form.visitasPorDia}</div>
                    </div>
                    <div className="detail-item">
                        <label>Duración de las visitas:</label>
                        <div className="detail-value">{form.tipoServicio}</div>
                    </div>
                    <div className="detail-item">
                        <label>Consideraciones especiales:</label>
                        <div className="detail-value">{form.consideracionesHorario}</div>
                    </div>
                    <div className="detail-item">
                        <label>Otros comentarios:</label>
                        <div className="detail-value">{form.otrosComentarios}</div>
                    </div>
                    <div className="detail-item">
                        <label>Fecha del Presupuesto:</label>
                        <div className="detail-value">{form.fechaCreacion}</div>
                    </div>
                    <div className="detail-item">
                        <label>WhatsApp:</label>
                        <div className="detail-value">{form.whatsapp}</div>
                    </div>

                    <h1>Información Adicional</h1>
                    <div className="detail-item">
                        <label>Total días:</label>
                        <div className="detail-value">{additionalData.totalDias}</div>
                    </div>
                    <div className="detail-item">
                        <label>Total visitas:</label>
                        <div className="detail-value">{additionalData.totalVisitas}</div>
                    </div>
                    <div className="detail-item">
                        <label>Total horas:</label>
                        <div className="detail-value">{additionalData.totalHoras}</div>
                    </div>
                    <div className="button-group">
                        <button onClick={goBack} className="volver-button">Volver</button>
                        <button onClick={sendWhatsApp} className="whatsapp-button">Enviar WhatsApp</button>
                    </div>
                </div>
            ) : (
                <p>No form details available.</p>
            )}
        </div>
    );
}

export default FormDetails;
