// server/models/Order.js
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        orderId: {
            type: String,
            unique: true,
            sparse: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        orderItems: [
            {
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true }, // Price *at time of order*
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
            },
        ],
        shippingAddress: { // Simple placeholder for order details
            address: { type: String, required: true, default: 'N/A' },
            city: { type: String, required: true, default: 'N/A' },
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        status: {
            type: String,
            required: true,
            enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
);

// Generate custom orderId before saving
orderSchema.pre('save', async function(next) {
    if (!this.orderId) {
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.orderId = `ORD${timestamp}${random}`;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;