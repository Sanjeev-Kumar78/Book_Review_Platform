# 📚 Book Review Platform

A modern, full-stack book review platform built with React, Node.js, TypeScript, and PostgreSQL. Users can discover books, write reviews, and share their reading experiences.

## ✨ Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Book Management**: Add, view, and search books
- **Review System**: Write and read book reviews with star ratings
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Updates**: Dynamic content updates
- **Docker Support**: Easy deployment with Docker Compose

## 🛠️ Technology Stack

### Frontend

- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** for form handling
- **Axios** for API calls
- **React Toastify** for notifications

### Backend

- **Node.js** with Express.js
- **TypeScript** for type safety
- **Prisma ORM** for database operations
- **PostgreSQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing

### DevOps

- **Docker & Docker Compose** for containerization
- **Railway** for cloud deployment
- **Nginx** for serving frontend

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git installed

### Using Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Book_Review_Platform
   ```

2. **Run the App**

   ```bash
   cd backend/
   docker-compose up --build
   ```

   ```bash
   cd frontend/
   docker-compose up --build
   ```

   This command will build the Docker images and start the services defined in `docker-compose.yml`.

3. **Access the application**
   - Frontend: http://localhost:4173
   - Backend API: http://localhost:3001
   - Database: localhost:5432

### Manual Setup

#### Backend Setup

1. Navigate to backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. Set up database:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. Navigate to frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
Book_Review_Platform/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── routes/         # API routes
│   │   ├── config/         # Configuration files
│   │   └── app.ts          # Express app setup
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/     # Database migrations
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── deploy.sh
├── deploy.bat
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://book_review_user:book_review_password@localhost:5432/book_reviews_platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:4173
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Book Review Platform
VITE_APP_VERSION=1.0.0
```

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: User accounts and authentication
- **Books**: Book information (title, author, genre, etc.)
- **Reviews**: User reviews with ratings and comments

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Books

- `GET /api/books` - Get all books (with pagination)
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create new book (authenticated)
- `PUT /api/books/:id` - Update book (authenticated)
- `DELETE /api/books/:id` - Delete book (authenticated)

### Reviews

- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/:id` - Get review by ID
- `POST /api/reviews` - Create review (authenticated)
- `PUT /api/reviews/:id` - Update review (authenticated)
- `DELETE /api/reviews/:id` - Delete review (authenticated)

## 🧪 Testing

### Backend Testing

```bash
cd backend
docker-compose up --build -d
```

Go to http://localhost:3001/api to access the backend API.

### Frontend Testing

```bash
cd frontend
docker-compose up --build -d
```

Go to http://localhost:4173 to access the frontend.

## 📈 Performance Features

- **Docker multi-stage builds** for optimized images
- **Nginx compression** for frontend assets
- **Database indexing** for faster queries
- **JWT token management** for secure authentication
- **Connection pooling** for database efficiency

## 🔒 Security Features

- **JWT authentication** with secure token handling
- **Password hashing** with bcryptjs
- **CORS protection** configured for specific origins
- **Rate limiting** to prevent abuse
- **Helmet.js** for security headers
- **Input validation** on all endpoints

## 🚀 Deployment

This application can be deployed on various platforms, including Railway, Docker, and VPS. The recommended deployment method is using Railway for simplicity.

### Environment-specific Configurations

- **Development**: Hot reloading, detailed logging
- **Production**: Optimized builds, security headers, compression

1. **Manual deployment steps:**
   - Create Railway project
   - Deploy backend service with PostgreSQL database
   - Deploy frontend service
   - Configure environment variables
   - Update CORS settings

**Environment Variables:**
Given in `.env.example` files for both backend and frontend.
Backend:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `FRONTEND_URL`: URL of deployed frontend

Frontend:

- `VITE_API_URL`: URL of deployed backend API

### Other Deployment Options

- **Docker**: Use the provided Dockerfiles
- **Render**: Deploy backend and frontend with Docker support
- **Vercel/Netlify**: Frontend can be deployed to static hosting
- **Heroku**: Compatible with minor configuration changes
- **VPS**: Use Docker Compose for self-hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Database connection failed**

   - Check if PostgreSQL is running
   - Verify DATABASE_URL in .env file
   - Ensure database exists

2. **Frontend can't connect to backend**

   - Check if backend is running on correct port
   - Verify VITE_API_URL in frontend .env
   - Check CORS configuration

3. **Docker build fails**
   - Clear Docker cache: `docker system prune -a`
   - Check Dockerfile syntax
   - Ensure all required files exist

### Support

For issues and questions, please check the existing issues or create a new one in the GitHub repository.

---

Made with ❤️ for book lovers everywhere!
