// server/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign(
        { id }, 
        process.env.JWT_SECRET, // Make sure this is in your .env
        { expiresIn: '30d' } 
    );
};

module.exports = generateToken;