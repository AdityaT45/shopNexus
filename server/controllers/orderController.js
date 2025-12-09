// server/controllers/orderController.js
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create a new order from the user's cart

const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { shippingAddress } = req.body; // Assume client sends shipping address

        // 1. Fetch the user's cart, populated with product details
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cannot create order: Cart is empty.' });
        }

        let totalPrice = 0;
        const orderItems = [];
        
        // 2. Prepare Order Items and check final stock
        for (const item of cart.items) {
            const product = item.product; // The populated product document
            
            if (product.countInStock < item.quantity) {
                // Critical check: Stock changed since adding to cart
                return res.status(400).json({ message: `Insufficient stock for ${product.name}. Only ${product.countInStock} available.` });
            }

            // Capture item data for the order (including price at this moment)
            orderItems.push({
                name: product.name,
                quantity: item.quantity,
                price: product.price, 
                product: product._id,
            });

            totalPrice += product.price * item.quantity;
        }
        
        // 3. Create the new Order document
        const order = await Order.create({
            user: userId,
            orderItems,
            shippingAddress,
            totalPrice,
            // Status defaults to 'Pending'
        });

        // 4. Update Product Stock and Clear Cart (Transactional Step)
        for (const item of cart.items) {
            // Deduct stock
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { countInStock: -item.quantity } 
            });
        }
        // Clear the cart document
        await Cart.findOneAndDelete({ user: userId });

        // 5. Success response (201 Created)
        res.status(201).json(order);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create order.' });
    }
};

const getMyOrders = async(req,res)=>{
    try {
        const userId = req.user._id;

        // Find all orders placed by this user, sorted by creation date (newest first)
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user orders.' });
    }
};

// @desc    Get ALL orders (for Super Admin dashboard)
const getAllOrders = async (req, res) => {
    try {
        // Find ALL orders, sorted by newest first
        const orders = await Order.find({})
            .select('_id orderId user orderItems shippingAddress totalPrice status createdAt')
            .sort({ createdAt: -1 })
            .populate('user', 'name email userId'); // Populate user data
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch all orders.' });
    }
};

// @desc    Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body; // New status comes from the body

        // 1. Find the order
        const order = await Order.findById(orderId);

        if (order) {
            // 2. Check if the provided status is valid (defined in the schema enum)
            const validStatuses = Order.schema.path('status').enumValues;
            if (!validStatuses.includes(status)) {
                 return res.status(400).json({ message: `Invalid status provided. Must be one of: ${validStatuses.join(', ')}` });
            }
            
            // 3. Update the status and save
            order.status = status;
            const updatedOrder = await order.save();
            
            res.status(200).json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Failed to update order status.' });
    }
};

module.exports = { createOrder,getMyOrders,getAllOrders,updateOrderStatus };