const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get token from header (it usually looks like "Bearer TOKEN_HERE")
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // This adds the user ID to the request object
        next(); // Move to the next function (the route logic)
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
};

module.exports = authMiddleware;