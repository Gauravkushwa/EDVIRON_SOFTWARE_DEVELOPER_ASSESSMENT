const express = require('express');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const authRoutes = express.Router();


authRoutes.post('/register', authController.register );

authRoutes.post('/login', authController.login);

authRoutes.post('/refresh', authController.refresh);

authRoutes.post('/logout', authController.logout);


module.exports = authRoutes;