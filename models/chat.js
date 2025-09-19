const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: String,
  conversationId: String, // ✅ new
  role: String,
  content: String,
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
