import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle' // Verify this path in better-auth docs
import { db } from '@/db' // Import your Drizzle DB instance
import * as schema from '@/db/schema' // Import your Drizzle schema

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: schema,
  }), // Pass your db instance and schema
  emailAndPassword: {
    enabled: true,
    // Configure plugins if needed, e.g., organization(), twoFactor()
  },
  // Add other social login providers or features here
})
