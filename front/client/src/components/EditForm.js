import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditForm.css';

function EditForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        fechaDesde: '',
        fechaHasta: '',
        direccion: '',
        cantidadMichis: '',
        frecuenciaVisita: '',
        visitasPorDia: '',
        tipoServicio: '',
        consideracionesHorario: '',
        otrosComentarios: '',
        whatsapp: ''
    });

    useEffect(() => {
        const fetchFormData = async () => {
            const response = await fetch(`http://localhost:5000/api/form/form-details/${id}`);
            if (response.ok) {
                const data = await response.json();
                setFormData({
                    ...data,
                    fechaDesde: data.fechaDesde.split('T')[0], // Formats the date to 'yyyy-MM-dd'
                    fechaHasta: data.fechaHasta.split('T')[0], // Formats the date to 'yyyy-MM-dd'
                    tipoServicio: data.tipoServicio.toString() // Ensure the type is consistent
                });
            } else {
                console.error('Failed to fetch form data');
            }
        };

        fetchFormData();
    }, [id]);

    const serviceOptions = {
        "1": "Visitas de 1h",
        "1.5": "Visitas de 1:30hs",
        "2": "Visitas de 2hs",
        "3": "Visitas de 3hs",
        "9": "Visitas overnight (de 22 a 7 AM)"
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch(`http://localhost:5000/api/form/update-form/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            navigate('/pending-forms'); // Navigate back to the pending forms page or to a success page
        } else {
            console.error('Failed to update form');
        }
    };

    const handleBack = () => {
        navigate('/pending-forms');
    };

    return (
        <form onSubmit={handleSubmit} className="edit-form">
            <h1>Edit Form Details</h1>
            <label>
                Nombre:
                <input type="text" name="nombre" value={formData.nombre || ''} onChange={handleChange} />
            </label>
            <label>
                Fecha Desde:
                <input type="date" name="fechaDesde" value={formData.fechaDesde || ''} onChange={handleChange} />
            </label>
            <label>
                Fecha Hasta:
                <input type="date" name="fechaHasta" value={formData.fechaHasta || ''} onChange={handleChange} />
            </label>
            <label>
                Dirección:
                <input type="text" name="direccion" value={formData.direccion || ''} onChange={handleChange} />
            </label>
            <label>
                Cantidad de Michis:
                <select name="cantidadMichis" value={formData.cantidadMichis} onChange={handleChange}>
                    {[1, 2, 3, 4, 5, 6].map(n => (
                        <option key={n} value={n}>{n}</option>
                    ))}
                </select>
            </label>
            <label>
                Frecuencia de Visitas:
                <select name="frecuenciaVisita" value={formData.frecuenciaVisita || ''} onChange={handleChange}>
                    <option value="Todos los días">Todos los días</option>
                    <option value="Día por medio">Día por medio</option>
                </select>
            </label>
            <label>
                Visitas por Día:
                <label><input type="radio" name="visitasPorDia" value="1" onChange={handleChange} checked={formData.visitasPorDia === "1"} /> 1</label>
                <label><input type="radio" name="visitasPorDia" value="2" onChange={handleChange} checked={formData.visitasPorDia === "2"} /> 2</label>
            </label>
            <label>
                Tipo de Servicio:
                {Object.entries(serviceOptions).map(([key, label]) => (
                    <label key={key}>
                        <input
                            type="radio"
                            name="tipoServicio"
                            value={key}
                            checked={formData.tipoServicio === key}
                            onChange={handleChange}
                        />
                        {label}
                    </label>
                ))}
            </label>
            <label>
                Consideraciones de Horario:
                <textarea name="consideracionesHorario" value={formData.consideracionesHorario || ''} onChange={handleChange}></textarea>
            </label>
            <label>
                Otros Comentarios:
                <textarea name="otrosComentarios" value={formData.otrosComentarios || ''} onChange={handleChange}></textarea>
            </label>
            <label>
                WhatsApp:
                <input type="text" name="whatsapp" value={formData.whatsapp || ''} onChange={handleChange} />
            </label>

           <div className="button-group">
                <button type="button" onClick={handleBack} className="volver-button">Volver</button>
                <button type="submit">Guardar Cambios</button>
            </div>
        </form>
    );
}

export default EditForm;
