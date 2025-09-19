const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const ScreeningResult = require("../models/ScreeningResult");

// GET all screenings (if needed)
router.get("/screenings", authMiddleware, async (req, res) => {
  try {
    if (req.role !== "admin") return res.status(403).json({ message: "Forbidden" });

    const data = await ScreeningResult.find().populate("studentId", "name unique_id");
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET only red flags
router.get("/redflags", authMiddleware, async (req, res) => {
  try {
    if (req.role !== "admin") return res.status(403).json({ message: "Forbidden" });

    const data = await ScreeningResult.find({ redFlag: true })
      .populate("studentId", "name unique_id");
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
