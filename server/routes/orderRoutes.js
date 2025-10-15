// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { protect, superAdmin } = require('../middleware/authMiddleware');
const { createOrder ,getMyOrders,getAllOrders,updateOrderStatus} = require('../controllers/orderController');

router.route('/')
    .post(protect, createOrder)
    .get(protect,superAdmin,getAllOrders)

router.route('/myorder').get(protect,getMyOrders)

router.route('/:id/status')
    .put(protect,superAdmin,updateOrderStatus)

module.exports = router;