'use server'

import { db } from '@/db'
import { assumptions, experiments, ideas, results } from '@/db/schema'
import { auth } from '@/auth'
import { headers } from 'next/headers'
import { eq, desc, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  })
}

export async function getAssumptions() {
  const session = await getSession()
  if (!session) return []

  // We need to filter assumptions by user. 
  // Assumptions are linked to Ideas, which are linked to Users.
  // So we need to query assumptions where the related idea belongs to the user.
  // However, Drizzle's query builder with 'with' doesn't easily support deep filtering like "where idea.userId = ...".
  // A cleaner way is to find all ideas for the user first, then finding assumptions, 
  // OR use a join if we were using select().
  // But db.query is convenient for nested relations.
  // Let's use db.query.assumptions.findMany but we need to ensure they belong to the user.
  
  // Actually, let's just fetch all ideas for the user with their assumptions, then flatten?
  // Or use db.select().from(assumptions).innerJoin(ideas, ...).where(...)
  
  // Let's try the db.query approach filtering by idea ownership validation or just fetching via ideas.
  // The 'ideas' query is:
  /*
  const userIdeas = await db.query.ideas.findMany({
    where: eq(ideas.userId, session.user.id),
    with: {
      assumptions: {
        with: {
          experiments: {
             with: { results: true }
          }
        }
      }
    }
  })
  */
  // Then we can flatten this list.
  
  const userIdeas = await db.query.ideas.findMany({
    where: eq(ideas.userId, session.user.id),
    with: {
      assumptions: {
        with: {
          experiments: {
            with: {
              results: true
            }
          }
        }
      }
    }
  })
  
  // Flatten assumptions from all ideas
  const allAssumptions = userIdeas.flatMap(idea => 
    idea.assumptions.map(assumption => ({
      ...assumption,
      idea: { id: idea.id, title: idea.title }, // Attach minimal idea info
    }))
  )
  
  // Sort by created at desc (assumptions don't have createdAt in the schema shown previously? Let me double check schema)
  // Schema check: assumptions has createdAt.
  
  return allAssumptions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function getAssumption(id: string) {
  const session = await getSession()
  if (!session) return null

  const assumption = await db.query.assumptions.findFirst({
    where: eq(assumptions.id, id),
    with: {
      idea: true,
      experiments: {
        with: {
          results: true
        }
      }
    }
  })

  // Security check: ensure the idea belongs to the user
  if (!assumption || assumption.idea.userId !== session.user.id) {
    return null
  }

  return assumption
}

export async function createAssumption(data: {
  ideaId: string
  assumption: string
  confidenceLevel: number
  whyItMatters?: string
  proposedExperiment: string
}) {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  // Verify idea belongs to user
  const idea = await db.query.ideas.findFirst({
    where: and(eq(ideas.id, data.ideaId), eq(ideas.userId, session.user.id))
  })

  if (!idea) {
    throw new Error('Idea not found or unauthorized')
  }

  await db.insert(assumptions).values({
    ...data,
  })

  revalidatePath('/assumptions')
  revalidatePath(`/ideas/${data.ideaId}`)
  redirect('/assumptions')
}

export async function deleteAssumption(id: string) {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  const assumption = await getAssumption(id)
  if (!assumption) {
    throw new Error('Assumption not found or unauthorized')
  }

  await db.delete(assumptions).where(eq(assumptions.id, id))

  revalidatePath('/assumptions')
  revalidatePath(`/ideas/${assumption.ideaId}`)
  redirect('/assumptions')
}

