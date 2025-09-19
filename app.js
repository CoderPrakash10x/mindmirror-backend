// backend/server.js
const express = require('express');
const path = require('path')
require('dotenv').config();
const cors = require('cors');
const aiRoutes = require("./routes/ai");
const adminRoutes = require("./routes/admin");
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resource');
const screeningRoute = require('./routes/screening');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Auth Routes (Register + Login)
app.use('/api/auth', authRoutes);
app.use("/api/ai", aiRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/screening', screeningRoute);
app.use("/api/admin", adminRoutes);
// Simple test route
app.get('/', (req, res) => {
  res.send('Mental Health Backend Running 🚀');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
