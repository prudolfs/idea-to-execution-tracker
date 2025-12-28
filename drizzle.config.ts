import { defineConfig } from 'drizzle-kit'
import fs from 'fs'
import path from 'path'

function loadEnv(filepath: string) {
  try {
    const content = fs.readFileSync(filepath, 'utf8')
    content.split('\n').forEach((line) => {
      const match = line.match(/^([^=]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        const value = match[2].trim().replace(/^["']|["']$/g, '') // naive unquote
        if (!process.env[key]) {
          process.env[key] = value
        }
      }
    })
  } catch (e) {
    // ignore
  }
}

loadEnv(path.join(process.cwd(), '.env.local'))
loadEnv(path.join(process.cwd(), '.env'))

export default defineConfig({
  out: './drizzle', // Directory for migration files (will be created at project root)
  schema: './db/schema.ts', // Path to your Drizzle schema, now directly in 'db'
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Use the URL from .env
  },
})
