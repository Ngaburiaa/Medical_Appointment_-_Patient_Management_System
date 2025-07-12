import "dotenv/config";
import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const client = new Client({
  connectionString: process.env.DATABASE_URL as string,
  ssl: {
    rejectUnauthorized: false, // required for hosted DBs like Neon
  },
});

const main = async () => {
  await client.connect(); // Connect to the database
};

main().catch(console.error);

export const db = drizzle(client, { schema, logger: true });
