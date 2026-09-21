import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Add it to your .env.local (local dev) or " +
      "the host's environment variables (production)."
  );
}

const client = postgres(process.env.DATABASE_URL);

export const db = drizzle(client, { schema });
