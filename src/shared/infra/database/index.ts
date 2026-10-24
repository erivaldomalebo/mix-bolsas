import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../config/env.config";
import { PrismaClient } from "./generated/prisma/client";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

const db = new PrismaClient({ adapter });

export { db };
export * from "./generated/prisma/client";
