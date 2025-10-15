const Cart = require('../models/Cart');
const Product = require('../models/Product'); // Needed for stock check


const addToCart=async(req,res)=>{
    try {
        const {productId,quantity}=req.body
        const userId =req.user.id

        // 1. Validate quantity and check if product exists and is in stock
        const product = await Product.findById(productId);
        if (!product || product.countInStock < quantity) {
            return res.status(400).json({ message: 'Invalid product or insufficient stock.' });
        }

        // 2. Find the user's cart (or create one if it doesn't exist)
        let cart = await Cart.findOne({ user: userId });




        if (!cart) {
            // Create a new cart for the user
            cart = await Cart.create({ user: userId, items: [{ product: productId, quantity }] });
        } else {
            // Cart exists: Check if item is already present
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (itemIndex > -1) {
                // Item found: Update quantity
                cart.items[itemIndex].quantity = quantity; 
            } else {
                // Item not found: Add new item
                cart.items.push({ product: productId, quantity });
            }
            await cart.save();
        }

        // 3. Success response
        res.status(200).json(cart);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add item to cart.' });        
    }
}


const getCart=async(req,res)=>{
    try {
        const userId = req.user._id;

        // Find the cart and populate the product details for each item
        const cart = await Cart.findOne({ user: userId })
                                .populate('items.product'); 

        if (!cart) {
            // Return an empty cart structure if none is found
            return res.status(200).json({ user: userId, items: [] });
        }

        res.status(200).json(cart);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch cart.' });
    }
}

const clearCart =async(req,res)=>{
    try {
        const userId = req.user._id;

        // Find the cart by user ID and delete the entire document
        const result = await Cart.findOneAndDelete({ user: userId }); 

        if (result) {
            // Successful deletion
            res.status(200).json({ message: 'Cart cleared successfully.' });
        } else {
            // No cart found to delete (still counts as successful clearing)
            res.status(200).json({ message: 'Cart was already empty.' });
        }

      
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to clear cart.' });
    }
}

const removeItemFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params; // Get product ID from URL parameter

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        // Pull the item out of the array where the product ID matches
        const updatedCart = await Cart.findOneAndUpdate(
            { user: userId },
            { $pull: { items: { product: productId } } }, // $pull operator removes elements matching the criteria
            { new: true } // Return the updated document
        ).populate('items.product');

        res.status(200).json(updatedCart);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to remove item from cart.' });
    }
};

module.exports={addToCart,getCart,clearCart,removeItemFromCart }