import { neon, neonConfig } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// This is an optional configuration for the neon driver, useful for local testing
// neonConfig.fetch = undefined; // Or enable for Edge runtime

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

const sql = neon(process.env.DATABASE_URL)
export const db = drizzle(sql, { schema })
