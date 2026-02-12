const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        if (!process.env.ATLAS_URI) {
            throw new Error("ATLAS_URI is missing from .env file");
        }
        await mongoose.connect(process.env.ATLAS_URI);
        console.info("✅ Successfully connected to MongoDB Atlas");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);

    }
};

module.exports = connectDB;