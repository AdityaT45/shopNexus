const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

// ================= PROFILE MANAGEMENT ==================

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const { name, email, photo, gender } = req.body;

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            res.status(400);
            throw new Error('Email already exists');
        }
        user.email = email;
    }

    if (name) user.name = name;
    if (photo !== undefined) user.photo = photo;
    if (gender !== undefined) user.gender = gender;

    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        photo: updatedUser.photo,
        gender: updatedUser.gender,
        message: 'Profile updated successfully'
    });
});

// Delete user account
const deleteUserAccount = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    await user.deleteOne();

    res.json({ message: 'Account deleted successfully' });
});

// ================= ADMIN FUNCTIONS ==================

const getAllUsers = asyncHandler(async (req, res) => {
    // Find all users and select the necessary, non-sensitive fields for the admin panel
    const users = await User.find({}).select('_id name email isAdmin role createdAt');

    res.json(users);
});

const updateUserRole = asyncHandler(async (req, res) => {
    const { role } = req.body;

    if (!role || !['User', 'Admin', 'Super Admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role value' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated successfully', user });
});

// DELETE USER (Admin Only)
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Optional: Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    await user.deleteOne();

    res.json({ message: 'User deleted successfully', userId: req.params.id });
});






module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
    getAllUsers,
    updateUserRole,
    deleteUser
};