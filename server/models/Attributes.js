const mongoose = require('mongoose');

const attributesSchema = mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        fields: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const Attributes = mongoose.model('Attributes', attributesSchema);

module.exports = Attributes;

