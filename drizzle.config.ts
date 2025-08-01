import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL || 'postgresql://postgres:ojNDWIsN@127.0.0.1:5432/postgres',
  },
});
