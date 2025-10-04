const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Book = require('./models/Book');
const Review = require('./models/Review');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set!');
  process.exit(1);
}

async function seedProduction() {
  try {
    console.log('🌱 Starting production database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await Review.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create demo user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const demoUser = new User({
      name: 'Demo User',
      email: 'demo@bookreview.com',
      password: hashedPassword
    });
    await demoUser.save();
    console.log('👤 Created demo user: demo@bookreview.com / password123');

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
      },
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'A story of the fabulously wealthy Jay Gatsby and his love for Daisy Buchanan.',
        genre: 'Fiction',
        year: 1925,
        addedBy: demoUser._id
      }
    ];

    const savedBooks = await Book.insertMany(books);
    console.log(`📚 Added ${savedBooks.length} books`);

    // Add sample reviews
    const reviews = [
      {
        bookId: savedBooks[0]._id,
        userId: demoUser._id,
        rating: 5,
        reviewText: 'An absolute masterpiece! This book changed my perspective on justice and morality.'
      },
      {
        bookId: savedBooks[1]._id,
        userId: demoUser._id,
        rating: 4,
        reviewText: 'Chilling and prophetic. Orwell\'s vision of totalitarianism is terrifyingly accurate.'
      }
    ];

    await Review.insertMany(reviews);
    console.log(`⭐ Added ${reviews.length} reviews`);

    console.log('✅ Production database seeded successfully!');
    console.log('🎯 Demo user: demo@bookreview.com / password123');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

seedProduction();