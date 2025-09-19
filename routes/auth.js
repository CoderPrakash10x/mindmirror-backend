const express = require('express');
const { register, login } = require('../controllers/authController');
const validateRegister = require('../middleware/validateRegister');

const router = express.Router();

// Routes
router.post('/register', validateRegister, register);
router.post('/login', login);

module.exports = router;
        