const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  url: { type: String, required: true },
  type: { type: String, required: true },
  image: { type: String, default: '/uploads/default.png' }, // default placeholder
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', resourceSchema);
