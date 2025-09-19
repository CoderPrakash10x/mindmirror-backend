// routes/ai.js
const express = require("express");
const OpenAI = require("openai").OpenAI;
const Chat = require("../models/chat");
const authMiddleware = require("../middleware/authMiddleware");
require("dotenv").config();

const router = express.Router();

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_API_KEY,
});

// POST /api/ai/chat
router.post("/chat", authMiddleware, async (req, res) => {
  const { message, conversationId } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const convId = conversationId || Date.now().toString();

    // Load existing convo messages (for context)
    const history = await Chat.find({
      userId: req.student_id,
      conversationId: convId,
    })
      .sort({ createdAt: 1 })
      .lean();

    const pastMessages = history.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Save user message
    await Chat.create({
      userId: req.student_id,
      conversationId: convId,
      role: "user",
      content: message,
    });

    // Call model (your existing config)
    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-120b:cerebras",
      messages: [
        {
          role: "system",
          content: `Tum ek supportive aur friendly AI ho jo Hindi me naturally baat karta hai.
Hindi ko English alphabets me likho (Hinglish), chhote 2-4 line ke jawab do. agar koi bhojpuri baat kare tho bhojpuri baat karo`,
        },
        ...pastMessages,
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content.trim();

    // Save assistant reply
    await Chat.create({
      userId: req.student_id,
      conversationId: convId,
      role: "assistant",
      content: reply,
    });

    // Fetch full conversation to send back
    const updated = await Chat.find({
      userId: req.student_id,
      conversationId: convId,
    })
      .sort({ createdAt: 1 })
      .lean();

    res.json({
      reply,
      conversationId: convId,
      messages: updated.map((m) => ({ role: m.role, content: m.content })),
    });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "AI service failed" });
  }
});

// GET /api/ai/history  => grouped by conversationId
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.student_id }).sort({ createdAt: 1 }).lean();
    const grouped = {};
    chats.forEach((c) => {
      if (!c.conversationId) c.conversationId = "unknown";
      if (!grouped[c.conversationId]) grouped[c.conversationId] = [];
      grouped[c.conversationId].push({ role: c.role, content: c.content, createdAt: c.createdAt });
    });
    res.json(grouped);
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// GET /api/ai/history/:conversationId => messages array (for Home)
router.get("/history/:conversationId", authMiddleware, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const chats = await Chat.find({ userId: req.student_id, conversationId })
      .sort({ createdAt: 1 })
      .lean();
    // return array of {role, content}
    res.json(chats.map((c) => ({ role: c.role, content: c.content, createdAt: c.createdAt })));
  } catch (err) {
    console.error("History conversation error:", err);
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
});

// DELETE /api/ai/history/:cid => delete that convo for user
router.delete("/history/:cid", authMiddleware, async (req, res) => {
  try {
    const { cid } = req.params;
    await Chat.deleteMany({ userId: req.student_id, conversationId: cid });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
