// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Need the User model to fetch the user

const protect = async (req, res, next) => {
    let token;

    // 1. Check if the token exists in the header (must start with 'Bearer')
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Extract the token (e.g., 'Bearer abc...' -> 'abc...')
            token = req.headers.authorization.split(' ')[1];

            // 3. Verify the token using your JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Attach the user to the request object (excluding the password)
            req.user = await User.findById(decoded.id).select('-password');

            // 5. Move to the next middleware or controller
            next();
            
        } catch (error) {
            console.error(error);
            // 401: Unauthorized (token failed verification)
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        // 401: Unauthorized (token not found)
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };


const admin = (req, res, next) => {
    // This middleware assumes 'protect' has already run and attached req.user
    
    // Check if the user's role is Admin OR Super Admin
    if (req.user && (req.user.role === 'Admin' )) {
        // If the role is correct, proceed to the controller
        next();
    } else {
        // 403 Forbidden: User is authenticated but lacks necessary privileges
        res.status(403).json({ message: 'Not authorized as an admin.' });
    }
};

module.exports = { protect, admin }; // IMPORTANT: Export both functions!


const superAdmin = (req, res, next) => {
    // This middleware assumes 'protect' has already run and attached req.user
    
    // Check if the user's role is Super Admin
    if (req.user && (req.user.role === 'Super Admin' )) {
        // If the role is correct, proceed to the controller
        next();
    } else {
        // 403 Forbidden: User is authenticated but lacks necessary privileges
        res.status(403).json({ message: 'Not authorized as an super admin.' });
    }
};

module.exports = { protect, admin,superAdmin }; // IMPORTANT: Export both functions!