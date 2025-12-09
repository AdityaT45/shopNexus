const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { addToWishlist, getWishlist, removeFromWishlist } = require('../controllers/wishlistController');

router.route('/')
    .post(protect, addToWishlist)
    .get(protect, getWishlist);

router.route('/:productId')
    .delete(protect, removeFromWishlist);

module.exports = router;

