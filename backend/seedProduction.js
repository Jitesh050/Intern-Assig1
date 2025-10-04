const mongoose = require('mongoose');
const Book = require('./models/Book');
const User = require('./models/User');
const Review = require('./models/Review');

// Sample books data
const sampleBooks = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "The story of young Scout Finch, her brother Jem, and their father Atticus in the fictional town of Maycomb, Alabama, during the 1930s. Atticus, a lawyer, defends a black man falsely accused of rape.",
    genre: "Fiction",
    year: 1960
  },
  {
    title: "1984",
    author: "George Orwell",
    description: "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism. The story follows Winston Smith, a low-ranking member of 'the Party' in a world where independent thinking is a crime.",
    genre: "Dystopian Fiction",
    year: 1949
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "Set in the summer of 1922, the novel follows Nick Carraway, a young man from the Midwest who moves to New York to work in the bond business. He becomes fascinated by his mysterious neighbor Jay Gatsby.",
    genre: "Literary Fiction",
    year: 1925
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "The story follows the character development of Elizabeth Bennet, the dynamic protagonist who learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.",
    genre: "Romance",
    year: 1813
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    description: "The story is told in the first person by Holden Caulfield, a teenager from New York City who is expelled from his prep school and then takes a journey around America.",
    genre: "Coming-of-age Fiction",
    year: 1951
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    description: "An epic high-fantasy novel about the quest to destroy the One Ring, which was created by the Dark Lord Sauron. The story follows hobbit Frodo Baggins and his companions on their journey through Middle-earth.",
    genre: "Fantasy",
    year: 1954
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    description: "The first novel in the Harry Potter series. It follows Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday, when he receives a letter of acceptance to Hogwarts School of Witchcraft and Wizardry.",
    genre: "Fantasy",
    year: 1997
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "A fantasy novel about the adventures of hobbit Bilbo Baggins, who is hired by a group of dwarves to help them reclaim their mountain home from a dragon named Smaug.",
    genre: "Fantasy",
    year: 1937
  },
  {
    title: "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe",
    author: "C.S. Lewis",
    description: "The first published and best known of seven novels in The Chronicles of Narnia series. It tells the story of four children who discover the magical land of Narnia through an old wardrobe.",
    genre: "Fantasy",
    year: 1950
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    description: "A philosophical book about a young Andalusian shepherd named Santiago who travels from his homeland in Spain to the Egyptian desert in search of treasure buried in the Pyramids.",
    genre: "Philosophical Fiction",
    year: 1988
  },
  {
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    description: "The story of Amir, a young boy from Kabul, and his journey to find redemption. The novel is set against the backdrop of Afghanistan's tumultuous history from the fall of the monarchy to the rise of the Taliban.",
    genre: "Literary Fiction",
    year: 2003
  },
  {
    title: "The Book Thief",
    author: "Markus Zusak",
    description: "Set in Nazi Germany during World War II, the novel follows Liesel Meminger, a young girl who steals books and shares them with others during the bombing raids.",
    genre: "Historical Fiction",
    year: 2005
  }
];

// Sample reviews data
const sampleReviews = [
  {
    rating: 5,
    reviewText: "An absolute masterpiece! This book changed my perspective on life and literature. Highly recommend to everyone."
  },
  {
    rating: 4,
    reviewText: "Great book with compelling characters and an engaging plot. Some parts were a bit slow, but overall very enjoyable."
  },
  {
    rating: 5,
    reviewText: "One of the best books I've ever read. The writing is beautiful and the story is unforgettable."
  },
  {
    rating: 3,
    reviewText: "Interesting concept and well-written, but I found some parts confusing. Still worth reading though."
  },
  {
    rating: 4,
    reviewText: "Really enjoyed this book! The characters are well-developed and the plot keeps you engaged throughout."
  },
  {
    rating: 5,
    reviewText: "A timeless classic that everyone should read at least once. The themes are still relevant today."
  },
  {
    rating: 4,
    reviewText: "Excellent storytelling and beautiful prose. This book will stay with me for a long time."
  },
  {
    rating: 3,
    reviewText: "Good book overall, though I expected more from the ending. Still recommend it to others."
  }
];

async function seedProductionDatabase() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Jitesh005:Jitesh%40234@cluster0.ueni8wx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');

    // Create a sample user if none exists
    let sampleUser = await User.findOne({ email: 'demo@bookreview.com' });
    if (!sampleUser) {
      sampleUser = new User({
        name: 'Demo User',
        email: 'demo@bookreview.com',
        password: 'password123' // This will be hashed by the User model
      });
      await sampleUser.save();
      console.log('Created demo user');
    }

    // Clear existing books and reviews
    await Book.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing books and reviews');

    // Add sample books
    const createdBooks = [];
    for (const bookData of sampleBooks) {
      const book = new Book({
        ...bookData,
        addedBy: sampleUser._id
      });
      await book.save();
      createdBooks.push(book);
      console.log(`Added book: ${book.title}`);
    }

    // Add sample reviews for some books
    const booksToReview = createdBooks.slice(0, 8); // Review first 8 books
    for (let i = 0; i < booksToReview.length; i++) {
      const book = booksToReview[i];
      const reviewData = sampleReviews[i % sampleReviews.length];
      
      const review = new Review({
        bookId: book._id,
        userId: sampleUser._id,
        rating: reviewData.rating,
        reviewText: reviewData.reviewText
      });
      await review.save();
      console.log(`Added review for: ${book.title}`);
    }

    console.log('\n✅ Production database seeded successfully!');
    console.log(`📚 Added ${createdBooks.length} books`);
    console.log(`⭐ Added ${booksToReview.length} reviews`);
    console.log(`👤 Demo user: demo@bookreview.com / password123`);
    
  } catch (error) {
    console.error('Error seeding production database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding function
seedProductionDatabase();
