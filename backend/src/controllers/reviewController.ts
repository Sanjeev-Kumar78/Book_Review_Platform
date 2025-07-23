// src/controllers/reviewController.ts
import { Request, Response } from "express";
import { prisma } from "../config/database";
import { handleAsyncError, createError } from "../middleware/errorHandler";

export const getAllReviews = handleAsyncError(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const bookId = req.query.bookId as string;
    const userId = req.query.userId as string;

    const where: any = {};
    if (bookId) where.bookId = bookId;
    if (userId) where.userId = userId;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        include: {
          book: {
            select: { title: true, author: true },
          },
          user: {
            select: { name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({ where }),
    ]);

    res.json({
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  }
);

export const getReviewById = handleAsyncError(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        book: {
          select: { title: true, author: true },
        },
        user: {
          select: { name: true, email: true },
        },
      },
    });

    if (!review) {
      throw createError("Review not found", 404);
    }

    res.json({ data: review });
  }
);

export const createReview = handleAsyncError(
  async (req: Request, res: Response) => {
    const { bookId, rating, comment } = req.body;
    const userId = (req as any).user.id; // Get user ID from authenticated user

    // Check if user already reviewed this book
    const existingReview = await prisma.review.findFirst({
      where: { bookId, userId },
    });

    if (existingReview) {
      throw createError("You have already reviewed this book", 409);
    }

    // Verify book exists
    const book = await prisma.book.findUnique({ where: { id: bookId } });

    if (!book) {
      throw createError("Book not found", 404);
    }

    const review = await prisma.review.create({
      data: {
        bookId,
        userId,
        rating,
        comment,
      },
      include: {
        book: {
          select: { title: true, author: true },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Review created successfully",
      data: review,
    });
  }
);

export const updateReview = handleAsyncError(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = (req as any).user.id; // Get user ID from authenticated user

    // First, check if the review exists and belongs to the user
    const existingReview = await prisma.review.findUnique({
      where: { id },
      select: { userId: true, bookId: true },
    });

    if (!existingReview) {
      throw createError("Review not found", 404);
    }

    if (existingReview.userId !== userId) {
      throw createError("You can only update your own reviews", 403);
    }

    const review = await prisma.review.update({
      where: { id },
      data: { rating, comment },
      include: {
        book: {
          select: { title: true, author: true },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    res.json({
      message: "Review updated successfully",
      data: review,
    });
  }
);

export const deleteReview = handleAsyncError(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id; // Get user ID from authenticated user

    // First, check if the review exists and belongs to the user
    const existingReview = await prisma.review.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingReview) {
      throw createError("Review not found", 404);
    }

    if (existingReview.userId !== userId) {
      throw createError("You can only delete your own reviews", 403);
    }

    await prisma.review.delete({
      where: { id },
    });

    res.json({ message: "Review deleted successfully" });
  }
);

export const getMyReviews = handleAsyncError(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id; // Get user ID from authenticated user
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              genre: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({
        where: { userId },
      }),
    ]);

    // Calculate user's average rating
    const avgRatingResult = await prisma.review.aggregate({
      where: { userId },
      _avg: {
        rating: true,
      },
    });

    const averageRating = avgRatingResult._avg.rating
      ? Math.round(avgRatingResult._avg.rating * 10) / 10
      : 0;

    res.json({
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        totalReviews: total,
        averageRating,
      },
    });
  }
);

export const getReviewStats = handleAsyncError(
  async (req: Request, res: Response) => {
    const stats = await prisma.review.aggregate({
      _avg: { rating: true },
      _count: { rating: true },
      _max: { rating: true },
      _min: { rating: true },
    });

    // Get rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ["rating"],
      _count: { rating: true },
      orderBy: { rating: "asc" },
    });

    res.json({
      data: {
        averageRating: Math.round((stats._avg.rating || 0) * 10) / 10,
        totalReviews: stats._count.rating,
        maxRating: stats._max.rating,
        minRating: stats._min.rating,
        ratingDistribution: ratingDistribution.map((item) => ({
          rating: item.rating,
          count: item._count.rating,
        })),
      },
    });
  }
);
