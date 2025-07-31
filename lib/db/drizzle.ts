import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.POSTGRES_URL || `postgresql://postgres:ojNDWIsN@127.0.0.1:5432/postgres`;

const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client);
