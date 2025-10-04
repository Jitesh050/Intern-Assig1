const express = require('express');
const { body, validationResult } = require('express-validator');
const Book = require('../models/Book');
const Review = require('../models/Review');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/books
// @desc    Get all books with pagination, search, and filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
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
          added_by: book.addedBy._id,
          added_by_name: book.addedBy.name,
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
});

// @route   GET /api/books/:id
// @desc    Get book by ID with reviews
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'name email');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Get reviews for this book
    const reviews = await Review.find({ bookId: req.params.id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

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
      created_at: book.createdAt,
      updated_at: book.updatedAt
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/books
// @desc    Create new book
// @access  Private
router.post('/', [
  auth,
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('author').trim().isLength({ min: 1, max: 50 }).withMessage('Author is required and must be less than 50 characters'),
  body('description').trim().isLength({ min: 1, max: 1000 }).withMessage('Description is required and must be less than 1000 characters'),
  body('genre').trim().isLength({ min: 1, max: 30 }).withMessage('Genre is required and must be less than 30 characters'),
  body('year').isInt({ min: 1000, max: new Date().getFullYear() }).withMessage('Year must be a valid year')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, description, genre, year } = req.body;

    const book = new Book({
      title,
      author,
      description,
      genre,
      year,
      addedBy: req.user._id
    });

    await book.save();
    await book.populate('addedBy', 'name email');

    res.status(201).json({
      message: 'Book created successfully',
      book
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/books/:id
// @desc    Update book
// @access  Private
router.put('/:id', [
  auth,
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be less than 100 characters'),
  body('author').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Author must be less than 50 characters'),
  body('description').optional().trim().isLength({ min: 1, max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('genre').optional().trim().isLength({ min: 1, max: 30 }).withMessage('Genre must be less than 30 characters'),
  body('year').optional().isInt({ min: 1000, max: new Date().getFullYear() }).withMessage('Year must be a valid year')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user is the creator
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this book' });
    }

    const { title, author, description, genre, year } = req.body;
    
    if (title) book.title = title;
    if (author) book.author = author;
    if (description) book.description = description;
    if (genre) book.genre = genre;
    if (year) book.year = year;

    await book.save();
    await book.populate('addedBy', 'name email');

    res.json({
      message: 'Book updated successfully',
      book
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete book
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user is the creator
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }

    // Delete all reviews for this book
    await Review.deleteMany({ bookId: req.params.id });
    
    // Delete the book
    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/books/profile/books
// @desc    Get user's books
// @access  Private
router.get('/profile/books', auth, async (req, res) => {
  try {
    const books = await Book.find({ addedBy: req.user._id })
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 });

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
          added_by: book.addedBy._id,
          added_by_name: book.addedBy.name,
          average_rating: Math.round(averageRating * 10) / 10,
          review_count: reviews.length,
          created_at: book.createdAt,
          updated_at: book.updatedAt
        };
      })
    );

    res.json(booksWithRatings);
  } catch (error) {
    console.error('Get user books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
