// server/models/Cart.js
const mongoose = require('mongoose');

const cartSchema = mongoose.Schema(
    {
        user: {
            // Links the cart to a specific user
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', 
            unique: true, // Crucial: Each user should only have ONE active cart
        },
        items: [
            {
                product: {
                    // Links the item to a specific product
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                    min: [1, 'Quantity must be at least 1'],
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;