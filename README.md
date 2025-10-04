# Book Review Platform

A full-stack MERN application for discovering, reviewing, and sharing great books.

## 🚀 Live Demo

- **Frontend**: [Deployed on Vercel](https://your-app.vercel.app)
- **Backend**: [Deployed on Railway](https://your-app.railway.app)

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MongoDB Atlas

## 📋 Features

- User authentication (Sign up/Login)
- Browse and search books
- Add new books to the platform
- Write and read book reviews
- User profile with personal books and reviews
- Responsive design

## 🚀 Deployment Guide

### Option 1: Vercel + Railway (Recommended)

#### Backend Deployment (Railway)

1. **Go to [Railway](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Create New Project** → Deploy from GitHub repo
4. **Select Repository**: `Jitesh050/Intern-Assig1`
5. **Configure**:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. **Set Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://Jitesh005:Jitesh%40234@cluster0.ueni8wx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your_super_secret_jwt_key_here_12345
   NODE_ENV=production
   PORT=5000
   ```
7. **Deploy** and get your Railway URL

#### Frontend Deployment (Vercel)

1. **Go to [Vercel](https://vercel.com)**
2. **Sign up/Login** with GitHub
3. **Import Project** from `Jitesh050/Intern-Assig1`
4. **Configure**:
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. **Set Environment Variables**:
   ```
   REACT_APP_BACKEND_URL=https://your-railway-app.railway.app
   GENERATE_SOURCEMAP=false
   ```
6. **Deploy** and get your Vercel URL

#### Seed Production Database

After deployment, seed your production database:

1. **Go to Railway Dashboard**
2. **Select your backend service**
3. **Go to Deployments tab**
4. **Click on the latest deployment**
5. **Open the terminal/console**
6. **Run**: `node seedProduction.js`

## 🏃‍♂️ Local Development

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Jitesh050/Intern-Assig1.git
   cd Intern-Assig1
   ```

2. **Install dependencies**:
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**:
   
   **Backend** (create `backend/.env`):
   ```
   MONGODB_URI=mongodb+srv://Jitesh005:Jitesh%40234@cluster0.ueni8wx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your_super_secret_jwt_key_here_12345
   PORT=5001
   ```
   
   **Frontend** (create `frontend/.env`):
   ```
   REACT_APP_BACKEND_URL=http://localhost:5001
   PORT=3001
   ```

4. **Seed the database**:
   ```bash
   cd backend
   node seedData.js
   ```

5. **Start the development servers**:
   ```bash
   # From root directory
   npm run dev
   ```

   Or start them separately:
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev
   
   # Frontend (Terminal 2)
   cd frontend
   npm start
   ```

### Access the Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5001

### Demo Credentials

- **Email**: demo@bookreview.com
- **Password**: password123

## 📁 Project Structure

```
Intern-Assig1/
├── backend/                 # Backend API
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   ├── server.js           # Main server file
│   └── seedData.js         # Database seeding script
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utility functions
│   └── public/             # Static files
└── README.md
```

## 🔧 Available Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend client

### Backend
- `npm run dev` - Start backend with nodemon
- `npm start` - Start backend in production mode
- `node seedData.js` - Seed database with sample data

### Frontend
- `npm start` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm test` - Run frontend tests

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Books
- `GET /api/books` - Get all books (with pagination)
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Add new book
- `GET /api/books/profile/books` - Get user's books

### Reviews
- `GET /api/reviews/book/:bookId` - Get reviews for a book
- `POST /api/reviews` - Add new review
- `GET /api/reviews/profile/reviews` - Get user's reviews

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Jitesh**
- GitHub: [@Jitesh050](https://github.com/Jitesh050)

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the database
- All the open-source contributors