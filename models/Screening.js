const mongoose = require("mongoose");

const screeningSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  phq9Score: Number,
  gad7Score: Number,
  suggestion: String,
  redFlag: Boolean,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Screening", screeningSchema);
