import { PrismaClient } from "@prisma/client";

// Mẫu Singleton: Đảm bảo chỉ mở 1 kết nối duy nhất đến PostgreSQL
// để tránh lỗi tràn kết nối (Connection Pool Limit) khi Next.js reload trong môi trường dev.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;