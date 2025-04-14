const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { verifyToken } = require('../utils/check_auth'); 

router.post('/register', authController.register);
router.post('/login', authController.login);
// routes/auth.js
router.get('/me', verifyToken, authController.getMe);


module.exports = router;
