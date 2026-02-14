require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./connect");
const qrRoutes = require('./Routes/qrCodes');
const authRoutes = require('./Routes/authRoutes');

const app = express();
const PORT = 3000;

// 2. Connect to Database
connectDB();

// 3. Middleware & Routes
app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(qrRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});