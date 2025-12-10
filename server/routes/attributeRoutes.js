const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { getAttributesBySubcategory, upsertAttributes } = require('../controllers/attributeController');

const router = express.Router();

router.route('/:category/:subcategory').get(getAttributesBySubcategory);
router.route('/').post(protect, admin, upsertAttributes);

module.exports = router;

