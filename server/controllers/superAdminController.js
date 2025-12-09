// server/controllers/superAdminController.js
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// @desc    Get Super Admin Dashboard Stats
// @route   GET /api/superadmin/dashboard
// @access  Private/Super Admin
const getSuperAdminDashboard = asyncHandler(async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'User' });
        const totalAdmins = await User.countDocuments({ role: 'Admin' });
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        // Revenue calculations
        const totalRevenue = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

        // Order status breakdown
        const orderStatusBreakdown = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        const statusMap = {};
        orderStatusBreakdown.forEach(item => {
            statusMap[item._id] = item.count;
        });

        // Recent orders (last 10)
        const recentOrders = await Order.find({})
            .populate('user', 'userId name email')
            .sort({ createdAt: -1 })
            .limit(10)
            .select('orderId totalPrice status createdAt user');

        // Top products by sales (products in orders)
        const topProducts = await Order.aggregate([
            { $unwind: '$orderItems' },
            {
                $group: {
                    _id: '$orderItems.product',
                    totalSold: { $sum: '$orderItems.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);

        // Populate product details
        const topProductsWithDetails = await Promise.all(
            topProducts.map(async (item) => {
                const product = await Product.findById(item._id).select('productId name images');
                return {
                    productId: product?.productId || item._id,
                    name: product?.name || 'Deleted Product',
                    image: product?.images?.[0] || '',
                    totalSold: item.totalSold,
                    totalRevenue: item.totalRevenue
                };
            })
        );

        // Revenue trends (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const revenueLast7Days = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const revenue7Days = revenueLast7Days.length > 0 ? revenueLast7Days[0].total : 0;

        // Revenue trends (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const revenueLast30Days = await Order.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const revenue30Days = revenueLast30Days.length > 0 ? revenueLast30Days[0].total : 0;

        // New users in last 7 days
        const newUsersLast7Days = await User.countDocuments({
            role: 'User',
            createdAt: { $gte: sevenDaysAgo }
        });

        // New users in last 30 days
        const newUsersLast30Days = await User.countDocuments({
            role: 'User',
            createdAt: { $gte: thirtyDaysAgo }
        });

        // Products out of stock
        const outOfStockProducts = await Product.countDocuments({ countInStock: 0 });

        // Low stock products (less than 10)
        const lowStockProducts = await Product.countDocuments({
            countInStock: { $gt: 0, $lt: 10 }
        });

        // Pending orders
        const pendingOrders = statusMap['Pending'] || 0;

        res.json({
            stats: {
                totalUsers,
                totalAdmins,
                totalProducts,
                totalOrders,
                totalRevenue: revenue,
                orderStatusBreakdown: statusMap,
                recentOrders,
                topProducts: topProductsWithDetails,
                revenueLast7Days: revenue7Days,
                revenueLast30Days: revenue30Days,
                newUsersLast7Days,
                newUsersLast30Days,
                outOfStockProducts,
                lowStockProducts,
                pendingOrders
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch dashboard data' });
    }
});

// @desc    Get All Admins
// @route   GET /api/superadmin/admins
// @access  Private/Super Admin
const getAllAdmins = asyncHandler(async (req, res) => {
    try {
        const admins = await User.find({ role: 'Admin' })
            .select('userId name email role createdAt photo')
            .sort({ createdAt: -1 });

        res.json(admins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch admins' });
    }
});

// @desc    Create Admin (Promote User to Admin)
// @route   POST /api/superadmin/admins
// @access  Private/Super Admin
const createAdmin = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Find user by userId or _id
        const user = await User.findOne({
            $or: [{ userId }, { _id: userId }]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'Super Admin') {
            return res.status(400).json({ message: 'Cannot change Super Admin role' });
        }

        if (user.role === 'Admin') {
            return res.status(400).json({ message: 'User is already an Admin' });
        }

        user.role = 'Admin';
        await user.save();

        res.json({
            message: 'User promoted to Admin successfully',
            user: {
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create admin' });
    }
});

// @desc    Remove Admin (Demote Admin to User)
// @route   DELETE /api/superadmin/admins/:id
// @access  Private/Super Admin
const removeAdmin = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        // Find admin by userId or _id
        const admin = await User.findOne({
            $or: [{ userId: id }, { _id: id }],
            role: 'Admin'
        });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        admin.role = 'User';
        await admin.save();

        res.json({
            message: 'Admin demoted to User successfully',
            user: {
                userId: admin.userId,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to remove admin' });
    }
});

// @desc    Get All Users (for Super Admin)
// @route   GET /api/superadmin/users
// @access  Private/Super Admin
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({ role: 'User' })
            .select('userId name email role createdAt photo')
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

// @desc    Get All Orders (for Super Admin)
// @route   GET /api/superadmin/orders
// @access  Private/Super Admin
const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'userId name email')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// @desc    Get All Products (for Super Admin)
// @route   GET /api/superadmin/products
// @access  Private/Super Admin
const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({})
            .select('productId name price category countInStock images createdAt')
            .sort({ createdAt: -1 });

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});

module.exports = {
    getSuperAdminDashboard,
    getAllAdmins,
    createAdmin,
    removeAdmin,
    getAllUsers,
    getAllOrders,
    getAllProducts
};

