// src/routes/reviewRoutes.ts
import { Router } from "express";
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewStats,
  getMyReviews,
} from "../controllers/reviewController";
import {
  validateCreateReview,
  validateUpdateReview,
  validatePagination,
} from "../middleware/validation";
import { authenticate } from "../middleware/auth";

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
 * @route   GET /api/reviews/my
 * @desc    Get current user's reviews
 * @access  Private
 */
router.get("/my", authenticate, validatePagination, getMyReviews);

/**
 * @route   GET /api/reviews/:id
 * @desc    Get review by ID
 * @access  Public
 */
router.get("/:id", getReviewById);

/**
 * @route   POST /api/reviews
 * @desc    Create new review
 * @access  Private
 */
router.post("/", authenticate, validateCreateReview, createReview);

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update review
 * @access  Private
 */
router.put("/:id", authenticate, validateUpdateReview, updateReview);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete review
 * @access  Private
 */
router.delete("/:id", authenticate, deleteReview);

export { router as reviewRoutes };
