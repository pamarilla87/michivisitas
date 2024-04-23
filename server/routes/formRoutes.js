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

router.get('/status-count', async (req, res) => {
    const { estado } = req.query;
    try {
        const count = await Form.countDocuments({ estado: estado });
        res.json({ count });
    } catch (error) {
        console.error("Error retrieving pending count:", error);
        res.status(500).send({ message: 'Error retrieving pending count' });
    }
});

router.get('/query-by-status', async (req, res) => {
    const { estado } = req.query; // Retrieve status from query parameters

    // Optionally convert status to a number if it's supposed to be numeric
    const numericStatus = parseInt(estado, 10);
    const validEstados = [0, 1, 2, 3]; // Array of valid estados

    if (isNaN(numericStatus) || !validEstados.includes(numericStatus)) {
        return res.status(400).send({ message: 'Invalid status provided.' });
    }

    try {
        const forms = await Form.find({ estado: numericStatus });
        if (forms.length === 0) {
            return res.status(404).send({ message: 'No forms found with the specified status' });
        }
        res.status(200).send(forms);
    } catch (error) {
        console.error('Failed to retrieve forms:', error);
        res.status(500).send({ message: 'Failed to retrieve forms', error: error.message });
    }
});

router.get('/form-details/:id', async (req, res) => {
    try {
        const form = await Form.findById(req.params.id); // Use Mongoose's findById method
        if (!form) {
            return res.status(404).send({ message: 'Form not found' });
        }
        res.status(200).json(form);  // Respond with the form data if found
    } catch (error) {
        console.error('Error fetching form details:', error);
        res.status(500).send({ message: 'Error fetching form details', error: error.message });
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
            estado: 0 //0: nuevo, 1: pendiente, 2: confirmado, 3: rechazado
        });
        await newForm.save();
        console.log("Form saved successfully, Presupuesto Numero:", `PRES-${presupuestoNumero}`);
        res.status(201).send({ message: 'Form submitted successfully!', id: `PRES-${presupuestoNumero}` });
    } catch (error) {
        console.error("Error when submitting form:", error);
        res.status(500).send('Error when submitting form');
    }
});

router.post('/update-estado/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const validEstados = [0, 1, 2, 3];
        if (!validEstados.includes(estado)) {
            return res.status(400).send({ message: 'Invalid estado value.' });
        }
        const form = await Form.findByIdAndUpdate(id, { estado }, { new: true });
        if (!form) {
            return res.status(404).send({ message: 'Form not found' });
        }
        res.status(200).send(form);
    } catch (error) {
        console.error('Error updating form status:', error);
        res.status(500).send({ message: 'Failed to update form status', error: error.message });
    }
});

router.put('/update-form/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body; // This should include any of the fields you wish to update

    try {
        const updatedForm = await Form.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedForm) {
            return res.status(404).send({ message: 'Form not found' });
        }
        res.send(updatedForm);
    } catch (error) {
        res.status(500).send({ message: 'Error updating form', error: error.message });
    }
});


router.delete('/delete-form/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const form = await Form.findByIdAndDelete(id);

        if (!form) {
            return res.status(404).send({ message: 'Form not found' });
        }
        
        res.status(200).send({ message: 'Form deleted successfully' });
    } catch (error) {
        console.error('Error deleting form:', error);
        res.status(500).send({ message: 'Failed to delete form', error: error.message });
    }
});

export default router;