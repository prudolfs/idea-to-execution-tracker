import 'dotenv/config' // Loads .env variables
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle', // Directory for migration files (will be created at project root)
  schema: './db/schema.ts', // Path to your Drizzle schema, now directly in 'db'
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Use the URL from .env
  },
})
