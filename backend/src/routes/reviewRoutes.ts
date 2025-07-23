// src/routes/reviewRoutes.ts
import { Router } from "express";
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewStats,
} from "../controllers/reviewController";
import {
  validateCreateReview,
  validateUpdateReview,
  validatePagination,
} from "../middleware/validation";

const router = Router();

/**
 * @route   GET /api/reviews
 * @desc    Get all reviews with pagination and optional filters
 * @access  Public
 */
router.get("/", validatePagination, getAllReviews);

/**
 * @route   GET /api/reviews/stats
 * @desc    Get review statistics
 * @access  Public
 */
router.get("/stats", getReviewStats);

/**
 * @route   GET /api/reviews/:id
 * @desc    Get review by ID
 * @access  Public
 */
router.get("/:id", getReviewById);

/**
 * @route   POST /api/reviews
 * @desc    Create new review
 * @access  Public
 */
router.post("/", validateCreateReview, createReview);

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update review
 * @access  Public
 */
router.put("/:id", validateUpdateReview, updateReview);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete review
 * @access  Public
 */
router.delete("/:id", deleteReview);

export { router as reviewRoutes };
