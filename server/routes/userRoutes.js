const express=require('express')
const router=express.Router()

const { protect,admin,superAdmin } = require('../middleware/authMiddleware');


router.get('/profile', protect, (req, res) => {
    // If the 'protect' middleware passes, the user object is available at req.user
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        message: 'Successfully retrieved profile data via token.'
    });

})

// @access  Private/Admin only (requires both protect AND admin)
router.get('/admin', protect, admin, (req, res) => {
    res.json({
        message: 'Welcome, Admin! Access granted.',
        user: req.user.name,
        role: req.user.role
    });
});

module.exports = router;



// @access  Private/Admin only (requires both protect AND admin)
router.get('/superadmin', protect, superAdmin, (req, res) => {
    res.json({
        message: 'Welcome, Super Admin! Access granted.',
        user: req.user.name,
        role: req.user.role
    });
});

module.exports = router;