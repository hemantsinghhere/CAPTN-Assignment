const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/token');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    const tokenRecord = await Token.findOne({ token });

    if (!user) {
      return res.status(401).json({ message: 'User not found. Please log in again.' });
    }

    if (!tokenRecord || tokenRecord.invalidated) {
      return res.status(403).json({ message: "Invalid Token" });
    }

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed. Please log in.' });
  }
};

module.exports = authMiddleware;
