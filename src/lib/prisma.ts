import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton to prevent multiple instances in development.
 * Explicitly handling DATABASE_URL from environment.
 */

const prismaClientSingleton = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    // If DATABASE_URL is missing, we don't throw immediately to avoid breaking build-time static analysis.
    // Prisma will throw an error if a query is actually attempted.
    console.warn("WARNING: DATABASE_URL is not defined in environment variables.");
    return new PrismaClient();
  }
  
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    // Enhanced logging for better debugging of connection issues
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'stdout' },
      { level: 'info', emit: 'stdout' },
      { level: 'warn', emit: 'stdout' },
    ],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

// @ts-ignore
prisma.$on('query', (e: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Query: ${e.query}`);
    console.log(`Params: ${e.params}`);
    console.log(`Duration: ${e.duration}ms`);
  }
});

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
