import { PrismaClient } from "@prisma/client";

// Prevent multiple instances during hot-reloads in dev
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Uncomment the next line to see SQL queries in your terminal:
    // log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
