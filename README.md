# Book Review Platform

A full-stack MERN application for managing books and reviews with user authentication.

## Features

- **User Authentication**: Sign up, login with JWT tokens
- **Book Management**: Add, edit, delete books with pagination
- **Review System**: Rate and review books (1-5 stars)
- **Search & Filter**: Search by title/author, filter by genre
- **Sorting**: Sort by year or average rating
- **Charts**: Rating distribution visualization
- **Dark/Light Mode**: Theme toggle
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React.js, React Router, Context API
- **Authentication**: JWT, bcrypt
- **Styling**: Tailwind CSS
- **Charts**: Recharts

## Project Structure

```
book-review-platform/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│   └── public/
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or use the provided connection string)

### Quick Start

1. Clone the repository
```bash
git clone <repository-url>
cd book-review-platform
```

2. Run the setup script
```bash
node setup.js
```

3. Install dependencies
```bash
npm run install-all
```

4. Start the development server
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Manual Setup

If you prefer to set up manually:

1. Install dependencies
```bash
npm run install-all
```

2. Create backend/.env file with:
```env
MONGODB_URI=mongodb+srv://ls_kolhar:MyPassword123@cluster0.bytuctd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_here_12345
PORT=5000
```

3. Start the development server
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Books
- `GET /api/books` - Get all books (with pagination)
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create new book (protected)
- `PUT /api/books/:id` - Update book (protected)
- `DELETE /api/books/:id` - Delete book (protected)

### Reviews
- `GET /api/books/:id/reviews` - Get reviews for a book
- `POST /api/books/:id/reviews` - Add review (protected)
- `PUT /api/reviews/:id` - Update review (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed)
}
```

### Book
```javascript
{
  title: String,
  author: String,
  description: String,
  genre: String,
  year: Number,
  addedBy: ObjectId (ref: User)
}
```

### Review
```javascript
{
  bookId: ObjectId (ref: Book),
  userId: ObjectId (ref: User),
  rating: Number (1-5),
  reviewText: String
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
# Intern-Assig1
