import dbConnect from '../../lib/dbConnect.js';
import Review from '../../models/Review.js';
import Book from '../../models/Book.js';
import auth from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    // Apply auth middleware
    await new Promise((resolve, reject) => {
      auth(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const { bookId, rating, reviewText } = req.body;

    // Validation
    if (!bookId) {
      return res.status(400).json({ message: 'Valid book ID is required' });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (!reviewText || reviewText.trim().length < 1 || reviewText.trim().length > 500) {
      return res.status(400).json({ message: 'Review text is required and must be less than 500 characters' });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({ bookId, userId: req.user._id });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const review = new Review({
      bookId,
      userId: req.user._id,
      rating: parseInt(rating),
      reviewText: reviewText.trim()
    });

    await review.save();
    await review.populate('userId', 'name');

    res.status(201).json({
      message: 'Review created successfully',
      review: {
        id: review._id,
        book_id: review.bookId,
        user_id: review.userId._id,
        user_name: review.userId.name,
        rating: review.rating,
        review_text: review.reviewText,
        created_at: review.createdAt,
        updated_at: review.updatedAt
      }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
