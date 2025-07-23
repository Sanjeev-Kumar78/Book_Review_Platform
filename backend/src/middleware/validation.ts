// src/middleware/validation.ts
import { body, param, query, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};

// User validation rules
export const validateCreateUser = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  handleValidationErrors,
];

export const validateUpdateUser = [
  param("id").isString().withMessage("Invalid user ID"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  handleValidationErrors,
];

// Authentication validation rules
export const validateRegister = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  handleValidationErrors,
];

export const validateLogin = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password").isLength({ min: 1 }).withMessage("Password is required"),
  handleValidationErrors,
];

// Book validation rules
export const validateCreateBook = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title is required and must be less than 200 characters"),
  body("author")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Author is required and must be less than 100 characters"),
  body("genre")
    .isArray({ min: 1 })
    .withMessage("At least one genre is required"),
  body("genre.*")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Each genre must be less than 50 characters"),
  body("published")
    .isISO8601()
    .withMessage("Please provide a valid publication date"),
  handleValidationErrors,
];

export const validateUpdateBook = [
  param("id").isString().withMessage("Invalid book ID"),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be less than 200 characters"),
  body("author")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Author must be less than 100 characters"),
  body("genre")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one genre is required"),
  body("genre.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Each genre must be less than 50 characters"),
  body("published")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid publication date"),
  handleValidationErrors,
];

// Review validation rules
export const validateCreateReview = [
  body("bookId").isString().withMessage("Book ID is required"),
  body("userId").isString().withMessage("User ID is required"),
  body("rating")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Comment must be less than 1000 characters"),
  handleValidationErrors,
];

export const validateUpdateReview = [
  param("id").isString().withMessage("Invalid review ID"),
  body("rating")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Comment must be less than 1000 characters"),
  handleValidationErrors,
];

// Query validation
export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  handleValidationErrors,
];

export const validateSearch = [
  query("q")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search query must be between 1 and 100 characters"),
  handleValidationErrors,
];
