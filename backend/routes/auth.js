const express = require('express');
const router = express.Router();
const { register, login, updateProfile } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.patch('/profile', require('../middleware/auth').authenticate, updateProfile);

module.exports = router; 