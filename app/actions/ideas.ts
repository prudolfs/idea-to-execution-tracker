'use server'

import { db } from '@/db'
import { ideas } from '@/db/schema'
import { auth } from '@/auth' // Verify if this is the correct import for server-side auth
import { headers } from 'next/headers'
import { eq, desc, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Stage } from '@/types'

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  })
}

export async function getIdeas() {
  const session = await getSession()
  if (!session) return []

  return await db.query.ideas.findMany({
    where: eq(ideas.userId, session.user.id),
    orderBy: [desc(ideas.createdAt)],
  })
}

export async function getIdea(id: string) {
  const session = await getSession()
  if (!session) return null

  return await db.query.ideas.findFirst({
    where: and(eq(ideas.id, id), eq(ideas.userId, session.user.id)),
    with: {
      assumptions: true,
    },
  })
}

export async function createIdea(data: {
  title: string
  targetMarket: string
  coreConcept: string
  problemToSolve: string
  stage: Stage
  primaryNextStep: string
}) {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  const [newIdea] = await db
    .insert(ideas)
    .values({
      ...data,
      userId: session.user.id,
    })
    .returning()

  revalidatePath('/ideas')
  redirect('/ideas')
}

export async function updateIdea(
  id: string,
  data: {
    title: string
    targetMarket: string
    coreConcept: string
    problemToSolve: string
    stage: Stage
    primaryNextStep: string
  },
) {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  await db
    .update(ideas)
    .set(data)
    .where(and(eq(ideas.id, id), eq(ideas.userId, session.user.id)))

  revalidatePath('/ideas')
  revalidatePath(`/ideas/${id}`)
  redirect(`/ideas/${id}`)
}

export async function deleteIdea(id: string) {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  await db
    .delete(ideas)
    .where(and(eq(ideas.id, id), eq(ideas.userId, session.user.id)))

  revalidatePath('/ideas')
  redirect('/ideas') // Or just return if called from a list
}
