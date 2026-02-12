const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Ensure the URI exists before trying to connect
        if (!process.env.ATLAS_URI) {
            throw new Error("ATLAS_URI is missing from .env file");
        }

        await mongoose.connect(process.env.ATLAS_URI);
        console.info("✅ Successfully connected to MongoDB Atlas");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1); // Stop the server if DB fails
    }
};

module.exports = connectDB;