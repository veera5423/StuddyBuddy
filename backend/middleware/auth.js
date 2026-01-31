const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminAuth = async (req, res, next) => {
  auth(req, res, async () => {
    try {
      const user = await User.findById(req.user.userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
      req.user = user; // Now req.user has full user object
      req.user.userId = user._id; // Add userId for consistency
      next();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
};

module.exports = { auth, adminAuth };