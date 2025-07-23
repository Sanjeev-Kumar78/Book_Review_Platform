// src/controllers/bookController.ts
import { Request, Response } from "express";
import { prisma } from "../config/database";
import { handleAsyncError, createError } from "../middleware/errorHandler";

export const getAllBooks = handleAsyncError(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const genre = req.query.genre as string;

    const where = genre ? { genre: { has: genre } } : {};

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: limit,
        include: {
          reviews: {
            include: {
              user: {
                select: { name: true, email: true },
              },
            },
          },
          _count: {
            select: { reviews: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.book.count({ where }),
    ]);

    // Calculate average rating for each book
    const booksWithRating = books.map((book) => {
      const avgRating =
        book.reviews.length > 0
          ? book.reviews.reduce((sum, review) => sum + review.rating, 0) /
            book.reviews.length
          : 0;

      return {
        ...book,
        averageRating: Math.round(avgRating * 10) / 10,
      };
    });

    res.json({
      data: booksWithRating,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  }
);

export const getBookById = handleAsyncError(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 5, // Limit to recent 5 reviews for the detail page
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!book) {
      throw createError("Book not found", 404);
    }

    // Calculate average rating and rating distribution
    const [avgRatingResult, ratingDistribution] = await Promise.all([
      prisma.review.aggregate({
        where: { bookId: id },
        _avg: {
          rating: true,
        },
      }),
      prisma.review.groupBy({
        by: ["rating"],
        where: { bookId: id },
        _count: {
          rating: true,
        },
        orderBy: {
          rating: "desc",
        },
      }),
    ]);

    const averageRating = avgRatingResult._avg.rating
      ? Math.round(avgRatingResult._avg.rating * 10) / 10
      : 0;

    res.json({
      data: {
        ...book,
        averageRating,
        reviewStats: {
          totalReviews: book._count.reviews,
          averageRating,
          ratingDistribution: ratingDistribution.map((item) => ({
            rating: item.rating,
            count: item._count.rating,
            percentage:
              book._count.reviews > 0
                ? Math.round((item._count.rating / book._count.reviews) * 100)
                : 0,
          })),
        },
      },
    });
  }
);

export const createBook = handleAsyncError(
  async (req: Request, res: Response) => {
    const { title, author, genre, published } = req.body;

    const book = await prisma.book.create({
      data: {
        title,
        author,
        genre,
        published: new Date(published),
      },
      include: {
        _count: {
          select: { reviews: true },
        },
      },
    });

    res.status(201).json({
      message: "Book created successfully",
      data: book,
    });
  }
);

export const updateBook = handleAsyncError(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.published) {
      updateData.published = new Date(updateData.published);
    }

    const book = await prisma.book.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { reviews: true },
        },
      },
    });

    res.json({
      message: "Book updated successfully",
      data: book,
    });
  }
);

export const deleteBook = handleAsyncError(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.book.delete({
      where: { id },
    });

    res.json({ message: "Book deleted successfully" });
  }
);

export const searchBooks = handleAsyncError(
  async (req: Request, res: Response) => {
    const { q: query } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!query) {
      throw createError("Search query is required", 400);
    }

    const books = await prisma.book.findMany({
      where: {
        OR: [
          { title: { contains: query as string, mode: "insensitive" } },
          { author: { contains: query as string, mode: "insensitive" } },
          { genre: { has: query as string } },
        ],
      },
      skip,
      take: limit,
      include: {
        _count: {
          select: { reviews: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate average rating for each book
    const booksWithRating = await Promise.all(
      books.map(async (book) => {
        const reviews = await prisma.review.findMany({
          where: { bookId: book.id },
        });

        const avgRating =
          reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length
            : 0;

        return {
          ...book,
          averageRating: Math.round(avgRating * 10) / 10,
        };
      })
    );

    res.json({ data: booksWithRating });
  }
);

export const getBooksByGenre = handleAsyncError(
  async (req: Request, res: Response) => {
    const genres = await prisma.book.findMany({
      select: { genre: true },
      distinct: ["genre"],
    });

    // Flatten and count genres
    const genreCount: { [key: string]: number } = {};
    genres.forEach((book) => {
      book.genre.forEach((g) => {
        genreCount[g] = (genreCount[g] || 0) + 1;
      });
    });

    const sortedGenres = Object.entries(genreCount)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);

    res.json({ data: sortedGenres });
  }
);

export const getBookReviews = handleAsyncError(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // First verify the book exists
    const book = await prisma.book.findUnique({
      where: { id },
      select: { id: true, title: true, author: true },
    });

    if (!book) {
      throw createError("Book not found", 404);
    }

    // Get reviews with pagination
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { bookId: id },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({
        where: { bookId: id },
      }),
    ]);

    // Calculate average rating
    const avgRatingResult = await prisma.review.aggregate({
      where: { bookId: id },
      _avg: {
        rating: true,
      },
    });

    const averageRating = avgRatingResult._avg.rating
      ? Math.round(avgRatingResult._avg.rating * 10) / 10
      : 0;

    // Calculate rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ["rating"],
      where: { bookId: id },
      _count: {
        rating: true,
      },
      orderBy: {
        rating: "desc",
      },
    });

    res.json({
      data: reviews,
      book: book,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        totalReviews: total,
        averageRating,
        ratingDistribution: ratingDistribution.map((item) => ({
          rating: item.rating,
          count: item._count.rating,
        })),
      },
    });
  }
);
