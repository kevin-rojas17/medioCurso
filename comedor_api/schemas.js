const mongoose = require('mongoose');

// Define el esquema para un nuevo comensal
const comedorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Exporta el modelo de comensal
const Comedor = mongoose.model('Comedor', comedorSchema);

module.exports = { Comedor };