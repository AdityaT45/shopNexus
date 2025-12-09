const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { getAttributesByCategory, upsertAttributes } = require('../controllers/attributeController');

const router = express.Router();

router.route('/:category').get(getAttributesByCategory);
router.route('/').post(protect, admin, upsertAttributes);

module.exports = router;

