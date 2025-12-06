// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { protect, superAdmin,admin } = require('../middleware/authMiddleware');
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');

router.route('/')
    .post(protect, createOrder)
    .get(protect, admin, getAllOrders)

router.route('/myorders').get(protect, getMyOrders)

router.route('/:id/status')
    .put(protect, admin, updateOrderStatus)

module.exports = router;