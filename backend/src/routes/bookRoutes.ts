// src/routes/bookRoutes.ts
import { Router } from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
  getBooksByGenre,
} from "../controllers/bookController";
import {
  validateCreateBook,
  validateUpdateBook,
  validatePagination,
  validateSearch,
} from "../middleware/validation";

const router = Router();

/**
 * @route   GET /api/books
 * @desc    Get all books with pagination and optional genre filter
 * @access  Public
 */
router.get("/", validatePagination, getAllBooks);

/**
 * @route   GET /api/books/search
 * @desc    Search books by title, author, or genre
 * @access  Public
 */
router.get("/search", validateSearch, validatePagination, searchBooks);

/**
 * @route   GET /api/books/genres
 * @desc    Get all genres with book counts
 * @access  Public
 */
router.get("/genres", getBooksByGenre);

/**
 * @route   GET /api/books/:id
 * @desc    Get book by ID with reviews
 * @access  Public
 */
router.get("/:id", getBookById);

/**
 * @route   POST /api/books
 * @desc    Create new book
 * @access  Public
 */
router.post("/", validateCreateBook, createBook);

/**
 * @route   PUT /api/books/:id
 * @desc    Update book
 * @access  Public
 */
router.put("/:id", validateUpdateBook, updateBook);

/**
 * @route   DELETE /api/books/:id
 * @desc    Delete book
 * @access  Public
 */
router.delete("/:id", deleteBook);

export { router as bookRoutes };
