require('dotenv').config(); 
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    let token =
        req.header("Authorization") ||
        req.params.token ||
        req.query.token ||
        req.body.token ||
        req.cookies?.accessToken;

    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        if (token.startsWith("Bearer ")) {
            token = token.split(" ")[1]; // ✅ "Bearer " हटाएं
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

module.exports = authenticateToken;
 