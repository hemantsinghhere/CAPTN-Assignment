// Y script hai admin banane ke liye independetly run karni ho to

const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const admin = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'securepassword',
      role: 'admin', // Assign admin role
    });
    await admin.save();
    console.log('Admin user created');
    // process.exit();
  } catch (error) {
    console.error(error);
    // process.exit(1);
  }
};

createAdmin();
