const express = require("express");
const router = express.Router();
const ScreeningResult = require("../models/ScreeningResult");
const auth = require("../middleware/authMiddleware");
const getSuggestion = require("../utils/getSuggestion");

// Student submits screening
router.post("/submit", auth, async (req, res) => {
  try {
    const { phq9Answers, gad7Answers } = req.body;

    if (!Array.isArray(phq9Answers) || phq9Answers.length !== 9 ||
        !Array.isArray(gad7Answers) || gad7Answers.length !== 7) {
      return res.status(400).json({ error: "Invalid answers format" });
    }

    const phq9Score = phq9Answers.reduce((a, b) => a + b, 0);
    const gad7Score = gad7Answers.reduce((a, b) => a + b, 0);
    const suggestion = getSuggestion(phq9Score, gad7Score);
    const redFlag = phq9Score >= 20 || gad7Score >= 15;

    const result = await ScreeningResult.create({
      studentId: req.student_id,
      phq9Answers,
      gad7Answers,
      phq9Score,
      gad7Score,
      suggestion,
      redFlag
    });

    res.json(result);
  } catch (err) {
    console.error("Screening submit error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin — get only red flags
router.get("/redflags", auth, async (req, res) => {
  try {
    if (req.role !== "admin") return res.status(403).json({ message: "Forbidden" });

    const results = await ScreeningResult.find({ redFlag: true })
      .populate("studentId", "name unique_id");
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
