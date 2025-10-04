import dbConnect from '../../lib/dbConnect.js';
import Book from '../../models/Book.js';
import Review from '../../models/Review.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ message: 'Book ID is required' });
    }

    const book = await Book.findById(id).populate('addedBy', 'name email');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Get reviews for this book
    const reviews = await Review.find({ bookId: id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    const formattedReviews = reviews.map(review => ({
      id: review._id,
      user_id: review.userId._id,
      user_name: review.userId.name,
      rating: review.rating,
      review_text: review.reviewText,
      created_at: review.createdAt,
      updated_at: review.updatedAt
    }));

    res.json({
      id: book._id,
      title: book.title,
      author: book.author,
      description: book.description,
      genre: book.genre,
      year: book.year,
      added_by: book.addedBy._id,
      added_by_name: book.addedBy.name,
      average_rating: Math.round(averageRating * 10) / 10,
      review_count: reviews.length,
      reviews: formattedReviews,
      created_at: book.createdAt,
      updated_at: book.updatedAt
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
