const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  patient_name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  },
  admission_date: {
    type: String,
    required: true
  },
  discharge_date: {
    type: String,
    required: true
  },
  treatment_type: {
    type: String,
    required: true
  },
  medication: {
    type: String,
    required: true
  },
  session_count: {
    type: Number,
    required: true
  },
  severity_level: {
    type: String,
    required: true
  },
  outcome: {
    type: String,
    required: true
  },
  doctor_description: {
    type: String,
    required: true
  },
  doctor_statement: {
    type: String,
    required: true
  }
}, {
  collection: 'patients',
  _id: false // Disable automatic _id generation since we're using custom _id
});

module.exports = mongoose.model('Patient', patientSchema);