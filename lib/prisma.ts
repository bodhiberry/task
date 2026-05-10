import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import path from "path";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";

let adapter;

if (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://")) {
  const pool = new pg.Pool({ connectionString: dbUrl });
  adapter = new PrismaPg(pool);
} else {
  const dbPath = path.join(process.cwd(), dbUrl.replace("file:", ""));
  adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
