
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

let prisma: any = null;

if (typeof window === "undefined" && process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("mongodb+srv")) {
  if (!globalThis.prisma) {
    globalThis.prisma = prismaClientSingleton();
  }
  prisma = globalThis.prisma;
}

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
