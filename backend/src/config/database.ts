// src/config/database.ts
import { PrismaClient } from "../../generated/prisma";

export const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

// Graceful shutdown handler
export const disconnectDatabase = async () => {
  console.log("Disconnecting from database...");
  await prisma.$disconnect();
};

export default prisma;
