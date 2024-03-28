require('dotenv').config();
const jwt = require('jsonwebtoken');

// Middleware to verify the JWT token in the Authorization header
const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).send({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.substring(7, authHeader.length); // Extract token from Bearer
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send({ error: 'Unauthorized: Token is invalid or expired' });
    }
    req.user = decoded; // Add decoded token to request
    next();
  });
};

module.exports = verifyAccessToken;
