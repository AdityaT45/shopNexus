const Attributes = require('../models/Attributes');

// GET /api/attributes/:category/:subcategory - fetch attributes for a subcategory
const getAttributesBySubcategory = async (req, res) => {
    try {
        const { category, subcategory } = req.params;
        if (!category || !subcategory) {
            return res.status(400).json({ message: 'Category and subcategory are required.' });
        }

        const record = await Attributes.findOne({ category, subcategory });
        if (!record) {
            return res.json({ category, subcategory, fields: [] });
        }

        res.json(record);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch attributes.' });
    }
};

// POST /api/attributes - create/update attributes for a subcategory
const upsertAttributes = async (req, res) => {
    try {
        const { category, subcategory, fields } = req.body;
        if (!category || !subcategory) {
            return res.status(400).json({ message: 'Category and subcategory are required.' });
        }

        const cleanFields = Array.isArray(fields)
            ? fields
                .map((f) => {
                    if (typeof f === 'string') {
                        return { name: f.trim(), type: 'string' };
                    }
                    if (f && f.name) {
                        return {
                            name: String(f.name || '').trim(),
                            type: f.type === 'number' ? 'number' : 'string',
                        };
                    }
                    return null;
                })
                .filter(Boolean)
            : [];

        const record = await Attributes.findOneAndUpdate(
            { category, subcategory },
            { $set: { fields: cleanFields } },
            { new: true, upsert: true }
        );

        res.status(201).json(record);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to save attributes.' });
    }
};

module.exports = { getAttributesBySubcategory, upsertAttributes };

