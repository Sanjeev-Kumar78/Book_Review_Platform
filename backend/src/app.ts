import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import * as dotenv from "dotenv";

// Import routes
import { userRoutes } from "./routes/userRoutes";
import { bookRoutes } from "./routes/bookRoutes";
import { reviewRoutes } from "./routes/reviewRoutes";
import authRoutes from "./routes/authRoutes";

// Import middleware
import { globalErrorHandler, notFoundHandler } from "./middleware/errorHandler";
import { disconnectDatabase } from "./config/database";

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// Rate limiting - more strict for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: {
    error: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // reduced from 100 to 50 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth", authLimiter);
app.use(limiter);

// Logging middleware
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Body parsing middleware
app.use(compression());

// CORS configuration with multiple allowed origins
const getAllowedOrigins = () => {
  const origins = [];

  // Add primary frontend URL
  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL);
  }

  // Add additional origins from environment variable
  if (process.env.ALLOWED_ORIGINS) {
    const additionalOrigins = process.env.ALLOWED_ORIGINS.split(",").map(
      (origin) => origin.trim()
    );
    origins.push(...additionalOrigins);
  }

  // Add default development origins if no environment origins are set
  if (origins.length === 0) {
    origins.push("http://localhost:3000", "http://localhost:5173");
  }

  return [...new Set(origins)]; // Remove duplicates
};

const allowedOrigins = getAllowedOrigins();

// Debug logging for environment
console.log("🔧 Server Configuration:");
console.log(`- Environment: ${process.env.NODE_ENV}`);
console.log(`- Frontend URL: ${process.env.FRONTEND_URL}`);
console.log(`- Port: ${process.env.PORT}`);
console.log(`- Allowed Origins: ${allowedOrigins.join(", ")}`);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log(`CORS blocked origin: ${origin}`);
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200, // For legacy browser support
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "📚 Book Review Platform API is running!",
    version: "2.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      books: "/api/books",
      reviews: "/api/reviews",
    },
  });
});

// API status endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/reviews", reviewRoutes);

// 404 handler - must be after all routes
app.use("*", notFoundHandler);

// Global error handler - must be last
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Book Review Platform API v2.0.0`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📋 API Documentation: http://localhost:${PORT}`);
});

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received, shutting down gracefully...`);

  server.close(() => {
    console.log("HTTP server closed");
  });

  try {
    await disconnectDatabase();
    console.log("Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

export default app;
