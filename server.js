import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Joi from 'joi';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => console.log("MongoDB database connection established successfully"));

// Mongoose schema definition
const FormSchema = new mongoose.Schema({
    nombre: String,
    fechaDesde: Date,
    fechaHasta: Date,
    direccion: String,
    cantidadMichis: Number,
    frecuenciaVisita: String,
    visitasPorDia: String,
    tipoServicio: Number,
    consideracionesHorario: String,
    otrosComentarios: String,
    whatsapp: String,
    presupuestoNumero: String
},
{
    timestamps: true,
    collection: 'presupuestos'
});

const Form = mongoose.model('Form', FormSchema);

// Joi validation schema
const formValidationSchema = Joi.object({
    nombre: Joi.string().required(),
    fechaDesde: Joi.date().required(),
    fechaHasta: Joi.date().required().min(Joi.ref('fechaDesde')),
    direccion: Joi.string().required(),
    cantidadMichis: Joi.number().min(1).max(6).required(),
    frecuenciaVisita: Joi.string().valid('Todos los días', 'Día por medio').required(),
    visitasPorDia: Joi.string().valid('1', '2', 'Otro').required(),
    otroVisitasPorDia: Joi.when('visitasPorDia', { is: 'Otro', then: Joi.required() }),  // Conditional requirement
    tipoServicio: Joi.number().valid(1, 1.5, 2, 3, 9).required(),
    consideracionesHorario: Joi.string().allow(''),
    otrosComentarios: Joi.string().allow(''),
    whatsapp: Joi.string().required()
});

// Validation middleware
const validateForm = (req, res, next) => {
    const { error } = formValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }
    next();
};

// Route to handle form submission
app.post('/submit-form', validateForm, async (req, res, next) => {
    try {
        const newForm = new Form(req.body);
        await newForm.save();
        res.status(201).send({ message: 'Form submitted successfully!', id: newForm._id });
    } catch (error) {
        next(error); // Pass to global error handler
    }
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log error stack for debugging
    res.status(500).send({
        error: {
            status: err.status || 500,
            message: err.message || 'Internal Server Error',
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

//TEST BRANCH