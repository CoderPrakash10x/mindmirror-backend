// backend/models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  unique_id: { type: String, required: true, unique: true }, // ID Card No or Student ID
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'],default:'student'}
});

module.exports = mongoose.model('Student', studentSchema);
