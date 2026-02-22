const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require("../middlewares/auth.middleware");
const SALT_ROUNDS = 10;



// 1. REGISTER: Create a new user (POST)
router.post('/register', verifyToken, async (req, res) => {
    try {
        if(req.user.role != "admin") return res.status(403).send();
        
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash password and save
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: "Error registering user", error });
    }
});

// 2. LOGIN: Authenticate user (POST)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: "Success",
            token,
            user: { name: user.name, email: user.email, role:user.role }
        });
    } catch (error) {
        res.status(500).json({ message: "Login error", error });
    }
});

// 3. READ: Get all users (GET)
router.get('/users', verifyToken, async (req, res) => {
    try {
        if(req.user.role != "admin") return res.status(403).send();

        const users = await User.find().select('-password'); // Exclude password from results
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});

// 4. READ: Get a single user by ID (GET)
router.get('/users/:id', verifyToken, async (req, res) => {
    try {
        if(req.user.role != "admin") return res.status(403).send();
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }
});
// 1. GET PROFILE (The /me route)
router.get('/me', verifyToken, async (req, res) => {
    try {
        // req.user.id comes from the decoded token in our middleware
        const user = await User.findById(req.user.id).select('-password');

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error });
    }
});

// 2. UPDATE PASSWORD
router.put('/users/:id', verifyToken, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const updateData = { name, email };

        // Only hash and update password if a value was actually sent
        if (password && password.trim() !== "") {
            // Check length requirement
            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters" });
            }
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true } // Returns the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully!", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating user", error });
    }
});

// DELETE USER
router.delete('/users/:id', verifyToken, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
});

// UPDATE USER (General Info)
router.put('/users/:id', verifyToken, async (req, res) => {
    try {
        const { name, email } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email },
            { new: true }
        ).select('-password');
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating user" });
    }
});

// update password 
router.post('/update-password', verifyToken, async (req, res) => {
    try {
        const { newPassword } = req.body;

        // 1. Validate input
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // 2. Check if user exists (Debug: log the user id found by verifyToken)
        console.log("Updating password for User ID:", req.user.id || req.user._id);

        const userId = req.user.id || req.user._id;
        if (!userId) {
            return res.status(401).json({ message: "User ID not found in token" });
        }

        // 3. Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 4. Update the user document
        const updatedUser = await User.findByIdAndUpdate(userId, {
            password: hashedPassword
        });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found in database" });
        }

        res.json({ message: "Password updated successfully!" });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

module.exports = router;