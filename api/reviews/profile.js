import dbConnect from '../../lib/dbConnect.js';
import Review from '../../models/Review.js';
import auth from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
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

    const reviews = await Review.find({ userId: req.user._id })
      .populate('bookId', 'title author')
      .sort({ createdAt: -1 });

    const formattedReviews = reviews.map(review => ({
      id: review._id,
      book_id: review.bookId._id,
      book_title: review.bookId.title,
      book_author: review.bookId.author,
      rating: review.rating,
      review_text: review.reviewText,
      created_at: review.createdAt,
      updated_at: review.updatedAt
    }));

    res.json(formattedReviews);
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
