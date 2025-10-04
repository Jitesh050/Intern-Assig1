const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const reviewRoutes = require('./routes/reviews');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`, {
    headers: req.headers,
    body: req.body
  });
  next();
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set!');
  process.exit(1);
}

console.log('Attempting to connect to MongoDB...');
console.log('MongoDB URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs

mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ Connected to MongoDB successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.error('Connection string used:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ message: 'API is running', status: 'healthy' });
});

// Seed endpoint for production
app.post('/api/seed', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const User = require('./models/User');
    const Book = require('./models/Book');
    const Review = require('./models/Review');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await Review.deleteMany({});

    // Create demo user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const demoUser = new User({
      name: 'Demo User',
      email: 'demo@bookreview.com',
      password: hashedPassword
    });
    await demoUser.save();

    // Add sample books
    const books = [
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        description: 'A gripping tale of racial injustice and childhood innocence.',
        genre: 'Fiction',
        year: 1960,
        addedBy: demoUser._id
      },
      {
        title: '1984',
        author: 'George Orwell',
        description: 'A dystopian social science fiction novel about totalitarian control.',
        genre: 'Dystopian Fiction',
        year: 1949,
        addedBy: demoUser._id
      }
    ];

    const savedBooks = await Book.insertMany(books);

    // Add sample review
    const review = new Review({
      bookId: savedBooks[0]._id,
      userId: demoUser._id,
      rating: 5,
      reviewText: 'An absolute masterpiece!'
    });
    await review.save();

    res.json({ 
      message: 'Database seeded successfully!',
      user: 'demo@bookreview.com / password123',
      books: savedBooks.length,
      reviews: 1
    });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ message: 'Seeding failed', error: error.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error occurred:', err);
  
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('❌ JSON parsing error:', err.message);
    return res.status(400).json({ message: 'Invalid JSON format' });
  }
  
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
