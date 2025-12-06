// server/models/User.js
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
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


const User = mongoose.model('User', userSchema);

module.exports = User;