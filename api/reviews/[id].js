import dbConnect from '../../lib/dbConnect.js';
import Review from '../../models/Review.js';
import auth from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
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

    const { id } = req.query;
    const { rating, reviewText } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Review ID is required' });
    }

    // Validation
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (reviewText !== undefined && (reviewText.trim().length < 1 || reviewText.trim().length > 500)) {
      return res.status(400).json({ message: 'Review text must be less than 500 characters' });
    }

    const review = await Review.findById(id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the author of the review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    if (rating !== undefined) review.rating = parseInt(rating);
    if (reviewText !== undefined) review.reviewText = reviewText.trim();

    await review.save();
    await review.populate('userId', 'name');

    res.json({
      message: 'Review updated successfully',
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
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
