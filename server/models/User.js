// server/models/User.js
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            unique: true,
            sparse: true
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // Crucial for login!
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ['User', 'Admin', 'Super Admin'], // Limits the possible values
            default: 'User',
        },
        photo: {
            type: String,
            default: ''
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other', ''],
            default: ''
        }
    },
    {
        timestamps: true, // Automatically manages createdAt and updatedAt
    }
);

// Generate custom userId before saving
userSchema.pre('save', async function (next) {
    if (!this.userId) {
        // Generate USER + timestamp + random number
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.userId = `USER${timestamp}${random}`;
    }
    next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;