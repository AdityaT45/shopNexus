const Attributes = require('../models/Attributes');

// GET /api/attributes/:category - fetch attributes for a category
const getAttributesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        if (!category) {
            return res.status(400).json({ message: 'Category is required.' });
        }

        const record = await Attributes.findOne({ category });
        if (!record) {
            return res.json({ category, fields: [] });
        }

        res.json(record);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch attributes.' });
    }
};

// POST /api/attributes - create/update attributes for a category
const upsertAttributes = async (req, res) => {
    try {
        const { category, fields } = req.body;
        if (!category) {
            return res.status(400).json({ message: 'Category is required.' });
        }

        const cleanFields = Array.isArray(fields)
            ? fields.map((f) => String(f || '').trim()).filter(Boolean)
            : [];

        const record = await Attributes.findOneAndUpdate(
            { category },
            { $set: { fields: cleanFields } },
            { new: true, upsert: true }
        );

        res.status(201).json(record);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to save attributes.' });
    }
};

module.exports = { getAttributesByCategory, upsertAttributes };

