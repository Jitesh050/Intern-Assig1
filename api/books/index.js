import dbConnect from '../../lib/dbConnect.js';
import Book from '../../models/Book.js';
import Review from '../../models/Review.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    const genre = req.query.genre || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (genre) {
      query.genre = { $regex: genre, $options: 'i' };
    }

    // Get total count
    const totalBooks = await Book.countDocuments(query);
    
    // Get books with pagination
    const books = await Book.find(query)
      .populate('addedBy', 'name email')
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    // Calculate average ratings for each book
    const booksWithRatings = await Promise.all(
      books.map(async (book) => {
        const reviews = await Review.find({ bookId: book._id });
        const averageRating = reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
          : 0;

        return {
          id: book._id,
          title: book.title,
          author: book.author,
          description: book.description,
          genre: book.genre,
          year: book.year,
          addedBy: book.addedBy,
          average_rating: Math.round(averageRating * 10) / 10,
          review_count: reviews.length,
          created_at: book.createdAt,
          updated_at: book.updatedAt
        };
      })
    );

    res.json({
      books: booksWithRatings,
      total_pages: Math.ceil(totalBooks / limit),
      current_page: page,
      total_books: totalBooks,
      has_next: page < Math.ceil(totalBooks / limit),
      has_prev: page > 1
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
