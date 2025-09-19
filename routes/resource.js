const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Resource = require('../models/Resource');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// 📁 Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 📁 Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ====================== ROUTES ========================

// 📌 Get all resources (students + admins)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    console.error('GET /resources error:', err);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// 📌 Add resource (admin only)
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, url, type } = req.body;

    if (!title || !description || !url || !type) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newResource = new Resource({
      title,
      description,
      url,
      type,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    await newResource.save();
    res.status(201).json(newResource);
  } catch (err) {
    console.error('POST /resources error:', err);
    res.status(500).json({ error: 'Failed to add resource', details: err.message });
  }
});

// 📌 Update resource (admin only)
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      description: req.body.description,
      url: req.body.url,
      type: req.body.type
    };
    if (req.file) data.image = `/uploads/${req.file.filename}`;

    const updated = await Resource.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('PUT /resources error:', err);
    res.status(500).json({ error: 'Failed to update resource', details: err.message });
  }
});

// 📌 Delete resource (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('DELETE /resources error:', err);
    res.status(500).json({ error: 'Failed to delete resource', details: err.message });
  }
});

module.exports = router;
