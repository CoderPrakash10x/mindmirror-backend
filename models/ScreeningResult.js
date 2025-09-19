const mongoose = require("mongoose");

const screeningResultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  phq9Answers: [Number],
  gad7Answers: [Number],
  phq9Score: Number,
  gad7Score: Number,
  suggestion: String,
  redFlag: Boolean,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ScreeningResult", screeningResultSchema);
