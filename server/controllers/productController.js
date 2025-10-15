const Product=require('../models/Product')




const createProduct =async(req,res)=>{

    try {
    const { name,description,price,countInStock,category,image } = req.body;

    if (!name || !description || !price  || !category  || !image) {
        return res.status(400).json({ message: 'Please enter all fields.' });
    }

    // 2. Create the product document and save it to MongoDB
    const product= await Product.create({
        name,description,price,countInStock,category,image
    });
    // 3. Success response
        res.status(201).json(product);
}
catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create product.' });
    }
}

let getAllProducts= async(req,res)=>{
    try{
        const products  = await Product.find({});
        res.status(200).json(products);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch product.' });
    }
}

const updateProduct =async(req,res)=>{
    try {
        const productId = req.params.id;
        const updates = req.body;

        // 1. Find the product by ID
        const product = await Product.findById(productId);

        if (product) {
            // 2. Update all fields present in the request body
            // We use the || operator to keep the old value if the new value is not provided
            product.name = updates.name || product.name;
            product.price = updates.price || product.price;
            product.description = updates.description || product.description;
            product.countInStock = updates.countInStock || product.countInStock;
            product.category = updates.category || product.category;
            product.image = updates.image || product.image;

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

const deleteProduct=async(req,res)=>{
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
        const { keyword, category } = req.query; // Destructure query parameters
        
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

        // 4. Execute the dynamic query
        const products = await Product.find(filter); 
        
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch public products with filters.' });
    }
};

const getPublicProductDetails =async(req,res)=>{
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
module.exports={createProduct,getAllProducts,updateProduct,deleteProduct,getPublicProducts ,getPublicProductDetails}