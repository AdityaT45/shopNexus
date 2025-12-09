const Product = require('../models/Product')
const Order = require('../models/Order')




const createProduct = async (req, res) => {

    try {
        const { name, description, price, countInStock, category, subcategory, images, image, attributes, originalPrice, discountPercentage } = req.body;

        // Handle both old format (single image) and new format (images array)
        let productImages = images;
        if (!productImages && image) {
            // Backward compatibility: if images array not provided but single image is, convert it
            productImages = [image];
        }

        if (!name || !description || !price || !category || !productImages || productImages.length === 0) {
            return res.status(400).json({ message: 'Please enter all fields. At least one image is required.' });
        }

        // Ensure images is an array
        if (!Array.isArray(productImages)) {
            productImages = [productImages];
        }

        // Calculate price if discount is provided
        let finalPrice = price;
        let finalDiscountPercentage = discountPercentage || 0;
        let finalOriginalPrice = originalPrice || price;

        if (originalPrice && discountPercentage) {
            finalPrice = originalPrice * (1 - discountPercentage / 100);
        } else if (originalPrice && originalPrice > price) {
            finalDiscountPercentage = ((originalPrice - price) / originalPrice) * 100;
            finalOriginalPrice = originalPrice;
        }

        // 2. Create the product document and save it to MongoDB
        const product = await Product.create({
            name,
            description,
            price: finalPrice,
            countInStock,
            category,
            subcategory: subcategory || '',
            images: productImages,
            attributes: attributes || {},
            originalPrice: finalOriginalPrice,
            discountPercentage: finalDiscountPercentage,
        });
        // 3. Success response
        res.status(201).json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create product.' });
    }
}

let getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}).select('_id productId name description price countInStock category subcategory images createdAt attributes originalPrice discountPercentage');
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch product.' });
    }
}

// @desc    Get Top Selling Products (aggregated from orders)
// @route   GET /api/products/top-selling
// @access  Public
const getTopSellingProducts = async (req, res) => {
    try {
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
            { $limit: 10 }
        ]);

        const withDetails = await Promise.all(
            topProducts.map(async (item) => {
                const product = await Product.findById(item._id).select('productId name images price category subcategory');
                if (!product) return null;
                return {
                    productId: product.productId || product._id,
                    name: product.name,
                    image: product.images?.[0] || '',
                    price: product.price,
                    category: product.category,
                    subcategory: product.subcategory,
                    totalSold: item.totalSold,
                    totalRevenue: item.totalRevenue
                };
            })
        );

        res.json(withDetails.filter(Boolean));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch top selling products.' });
    }
}


const getProductById = async (req, res) => {
    try {
        const productId = await Product.findById(req.params.id);

        if (!productId) {
            return res.status(404).json({ message: 'Product not found.' });

        }
        res.status(200).json(productId);

    } catch (error) {
        console.error(error);

        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID.' });
        }

        res.status(500).json({ message: 'Failed to fetch product details.' });
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const updates = req.body;

        // 1. Find the product by ID
        const product = await Product.findById(productId);

        if (product) {
            // 2. Update all fields present in the request body
            // We use the || operator to keep the old value if the new value is not provided
            product.name = updates.name || product.name;
            product.price = updates.price !== undefined ? updates.price : product.price;
            product.description = updates.description || product.description;
            product.countInStock = updates.countInStock !== undefined ? updates.countInStock : product.countInStock;
            product.category = updates.category || product.category;
            product.subcategory = updates.subcategory !== undefined ? updates.subcategory : product.subcategory;
            product.attributes = updates.attributes !== undefined ? updates.attributes : product.attributes;
            
            // Handle discount fields
            if (updates.originalPrice !== undefined) {
                product.originalPrice = updates.originalPrice;
            }
            if (updates.discountPercentage !== undefined) {
                product.discountPercentage = updates.discountPercentage;
                // Recalculate price if both originalPrice and discountPercentage are provided
                if (product.originalPrice && updates.discountPercentage > 0) {
                    product.price = product.originalPrice * (1 - updates.discountPercentage / 100);
                }
            } else if (updates.originalPrice !== undefined && updates.originalPrice > product.price) {
                // Calculate discount percentage if originalPrice is updated
                product.discountPercentage = ((updates.originalPrice - product.price) / updates.originalPrice) * 100;
            }

            // Handle images array update with backward compatibility
            if (updates.images !== undefined) {
                // New format: images array
                if (Array.isArray(updates.images) && updates.images.length > 0) {
                    product.images = updates.images;
                } else if (typeof updates.images === 'string' && updates.images.trim()) {
                    // Single string provided, convert to array
                    product.images = [updates.images];
                }
            } else if (updates.image) {
                // Backward compatibility: old format with single image field
                product.images = [updates.image];
            }
            // If neither images nor image is provided, keep existing images array

            // 3. Save the updated product back to the database
            const updatedProduct = await product.save();

            // 4. Send the updated document back
            res.status(200).json(updatedProduct);

        }
        else {
            // 404 Not Found - Product ID does not exist
            res.status(404).json({ message: 'Product not found.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update product.' });
    }

}

const deleteProduct = async (req, res) => {
    try {

        const productId = req.params.id;

        // 1. Find the product by ID and delete it
        const product = await Product.findByIdAndDelete(productId);
        if (product) {
            // 2. Success response: 200 OK with a confirmation message
            res.status(200).json({ message: 'Product removed successfully.' });
        } else {
            // 404 Not Found - Product ID does not exist
            res.status(404).json({ message: 'Product not found.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to deelete product.' });
    }

}


const getPublicProducts = async (req, res) => {
    try {
        const { keyword, category, subcategory } = req.query; // Destructure query parameters

        // 1. Start with the essential filter: in stock products only
        const filter = {
            countInStock: { $gt: 0 }
        };

        // 2. Add keyword search if provided
        if (keyword) {
            // Use MongoDB's $or for searching name OR description
            filter.$or = [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }

        // 3. Add category filter if provided
        if (category) {
            filter.category = category;
        }

        // 4. Add subcategory filter if provided
        if (subcategory) {
            filter.subcategory = subcategory;
        }

        // 5. Execute the dynamic query
        const products = await Product.find(filter);

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch public products with filters.' });
    }
};

const getPublicProductDetails = async (req, res) => {
    try {
        const productId = req.params.id;

        // 1. Find the product by ID
        const product = await Product.findById(productId);

        if (product && product.countInStock > 0) {
            // 2. Product found and is in stock
            res.status(200).json(product);
        } else if (product && product.countInStock === 0) {
            // 3. Product exists but is out of stock (specific message)
            res.status(404).json({ message: 'Product found, but currently out of stock.' });
        } else {
            // 4. Product ID not found
            res.status(404).json({ message: 'Product not found.' });
        }

    } catch (error) {
        console.error(error);
        // Catch invalid ID format 
        res.status(400).json({ message: 'Invalid product ID format.' });
    }
}
module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getPublicProducts, getPublicProductDetails, getTopSellingProducts }