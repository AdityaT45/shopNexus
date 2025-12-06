const express = require('express')
const router = express.Router()

const { protect, admin, superAdmin } = require('../middleware/authMiddleware');
const {
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
    getAllUsers,
    updateUserRole,
    deleteUser
} = require('../controllers/userController');

// ================= USER PROFILE ==================
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.delete('/profile', protect, deleteUserAccount);

// ================= SUPER ADMIN ==================
router.get('/superadmin', protect, superAdmin, (req, res) => {
    res.json({
        message: 'Welcome, Super Admin!',
        user: req.user.name,
        role: req.user.role
    });
});

// ================= ADMIN ==================
router.get('/admin', protect, admin, (req, res) => {
    res.json({
        message: 'Welcome, Admin!',
        user: req.user.name,
        role: req.user.role
    });
});

// Admin-only user list (keep after admin)
router.get('/', protect, admin, getAllUsers);
router.put('/:id/role', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser)

module.exports = router;
