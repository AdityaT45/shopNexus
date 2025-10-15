// server/controllers/authController.js
const User = require('../models/User'); // Import the User model
const bcrypt = require('bcryptjs'); // Import bcrypt
const generateToken =require('../utils/generateToken')

// @access  Public
const registerUser = async (req, res) => {
 
    // 1. Destructure name, email, password from req.body
    const { name,email,password } = req.body;

    // 2. Simple check for all field
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields.' });
    }
    try{
        const userExists = await User.findOne({ email });


        if (userExists) {
            // Re   spond early if user exists
            return res.status(400).json({ message: 'User already exists.' });
        }

        // 3. Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    

        // 4. Create and save the user
        const user = await User.create({
            name,
            email,
            password: hashedPassword, // Store the HASHED password
            
        });

        if (user) {
            // Success! Respond with created user data
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                password:user.password,
                token: generateToken(user._id),
                message: 'Registration successful!'
            });
        } else {
            res.status(400).json({ message: 'Invalid user data.' });
        }
 
    }
    catch(error){
      console.error(error);
      res.status(500).json({message: 'Server error during registration process.'})
    }
};


const loginUser= async(req,res)=>{

    const { email,password } = req.body;


    // 1. Check if user exists
    const user = await User.findOne({ email });


    // 2. Check if user was found AND if password matches
     if (user && (await bcrypt.compare(password, user.password))) {
            
            // SUCCESS: Login is valid! (HTTP 200 OK)
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role, // Crucial for frontend logic
                token: generateToken(user._id), // Generate the JWT
            });
            
        } else {
        // 4. Failure: User not found or password didn't match
        res.status(401).json({ message: 'Invalid email or password.' }); 
    }
};
module.exports = { registerUser,loginUser  };