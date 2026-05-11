
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: '../.env' });

async function test() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');
    
    const user = await User.findOne();
    if (user) {
      console.log('Current username in DB:', user.username);
      const oldName = user.username;
      const newName = 'UpdateTest_' + Math.floor(Math.random() * 1000);
      user.username = newName;
      await user.save();
      console.log('Successfully updated to:', newName);
      
      // Re-fetch to verify
      const verifiedUser = await User.findById(user._id);
      console.log('Verified from DB:', verifiedUser.username);
      
      // Rollback
      verifiedUser.username = oldName;
      await verifiedUser.save();
      console.log('Rolled back to:', oldName);
    } else {
      console.log('No user found in database.');
    }
  } catch (err) {
    console.error('Error during DB test:', err);
  } finally {
    await mongoose.disconnect();
  }
}

test();
