const mongoose = require('mongoose');
const readline = require('readline');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Adjust the path to your schema
require('dotenv').config(); // Ensure your DB URL is accessible

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function seedAdmin() {
    try {
        // 1. Connect to Database
        await mongoose.connect(process.env.ATLAS_URI);
        console.log("Connected to MongoDB...");

        console.log("\n--- Create Admin User ---");

        // 2. Prompt for inputs
        const name = await askQuestion("Enter Admin Name: ");
        const email = await askQuestion("Enter Admin Email: ");
        const password = await askQuestion("Enter Admin Password: ");

        // 3. Basic Validation
        if (!name || !email || !password) {
            console.error("Error: All fields are required.");
            process.exit(1);
        }

        // 4. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.error("Error: A user with this email already exists.");
            process.exit(1);
        }

        // 5. Hash Password & Save
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = new User({
            name,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();
        console.log("\n---------------------------");
        console.log("Admin successfully created!");
        console.log(`Email: ${email}`);
        console.log("---------------------------\n");

    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        mongoose.connection.close();
        rl.close();
    }
}

seedAdmin();