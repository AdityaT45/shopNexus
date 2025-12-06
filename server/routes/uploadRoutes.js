const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Set storage location
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/"); // folder to save uploaded images
    },
    filename(req, file, cb) {
        // Generate unique filename with timestamp
        cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`);
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed!'));
    }
};

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter
});

// ROUTE: /api/upload - Single file upload (for backward compatibility)
router.post("/", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Generate full URL
    const fullUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.json({
        imageUrl: fullUrl
    });
});

// ROUTE: /api/upload/multiple - Multiple files upload
router.post("/multiple", upload.array("images", 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    // Generate full URLs for all uploaded files
    const imageUrls = req.files.map(file => {
        return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    });

    res.json({
        imageUrls: imageUrls,
        message: `${req.files.length} file(s) uploaded successfully`
    });
});

module.exports = router;
