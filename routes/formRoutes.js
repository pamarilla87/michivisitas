import express from 'express';
import Joi from 'joi';
import { Form } from '../models/Form.js';
import { getNextSequence } from '../utils/utils.js';

const router = express.Router();

const formValidationSchema = Joi.object({
    nombre: Joi.string().required(),
    fechaDesde: Joi.date().required(),
    fechaHasta: Joi.date().required().min(Joi.ref('fechaDesde')),
    direccion: Joi.string().required(),
    cantidadMichis: Joi.number().min(1).max(6).required(),
    frecuenciaVisita: Joi.string().valid('Todos los días', 'Día por medio').required(),
    visitasPorDia: Joi.string().valid('1', '2', 'Otro').required(),
    otroVisitasPorDia: Joi.when('visitasPorDia', { is: 'Otro', then: Joi.required() }), 
    tipoServicio: Joi.number().valid(1, 1.5, 2, 3, 9).required(),
    consideracionesHorario: Joi.string().allow(''),
    otrosComentarios: Joi.string().allow(''),
    whatsapp: Joi.string().required()
});

router.get('/pending-count', async (req, res) => {
    try {
        const count = await Form.countDocuments({ pendiente: true });
        res.json({ count });
    } catch (error) {
        console.error("Error retrieving pending count:", error);
        res.status(500).send({ message: 'Error retrieving pending count' });
    }
});

router.post('/submit-form', async (req, res) => {
    const { error } = formValidationSchema.validate(req.body);
    if (error) {
        console.log("Validation error:", error.details[0].message);
        return res.status(400).send({ message: error.details[0].message });
    }
    try {
        const presupuestoNumero = await getNextSequence('presupuestoId');
        const newForm = new Form({
            ...req.body,
            presupuestoNumero: `PRES-${presupuestoNumero}`,
            pendiente: true  // Default to true on creation
        });
        await newForm.save();
        console.log("Form saved successfully, Presupuesto Numero:", `PRES-${presupuestoNumero}`);
        res.status(201).send({ message: 'Form submitted successfully!', id: `PRES-${presupuestoNumero}` });
    } catch (error) {
        console.error("Error when submitting form:", error);
        res.status(500).send('Error when submitting form');
    }
});

export default router;