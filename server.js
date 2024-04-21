import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB database connection established successfully");
}).catch(err => {
    console.error("MongoDB connection error. Please make sure MongoDB is running.", err);
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, {
    collection: 'michiusers'
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);

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
}, {
    timestamps: true,
    collection: 'presupuestos'
});

const Form = mongoose.model('Form', FormSchema);

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

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        console.log("No token provided");
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            console.log("Token verification failed:", err.message);
            return res.sendStatus(403);
        }
        console.log("Token verified successfully, user ID:", user.userId);
        req.user = user;
        next();
    });
};

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log("Username already taken");
            return res.status(409).send('Username already taken');
        }
        const user = new User({ username, password });
        await user.save();
        console.log("User registered successfully");
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log("Authentication failed, user not found");
            return res.status(401).send('Authentication failed');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ userId: user._id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '1h' });
            console.log("Logged in successfully, token issued");
            res.json({ message: 'Logged in successfully', token });
        } else {
            console.log("Authentication failed, wrong password");
            res.status(401).send('Authentication failed');
        }
    } catch (error) {
        console.error("Error during authentication:", error);
        res.status(500).send('Error during authentication');
    }
});

app.post('/submit-form', async (req, res) => {
    const { error } = formValidationSchema.validate(req.body);
    if (error) {
        console.log("Validation error:", error.details[0].message);
        return res.status(400).send({ message: error.details[0].message });
    }
    try {
        const newForm = new Form(req.body);
        await newForm.save();
        console.log("Form saved successfully, ID:", newForm._id);
        res.status(201).send({ message: 'Form submitted successfully!', id: newForm._id });
    } catch (error) {
        console.error("Error when submitting form:", error);
        res.status(500).send('Error when submitting form');
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
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
