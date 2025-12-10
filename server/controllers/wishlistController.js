const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Add product to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({ message: 'Product not found.' });
        }

        // Find or create wishlist
        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, items: [{ product: productId }] });
        } else {
            // Check if product already in wishlist
            const itemIndex = wishlist.items.findIndex(item => item.product.toString() === productId);
            if (itemIndex > -1) {
                return res.status(400).json({ message: 'Product already in wishlist.' });
            }
            wishlist.items.push({ product: productId });
            await wishlist.save();
        }

        const populatedWishlist = await Wishlist.findById(wishlist._id).populate('items.product');
        res.status(200).json(populatedWishlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add item to wishlist.' });
    }
};

// Get user's wishlist
const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;

        const wishlist = await Wishlist.findOne({ user: userId }).populate('items.product');

        if (!wishlist) {
            return res.status(200).json({ user: userId, items: [] });
        }

        res.status(200).json(wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch wishlist.' });
    }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found.' });
        }

        const updatedWishlist = await Wishlist.findOneAndUpdate(
            { user: userId },
            { $pull: { items: { product: productId } } },
            { new: true }
        ).populate('items.product');

        res.status(200).json(updatedWishlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to remove item from wishlist.' });
    }
};

module.exports = { addToWishlist, getWishlist, removeFromWishlist };


