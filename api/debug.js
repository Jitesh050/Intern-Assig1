import dbConnect from '../../lib/dbConnect.js';
import User from '../../models/User.js';

export default async function handler(req, res) {
  try {
    console.log('🔍 Debug endpoint called');
    
    // Test database connection
    await dbConnect();
    console.log('✅ Database connected');
    
    // Test if we can find users
    const userCount = await User.countDocuments();
    console.log(`📊 User count: ${userCount}`);
    
    // Test if we can find the demo user
    const demoUser = await User.findOne({ email: 'demo@bookreview.com' });
    console.log('👤 Demo user:', demoUser ? 'Found' : 'Not found');
    
    res.json({
      message: 'Debug successful',
      userCount,
      demoUserExists: !!demoUser,
      environment: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET
    });
  } catch (error) {
    console.error('❌ Debug error:', error);
    res.status(500).json({
      message: 'Debug failed',
      error: error.message,
      stack: error.stack
    });
  }
}
