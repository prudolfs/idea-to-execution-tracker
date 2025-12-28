// app/api/auth/[...better-auth]/route.ts
import { auth } from '@/auth' // Assuming auth.ts is at the root or within lib/ or utils/

// This line forces the Next.js API route to use the Node.js runtime.
// This is essential for better-auth to function correctly with its expected driver.
export const runtime = 'nodejs'

// better-auth will export request handlers for GET, POST, etc.
// You might need to import and re-export them or create specific handlers.
export const GET = auth.handler
export const POST = auth.handler
