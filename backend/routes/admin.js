const express = require('express');
const User = require('../models/User');
const Subject = require('../models/Subject');
const Material = require('../models/Material');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify user
router.put('/users/:userId/verify', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: 'User verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const totalSubjects = await Subject.countDocuments();
    const totalMaterials = await Material.countDocuments();
    const totalDownloads = await Material.aggregate([{ $group: { _id: null, total: { $sum: '$downloads' } } }]);

    res.json({
      totalUsers,
      verifiedUsers,
      totalSubjects,
      totalMaterials,
      totalDownloads: totalDownloads[0]?.total || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:userId', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }

    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete subject
router.delete('/subjects/:subjectId', adminAuth, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Delete all materials in this subject
    await Material.deleteMany({ subject: req.params.subjectId });
    
    await Subject.findByIdAndDelete(req.params.subjectId);
    res.json({ message: 'Subject and its materials deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;