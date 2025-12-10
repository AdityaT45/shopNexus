const mongoose = require('mongoose');

const attributesSchema = mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
            trim: true,
        },
        subcategory: {
            type: String,
            required: true,
            trim: true,
        },
        fields: [
            {
                name: {
                    type: String,
                    required: true,
                    trim: true,
                },
                type: {
                    type: String,
                    enum: ['string', 'number'],
                    default: 'string',
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure unique category+subcategory combination
attributesSchema.index({ category: 1, subcategory: 1 }, { unique: true });

const Attributes = mongoose.model('Attributes', attributesSchema);

module.exports = Attributes;

