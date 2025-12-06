const Category = require('../models/Category');

// CREATE CATEGORY
const createCategory = async (req, res) => {
    try {
        const { name, image, subcategories, isActive } = req.body;

        if (!name || !image) {
            return res.status(400).json({ message: 'Name and image are required.' });
        }

        // Check if category already exists
        const existingCategory = await Category.findOne({ name: name.trim() });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category with this name already exists.' });
        }

        const category = await Category.create({
            name: name.trim(),
            image,
            subcategories: subcategories || [],
            isActive: isActive !== undefined ? isActive : true
        });

        res.status(201).json({
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create category.' });
    }
};

// GET ALL CATEGORIES
const getCategories = async (req, res) => {
    try {
        const { activeOnly } = req.query;
        let filter = {};
        
        if (activeOnly === 'true') {
            filter.isActive = true;
        }

        const categories = await Category.find(filter).sort({ createdAt: -1 });
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch categories.' });
    }
};

// GET CATEGORY BY ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }
        
        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch category.' });
    }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
    try {
        const { name, image, subcategories, isActive } = req.body;
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        // Check if name is being changed and if new name already exists
        if (name && name.trim() !== category.name) {
            const existingCategory = await Category.findOne({ name: name.trim() });
            if (existingCategory) {
                return res.status(400).json({ message: 'Category with this name already exists.' });
            }
            category.name = name.trim();
        }

        if (image) category.image = image;
        if (subcategories !== undefined) category.subcategories = subcategories;
        if (isActive !== undefined) category.isActive = isActive;

        const updatedCategory = await category.save();

        res.json({
            message: 'Category updated successfully',
            category: updatedCategory
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update category.' });
    }
};

// DELETE CATEGORY
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete category.' });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};

