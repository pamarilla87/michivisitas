import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FormPage.css'; // Make sure to create and import the corresponding CSS file

function FormPage() {
    const [formData, setFormData] = useState({
        nombre: '',
        fechaDesde: '',
        fechaHasta: '',
        direccion: '',
        cantidadMichis: '1',
        frecuenciaVisita: '',
        visitasPorDia: '',
        otroVisitasPorDia: '',
        tipoServicio: '',
        consideracionesHorario: '',
        otrosComentarios: '',
        whatsapp: ''
    });
    const navigate = useNavigate();

    const serviceOptions = {
        "Visitas de 1h": 1,
        "Visitas de 1:30hs": 1.5,
        "Visitas de 2hs": 2,
        "Visitas de 3hs": 3,
        "Visitas overnight (de 22 a 7 AM)": 9
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'radio' && name === 'tipoServicio') {
            setFormData({ ...formData, [name]: serviceOptions[value] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate dates
        if (new Date(formData.fechaDesde) > new Date(formData.fechaHasta)) {
            alert("La fecha 'Desde' debe ser menor o igual a la fecha 'Hasta'.");
            return; // Stop submission if the validation fails
        }

        try {
            const response = await axios.post('http://localhost:5000/api/form/submit-form', formData);
            // Pass the unique ID to the confirmation page via navigate state
            navigate('/confirmation', { state: { id: response.data.id } });
        } catch (error) {
            alert(`Failed to submit form: ${error.response ? error.response.data.message : error.message}`);
        }
    }


    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="form">
                <div className="questions">
                    <label>Nombre:</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
                </div>
                <div className="questions">
                    <label>¿En qué fechas necesitás que cuidemos a tu/s Michi/s?:</label>
                    <div className="input-group">
                        <label>Desde:</label>
                        <input type="date" name="fechaDesde" value={formData.fechaDesde} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <label>Hasta:</label>
                        <input type="date" name="fechaHasta" value={formData.fechaHasta} onChange={handleChange} />
                    </div>
                </div>

                <div className="questions">
                    <label>¿En dónde vivís? Por favor indicá intersección de calles y barrio:</label>
                    <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} />
                </div>
                <div className="questions">
                    <label>¿Cuántos Michis tenés?</label>
                    <select name="cantidadMichis" value={formData.cantidadMichis} onChange={handleChange}>
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group questions">
                    <label>¿Con qué frecuencia considerás apropiado que visitemos a tu/s Michi/s?</label>
                    <label><input type="radio" name="frecuenciaVisita" value="Todos los días" onChange={handleChange} checked={formData.frecuenciaVisita === "Todos los días"} /> Todos los días</label>
                    <label><input type="radio" name="frecuenciaVisita" value="Día por medio" onChange={handleChange} checked={formData.frecuenciaVisita === "Día por medio"} /> Día por medio</label>
                </div>
                <div className="input-group questions">
                    <label>¿Cuántas visitas te gustaría que reciba/n tu/s Michi/s por día?</label>
                    <label><input type="radio" name="visitasPorDia" value="1" onChange={handleChange} checked={formData.visitasPorDia === "1"} /> 1</label>
                    <label><input type="radio" name="visitasPorDia" value="2" onChange={handleChange} checked={formData.visitasPorDia === "2"} /> 2</label>
                </div>
                <div className="input-group questions">
                    <label>¿Qué tipo de Servicio te interesa?</label>
                    {Object.entries(serviceOptions).map(([label, value]) => (
                        <label key={value}>
                            <input type="radio" name="tipoServicio" value={label} onChange={handleChange} checked={formData.tipoServicio === value} />
                            {label}
                        </label>
                    ))}
                </div>

                <div className="questions">
                    <label>¿Contás con alguna consideración especial respecto del horario de las visitas? Contanos por qué motivo/s.</label>
                    <textarea name="consideracionesHorario" value={formData.consideracionesHorario} onChange={handleChange}></textarea>
                </div>
                <div className="questions">
                    <label>Otros comentarios que creas importantes para que tengamos en cuenta.</label>
                    <textarea name="otrosComentarios" value={formData.otrosComentarios} onChange={handleChange}></textarea>
                </div>
                <div className="questions">
                    <label>Dejanos tu número de Whatsapp para que podamos enviarte el presupuesto. ¡Gracias!</label>
                    <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
                </div>
                <button type="submit">Enviar Formulario</button>
            </form>
        </div>
    );
}

export default FormPage;
