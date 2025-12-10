const Footer = require('../models/Footer');

// GET /api/footer - get all footer sections
const getAllFooterSections = async (req, res) => {
    try {
        const sections = await Footer.find({ isActive: true }).sort({ order: 1 });
        res.status(200).json(sections);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch footer sections.' });
    }
};

// GET /api/footer/admin - get all footer sections (admin)
const getAllFooterSectionsAdmin = async (req, res) => {
    try {
        const sections = await Footer.find({}).sort({ order: 1 });
        res.status(200).json(sections);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch footer sections.' });
    }
};

// GET /api/footer/:id - get single footer section
const getFooterSectionById = async (req, res) => {
    try {
        const section = await Footer.findById(req.params.id);
        if (!section) {
            return res.status(404).json({ message: 'Footer section not found.' });
        }
        res.status(200).json(section);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch footer section.' });
    }
};

// POST /api/footer - create footer section
const createFooterSection = async (req, res) => {
    try {
        const { section, title, links, isActive, order } = req.body;
        
        if (!section || !title) {
            return res.status(400).json({ message: 'Section and title are required.' });
        }

        const footerSection = await Footer.create({
            section,
            title,
            links: links || [],
            isActive: isActive !== undefined ? isActive : true,
            order: order || 0,
        });

        res.status(201).json(footerSection);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Section already exists.' });
        }
        res.status(500).json({ message: 'Failed to create footer section.' });
    }
};

// PUT /api/footer/:id - update footer section
const updateFooterSection = async (req, res) => {
    try {
        const { section, title, links, isActive, order } = req.body;
        const sectionId = req.params.id;

        const footerSection = await Footer.findById(sectionId);
        if (!footerSection) {
            return res.status(404).json({ message: 'Footer section not found.' });
        }

        if (section) footerSection.section = section;
        if (title) footerSection.title = title;
        if (links !== undefined) footerSection.links = links;
        if (isActive !== undefined) footerSection.isActive = isActive;
        if (order !== undefined) footerSection.order = order;

        await footerSection.save();
        res.status(200).json(footerSection);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update footer section.' });
    }
};

// DELETE /api/footer/:id - delete footer section
const deleteFooterSection = async (req, res) => {
    try {
        const sectionId = req.params.id;
        const footerSection = await Footer.findByIdAndDelete(sectionId);
        
        if (!footerSection) {
            return res.status(404).json({ message: 'Footer section not found.' });
        }

        res.status(200).json({ message: 'Footer section deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete footer section.' });
    }
};

module.exports = {
    getAllFooterSections,
    getAllFooterSectionsAdmin,
    getFooterSectionById,
    createFooterSection,
    updateFooterSection,
    deleteFooterSection,
};


