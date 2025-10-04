import dbConnect from '../../lib/dbConnect.js';
import User from '../../models/User.js';
import Book from '../../models/Book.js';
import Review from '../../models/Review.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await Review.deleteMany({});

    // Create demo user (password will be auto-hashed by the pre-save hook)
    const demoUser = new User({
      name: 'Demo User',
      email: 'demo@bookreview.com',
      password: 'password123' // Let the pre-save hook hash this
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

    res.json({ 
      message: 'Database seeded successfully!',
      user: 'demo@bookreview.com / password123',
      books: savedBooks.length,
      reviews: reviews.length
    });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ message: 'Seeding failed', error: error.message });
  }
}