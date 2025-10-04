const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function createUser() {
  try {
    console.log('🌱 Creating demo user...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'demo@bookreview.com' });
    if (existingUser) {
      console.log('👤 Demo user already exists!');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('password123', 10);
    const demoUser = new User({
      name: 'Demo User',
      email: 'demo@bookreview.com',
      password: hashedPassword
    });
    
    await demoUser.save();
    console.log('✅ Demo user created successfully!');
    console.log('📧 Email: demo@bookreview.com');
    console.log('🔑 Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createUser();
