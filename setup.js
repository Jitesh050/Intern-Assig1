const fs = require('fs');
const path = require('path');

// Create .env file for backend
const backendEnvContent = `MONGODB_URI=mongodb+srv://ls_kolhar:MyPassword123@cluster0.bytuctd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_here_12345
PORT=5000`;

const backendEnvPath = path.join(__dirname, 'backend', '.env');

if (!fs.existsSync(backendEnvPath)) {
  fs.writeFileSync(backendEnvPath, backendEnvContent);
  console.log('✅ Created backend/.env file');
} else {
  console.log('⚠️  backend/.env already exists');
}

console.log(`
🚀 Book Review Platform Setup Complete!

Next steps:
1. Install dependencies: npm run install-all
2. Start development server: npm run dev

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

Features included:
✅ User authentication (signup/login)
✅ Book CRUD operations with pagination
✅ Review system with ratings
✅ Search and filtering
✅ Dark/light mode toggle
✅ Rating distribution charts
✅ Responsive design
✅ Protected routes
✅ Profile management

Happy coding! 📚
`);
