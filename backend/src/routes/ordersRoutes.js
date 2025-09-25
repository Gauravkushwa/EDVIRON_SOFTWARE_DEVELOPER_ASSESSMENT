const express = require('express');
const ordersController = require('../controllers/ordersController');
const {authMiddleware} = require("../middlewares/authMiddleware");
const {authorizedRole} = require('../middlewares/authMiddleware')


const router = express.Router();
  

// User & School staff: Create order
router.post('/', authMiddleware, authorizedRole(['user', 'school_staff']), ordersController.createOrder);
// User, Staff, Admin: Get orders
router.get('/my-orders', authMiddleware, authorizedRole(['user', 'school_staff', 'admin']), ordersController.listOrders);
router.get('/:id', authMiddleware, authorizedRole(['user', 'school_staff', 'admin']), ordersController.getOrder);

module.exports = router;
