import { PrismaClient } from '@prisma/client'

// Source - https://stackoverflow.com/a
// Posted by Mikloo
// Retrieved 2025-11-09, License - CC BY-SA 4.0

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ log: ["query"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
