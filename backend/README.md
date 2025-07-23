# Book Review Platform Backend v2.0

A comprehensive RESTful API built with Express.js, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

### **Core Functionality**

- ✅ **User Management** - CRUD operations with validation
- ✅ **Book Management** - Complete book catalog with genres
- ✅ **Review System** - Rating and commenting system
- ✅ **Search & Filtering** - Full-text search across all entities
- ✅ **Pagination** - Efficient data loading with pagination
- ✅ **Statistics** - Review analytics and insights

### **Security & Performance**

- ✅ **Helmet.js** - Security headers
- ✅ **Rate Limiting** - API abuse prevention
- ✅ **CORS** - Cross-origin resource sharing
- ✅ **Compression** - Response compression
- ✅ **Input Validation** - Comprehensive request validation
- ✅ **Error Handling** - Centralized error management

### **Developer Experience**

- ✅ **TypeScript** - Type safety throughout
- ✅ **Modular Architecture** - Clean separation of concerns
- ✅ **Logging** - Request/response logging with Morgan
- ✅ **Hot Reload** - Development server with nodemon
- ✅ **Health Checks** - API status monitoring

## 📡 API Endpoints

### **Health & Status**

```
GET /                 - API information and endpoints
GET /api/health       - Health check with system stats
```

### **Users**

```
GET    /api/users              - Get all users (paginated)
GET    /api/users/search?q=    - Search users by name/email
GET    /api/users/:id          - Get user by ID with reviews
POST   /api/users              - Create new user
PUT    /api/users/:id          - Update user
DELETE /api/users/:id          - Delete user
```

### **Books**

```
GET    /api/books                    - Get all books (paginated, filterable by genre)
GET    /api/books/search?q=          - Search books by title/author/genre
GET    /api/books/genres             - Get all genres with counts
GET    /api/books/:id               - Get book by ID with reviews and ratings
POST   /api/books                   - Create new book
PUT    /api/books/:id               - Update book
DELETE /api/books/:id               - Delete book
```

### **Reviews**

```
GET    /api/reviews                  - Get all reviews (paginated, filterable)
GET    /api/reviews/stats            - Get review statistics
GET    /api/reviews/:id             - Get review by ID
POST   /api/reviews                 - Create new review
PUT    /api/reviews/:id             - Update review
DELETE /api/reviews/:id             - Delete review
```

## 🛠 Setup & Installation

### **Prerequisites**

- Node.js (v18+)
- PostgreSQL database
- npm or yarn

### **Installation**

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database configuration

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Build the application
npm run build
```

### **Development**

```bash
# Start development server with hot reload
npm run dev

# View database in Prisma Studio
npm run prisma:studio
```

### **Production**

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📝 Request/Response Examples

### **Create User**

```bash
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

### **Create Book**

```bash
POST /api/books
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": ["Fiction", "Classic"],
  "published": "1925-04-10T00:00:00.000Z"
}
```

### **Create Review**

```bash
POST /api/reviews
Content-Type: application/json

{
  "bookId": "book_id_here",
  "userId": "user_id_here",
  "rating": 4.5,
  "comment": "Great book with excellent character development!"
}
```

## 🔒 Validation Rules

### **Users**

- Email: Valid email format, unique
- Password: Minimum 6 characters
- Name: 2-50 characters

### **Books**

- Title: Required, max 200 characters
- Author: Required, max 100 characters
- Genre: Array with at least 1 genre, each max 50 characters
- Published: Valid ISO8601 date

### **Reviews**

- Rating: Float between 1.0 and 5.0
- Comment: Optional, max 1000 characters
- One review per user per book

## 📊 Query Parameters

### **Pagination**

```
?page=1&limit=10
```

### **Search**

```
?q=search_term
```

### **Filtering**

```
/api/books?genre=Fiction
/api/reviews?bookId=book_id&userId=user_id
```

## 🚦 Rate Limiting

- **100 requests per 15 minutes** per IP address
- Configurable in production environment

## 🔧 Environment Variables

```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://username:password@localhost:5432/database
```

## 📈 Performance Features

- **Response Compression** - Gzip compression enabled
- **Connection Pooling** - Prisma connection pooling
- **Query Optimization** - Efficient database queries with select/include
- **Pagination** - Limit data transfer with paginated responses
- **Caching Headers** - Browser caching for static responses

## 🛡️ Security Features

- **Helmet.js** - Sets various HTTP headers
- **CORS** - Configurable cross-origin resource sharing
- **Rate Limiting** - Prevents API abuse
- **Input Validation** - Sanitizes and validates all inputs
- **Error Handling** - Prevents information leakage

The API is now production-ready with comprehensive error handling, security measures, and developer-friendly features! 🎉
