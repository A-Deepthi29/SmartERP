const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Read token from headers
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ success: false, error: "Access denied. Token missing from authorization payload headers." });
    }

    try {
        // Strip out 'Bearer ' if passed along with standard formatting
        const cleanToken = token.startsWith('Bearer ') ? token.slice(7, token.length).trim() : token;
        
        const verified = jwt.verify(cleanToken, process.env.JWT_SECRET);
        req.user = verified; // Appends { id: user_id } metadata variables securely to req object
        next();
    } catch (err) {
        res.status(400).json({ success: false, error: "Authentication failed. Session signature is invalid or expired." });
    }
};