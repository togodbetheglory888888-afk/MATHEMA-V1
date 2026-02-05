import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Ideally we'd throw if DATABASE_URL is missing, but for this in-memory app 
// we'll allow running without a DB provisioning.
// If we were using the DB, we'd enforce this check.
if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Database features will not work.");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL || "postgres://localhost:5432/postgres" });
export const db = drizzle(pool, { schema });
