import dbConnect from '../../lib/dbConnect.js';
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

    const { title, author, description, genre, year } = req.body;

    // Validation
    if (!title || title.trim().length < 1 || title.trim().length > 100) {
      return res.status(400).json({ message: 'Title is required and must be less than 100 characters' });
    }

    if (!author || author.trim().length < 1 || author.trim().length > 50) {
      return res.status(400).json({ message: 'Author is required and must be less than 50 characters' });
    }

    if (!description || description.trim().length < 1 || description.trim().length > 1000) {
      return res.status(400).json({ message: 'Description is required and must be less than 1000 characters' });
    }

    if (!genre || genre.trim().length < 1 || genre.trim().length > 30) {
      return res.status(400).json({ message: 'Genre is required and must be less than 30 characters' });
    }

    if (!year || year < 1000 || year > new Date().getFullYear()) {
      return res.status(400).json({ message: 'Year must be a valid year' });
    }

    const book = new Book({
      title: title.trim(),
      author: author.trim(),
      description: description.trim(),
      genre: genre.trim(),
      year: parseInt(year),
      addedBy: req.user._id
    });

    await book.save();

    res.status(201).json({
      message: 'Book created successfully',
      book: {
        id: book._id,
        title: book.title,
        author: book.author,
        description: book.description,
        genre: book.genre,
        year: book.year,
        added_by: book.addedBy,
        created_at: book.createdAt,
        updated_at: book.updatedAt
      }
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
