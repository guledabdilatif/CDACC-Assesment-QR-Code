const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract "Bearer TOKEN"

    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Contains the { id: user._id } we signed earlier
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = verifyToken;