const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// GET /api/users  (Admin only)
const getUsers = async (req, res) => {
    const users = await User.find({}).select('_id name email isAdmin role createdAt'); 

    res.json(users);
};

// // PUT /api/users/:userId/role  (Admin only)
// // Body: { isAdmin: boolean }
// const updateUserRole = async (req, res) => {
//     const { userId } = req.params;
//     const { isAdmin } = req.body;
//     try {
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Map boolean to role string used by the model
//         user.role = isAdmin ? 'Admin' : 'User';
//         const updated = await user.save();
//         const { password, ...safe } = updated.toObject();
//         res.json(safe);
//     } catch (err) {
//         res.status(500).json({ message: 'Failed to update user role' });
//     }
//  
// };

// // DELETE /api/users/:userId  (Admin only)
// const deleteUser = async (req, res) => {
//     const { userId } = req.params;
//     try {
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         await user.deleteOne();
//         res.json({ message: 'User removed' });
//     } catch (err) {
//         res.status(500).json({ message: 'Failed to delete user' });
//     }
// };

module.exports = { getUsers};



