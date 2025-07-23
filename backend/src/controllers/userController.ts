// src/controllers/userController.ts
import { Request, Response } from "express";
import { prisma } from "../config/database";
import { handleAsyncError, createError } from "../middleware/errorHandler";

export const getAllUsers = handleAsyncError(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          _count: {
            select: { reviews: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count(),
    ]);

    res.json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  }
);

export const getUserById = handleAsyncError(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        reviews: {
          include: {
            book: {
              select: { title: true, author: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      throw createError("User not found", 404);
    }

    res.json({ data: user });
  }
);

export const createUser = handleAsyncError(
  async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    const user = await prisma.user.create({
      data: { email, password, name },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  }
);

export const updateUser = handleAsyncError(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        updatedAt: true,
      },
    });

    res.json({
      message: "User updated successfully",
      data: user,
    });
  }
);

export const deleteUser = handleAsyncError(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: "User deleted successfully" });
  }
);

export const searchUsers = handleAsyncError(
  async (req: Request, res: Response) => {
    const { q: query } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!query) {
      throw createError("Search query is required", 400);
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query as string, mode: "insensitive" } },
          { email: { contains: query as string, mode: "insensitive" } },
        ],
      },
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: { reviews: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: users });
  }
);
