import mongoose from 'mongoose';

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
    presupuestoNumero: String,
    estado: Number
}, {
    timestamps: true,
    collection: 'presupuestos'
});

export const Form = mongoose.model('Form', FormSchema);
