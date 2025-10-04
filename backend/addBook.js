const mongoose = require('mongoose');
const Book = require('./models/Book');
const User = require('./models/User');
require('dotenv').config();

async function addBook(title, author, description, genre, year) {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Jitesh005:Jitesh%40234@cluster0.ueni8wx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');

    // Find the demo user
    const demoUser = await User.findOne({ email: 'demo@bookreview.com' });
    if (!demoUser) {
      console.log('Demo user not found. Please run seedData.js first.');
      return;
    }

    // Create new book
    const book = new Book({
      title,
      author,
      description,
      genre,
      year: parseInt(year),
      addedBy: demoUser._id
    });

    await book.save();
    console.log(`✅ Successfully added book: ${book.title}`);
    
  } catch (error) {
    console.error('Error adding book:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 5) {
  console.log('Usage: node addBook.js "Title" "Author" "Description" "Genre" "Year"');
  console.log('Example: node addBook.js "The Hunger Games" "Suzanne Collins" "A dystopian novel about a televised fight to the death" "Dystopian Fiction" "2008"');
  process.exit(1);
}

const [title, author, description, genre, year] = args;
addBook(title, author, description, genre, year);
