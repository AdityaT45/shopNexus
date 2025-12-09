// server/routes/superAdminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, superAdmin } = require('../middleware/authMiddleware');
const {
    getSuperAdminDashboard,
    getAllAdmins,
    createAdmin,
    removeAdmin,
    getAllUsers,
    getAllOrders,
    getAllProducts
} = require('../controllers/superAdminController');

// All routes require Super Admin access
router.get('/dashboard', protect, superAdmin, getSuperAdminDashboard);
router.get('/admins', protect, superAdmin, getAllAdmins);
router.post('/admins', protect, superAdmin, createAdmin);
router.delete('/admins/:id', protect, superAdmin, removeAdmin);
router.get('/users', protect, superAdmin, getAllUsers);
router.get('/orders', protect, superAdmin, getAllOrders);
router.get('/products', protect, superAdmin, getAllProducts);

module.exports = router;

