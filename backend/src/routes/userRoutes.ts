// src/routes/userRoutes.ts
import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
} from "../controllers/userController";
import {
  validateCreateUser,
  validateUpdateUser,
  validatePagination,
  validateSearch,
} from "../middleware/validation";

const router = Router();

/**
 * @route   GET /api/users
 * @desc    Get all users with pagination
 * @access  Public
 */
router.get("/", validatePagination, getAllUsers);

/**
 * @route   GET /api/users/search
 * @desc    Search users by name or email
 * @access  Public
 */
router.get("/search", validateSearch, validatePagination, searchUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get("/:id", getUserById);

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Public
 */
router.post("/", validateCreateUser, createUser);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Public
 */
router.put("/:id", validateUpdateUser, updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Public
 */
router.delete("/:id", deleteUser);

export { router as userRoutes };
