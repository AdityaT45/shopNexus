const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    createBanner,
    getBanners,
    getActiveBanners,
    updateBanner,
    deleteBanner
} = require('../controllers/bannerController');

// Admin Routes
router.post('/', protect, admin, createBanner);
router.get('/', protect, admin, getBanners);
router.put('/:id', protect, admin, updateBanner);
router.delete('/:id', protect, admin, deleteBanner);

// Public route for frontend carousel
router.get('/public/active', getActiveBanners);

module.exports = router;
