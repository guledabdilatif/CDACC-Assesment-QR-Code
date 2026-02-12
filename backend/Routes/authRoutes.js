const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let database = require('../connect');
let authRoutes = express.Router();
const ObjectId = require('mongodb').ObjectId;

const SALT_ROUNDS = 10;

// REGISTER USER
authRoutes.route('/register').post(async (req, res) => {
    let db = database.getDb();
    const { name, email, password } = req.body;

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    let result = await db.collection('users').insertOne({
        name,
        email,
        password: hashedPassword,
        dateJoined: new Date()
    });
    res.status(201).json(result);
});

// LOGIN USER
authRoutes.route('/login').post(async (req, res) => {
    try {
        let db = database.getDb();
        if (!db) {
            return res.status(503).json({ message: "Database is starting up, please try again." });
        }

        const { email, password } = req.body;
        const user = await db.collection('users').findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // Ensure JWT_SECRET is loaded
        if (!process.env.JWT_SECRET) {
            console.error("CRITICAL: JWT_SECRET is missing from .env");
            return res.status(500).json({ message: "Server configuration error" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: "Success", token, user: { name: user.name, email: user.email } });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Something went wrong on the server" });
    }
});

// GET ALL USERS
authRoutes.route('/users').get(async (req, res) => {
    let db = database.getDb();
    let data = await db.collection('users').find({}).project({ password: 0 }).toArray();
    res.json(data);
});

// GET CURRENT USER (Simulated via ID for Postman testing)
authRoutes.route('/users/:id').get(async (req, res) => {
    let db = database.getDb();
    let data = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) }, { projection: { password: 0 } });
    data ? res.json(data) : res.status(404).send("Not Found");
});

module.exports = authRoutes;