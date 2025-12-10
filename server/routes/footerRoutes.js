const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getAllFooterSections,
    getAllFooterSectionsAdmin,
    getFooterSectionById,
    createFooterSection,
    updateFooterSection,
    deleteFooterSection,
} = require('../controllers/footerController');

// Public route
router.get('/public', getAllFooterSections);

// Admin routes
router.get('/', protect, admin, getAllFooterSectionsAdmin);
router.get('/:id', protect, admin, getFooterSectionById);
router.post('/', protect, admin, createFooterSection);
router.put('/:id', protect, admin, updateFooterSection);
router.delete('/:id', protect, admin, deleteFooterSection);

module.exports = router;


