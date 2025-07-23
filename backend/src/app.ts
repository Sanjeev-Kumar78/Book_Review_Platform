import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "../generated/prisma";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Book Review Platform API is running!",
    timestamp: new Date().toISOString(),
  });
});

// Users routes
app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: { reviews: true },
        },
      },
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Books routes
app.get("/api/books", async (req: Request, res: Response) => {
  try {
    const books = await prisma.book.findMany({
      include: {
        reviews: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// Reviews routes
app.get("/api/reviews", async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        book: {
          select: { title: true, author: true },
        },
        user: {
          select: { name: true, email: true },
        },
      },
    });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Book Review Platform API`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await prisma.$disconnect();
  process.exit(0);
});
