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
        image: { // For the public image URL
            type: String,
            required: true, 
            // In a real app, this would be Cloudinary ID or similar
        },
    },
    {
        timestamps: true,
    }
);

// Don't forget to export the model!
const Product = mongoose.model('Product', productSchema);

module.exports = Product;