const jwt = require("jsonwebtoken")

function authenticateToken(req, res, next) {
    const token = req.headers['token'];
    if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
}

module.exports = {authenticateToken};