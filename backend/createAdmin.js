const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    const admin = new User({
      name: 'Admin User',
      email: 'admin@studybuddy.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@studybuddy.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();