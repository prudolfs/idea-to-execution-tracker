'use server'

import { db } from '@/db'
import { experiments, assumptions, ideas, results } from '@/db/schema'
import { auth } from '@/auth'
import { headers } from 'next/headers'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ExperimentStatus } from '@/types'

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  })
}

export async function getExperiments() {
  const session = await getSession()
  if (!session) return []

  const userIdeas = await db.query.ideas.findMany({
    where: eq(ideas.userId, session.user.id),
    with: {
      assumptions: {
        with: {
          experiments: {
            with: {
              results: true,
            },
          },
        },
      },
    },
  })

  // Flatten experiments from all ideas and assumptions
  const allExperiments = userIdeas.flatMap((idea) =>
    idea.assumptions.flatMap((assumption) =>
      assumption.experiments.map((experiment) => ({
        ...experiment,
        assumption: {
          id: assumption.id,
          assumption: assumption.assumption,
          ideaId: assumption.ideaId,
        },
        idea: {
          id: idea.id,
          title: idea.title,
        },
      })),
    ),
  )

  return allExperiments.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  )
}

export async function getExperiment(id: string) {
  const session = await getSession()
  if (!session) return null

  const experiment = await db.query.experiments.findFirst({
    where: eq(experiments.id, id),
    with: {
      assumption: {
        with: {
          idea: true,
        },
      },
      results: true,
    },
  })

  // Security check: ensure the idea belongs to the user
  if (!experiment || experiment.assumption.idea.userId !== session.user.id) {
    return null
  }

  return experiment
}

export async function createExperiment(data: {
  assumptionId: string
  name: string
  hypothesis: string
  steps: string[]
  status: ExperimentStatus
  startDate?: Date
  endDate?: Date
}) {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  // Verify assumption belongs to an idea owned by the user
  const assumption = await db.query.assumptions.findFirst({
    where: eq(assumptions.id, data.assumptionId),
    with: {
      idea: true,
    },
  })

  if (!assumption || assumption.idea.userId !== session.user.id) {
    throw new Error('Assumption not found or unauthorized')
  }

  const [newExperiment] = await db
    .insert(experiments)
    .values({
      ...data,
      steps: data.steps, // Ensure this matches schema type (json array of strings)
    })
    .returning()

  revalidatePath('/experiments')
  redirect('/experiments')
}

export async function updateExperiment(
  id: string,
  data: Partial<{
    name: string
    hypothesis: string
    steps: string[]
    status: ExperimentStatus
    startDate: Date
    endDate: Date
  }>,
) {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  const experiment = await getExperiment(id)
  if (!experiment) {
    throw new Error('Experiment not found or unauthorized')
  }

  await db.update(experiments).set(data).where(eq(experiments.id, id))

  revalidatePath('/experiments')
  revalidatePath(`/experiments/${id}`)
  redirect(`/experiments/${id}`)
}

export async function deleteExperiment(id: string) {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  const experiment = await getExperiment(id)
  if (!experiment) {
    throw new Error('Experiment not found or unauthorized')
  }

  await db.delete(experiments).where(eq(experiments.id, id))

  revalidatePath('/experiments')
  redirect('/experiments')
}
