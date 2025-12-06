// server/models/Product.js
const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        countInStock: { // Represents the stock quantity
            type: Number,
            required: true,
            default: 0,
        },
        category: {
            type: String,
            required: true,
        },
        subcategory: {
            type: String,
            default: '',
        },
        images: { // Array of image URLs for product gallery
            type: [String],
            required: true,
            validate: {
                validator: function(v) {
                    return v && v.length > 0; // At least one image required
                },
                message: 'At least one image is required'
            }
        },
    },
    {
        timestamps: true,
    }
);

// Don't forget to export the model!
const Product = mongoose.model('Product', productSchema);

module.exports = Product;