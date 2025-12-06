const Banner = require('../models/Banner');

// CREATE BANNER
const createBanner = async (req, res) => {
    try {
        const { title, image, status, link } = req.body;

        const banner = await Banner.create({
            title,
            image,
            status,
            link
        });

        res.status(201).json({
            message: "Banner created successfully",
            banner
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// GET ALL BANNERS
const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ createdAt: -1 });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// GET PUBLIC (ONLY ACTIVE)
const getActiveBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ status: "Active" });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// UPDATE BANNER
const updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        res.json({
            message: "Banner updated successfully",
            banner
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// DELETE BANNER
const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);

        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        res.json({ message: "Banner deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createBanner,
    getBanners,
    getActiveBanners,
    updateBanner,
    deleteBanner
};
