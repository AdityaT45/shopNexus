const express = require('express');
const router = express.Router();
const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const Category = require('../models/Category');
const { protect, admin } = require('../middleware/authMiddleware');

// Admin routes (protected)
router.post('/', protect, admin, createCategory);
router.get('/', protect, admin, getCategories); // Admin can see all (active and inactive)
// Public route - only active categories
router.get('/public', async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch categories.' });
    }
});
router.get('/:id', protect, admin, getCategoryById);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;

