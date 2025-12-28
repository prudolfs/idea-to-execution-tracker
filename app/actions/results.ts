'use server'

import { db } from '@/db'
import { results, experiments, assumptions, ideas } from '@/db/schema'
import { auth } from '@/auth'
import { headers } from 'next/headers'
import { eq, InferSelectModel } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ResultOutcome } from '@/types'

export type ResultWithContext = InferSelectModel<typeof results> & {
  experiment: {
    id: string
    name: string
  }
  assumption: {
    id: string
    assumption: string
  }
  idea: {
    id: string
    title: string
  }
}

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  })
}

export async function getResults(): Promise<ResultWithContext[]> {
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

  // Flatten results from all ideas, assumptions, and experiments
  const allResults = userIdeas.flatMap((idea) =>
    idea.assumptions.flatMap((assumption) =>
      assumption.experiments.flatMap((experiment) =>
        experiment.results.map((result) => ({
          ...result,
          experiment: {
            id: experiment.id,
            name: experiment.name,
          },
          assumption: {
            id: assumption.id,
            assumption: assumption.assumption,
          },
          idea: {
            id: idea.id,
            title: idea.title,
          },
        })),
      ),
    ),
  )

  return allResults.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  )
}

export async function getResult(id: string) {
  const session = await getSession()
  if (!session) return null

  const result = await db.query.results.findFirst({
    where: eq(results.id, id),
    with: {
      experiment: {
        with: {
          assumption: {
            with: {
              idea: true,
            },
          },
        },
      },
    },
  })

  // Security check: ensure the idea belongs to the user
  if (!result || result.experiment.assumption.idea.userId !== session.user.id) {
    return null
  }

  return result
}

export async function createResult(data: {
  experimentId: string
  outcome: ResultOutcome
  keyInsight: string
  whatWorked: string
  whatDidnt: string
  evidence?: string
  nextAction: string
}) {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  // Verify experiment belongs to an idea owned by the user
  const experiment = await db.query.experiments.findFirst({
    where: eq(experiments.id, data.experimentId),
    with: {
      assumption: {
        with: {
          idea: true,
        },
      },
    },
  })

  if (!experiment || experiment.assumption.idea.userId !== session.user.id) {
    throw new Error('Experiment not found or unauthorized')
  }

  await db.insert(results).values(data)

  revalidatePath('/results')
  revalidatePath('/dashboard')
  revalidatePath(`/experiments/${data.experimentId}`)
  redirect('/results')
}

export async function deleteResult(id: string) {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  const result = await getResult(id)
  if (!result) {
    throw new Error('Result not found or unauthorized')
  }

  await db.delete(results).where(eq(results.id, id))

  revalidatePath('/results')
  revalidatePath('/dashboard')
}
