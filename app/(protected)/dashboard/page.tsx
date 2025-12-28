import { auth } from '@/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { ideas } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { MetricCard } from '@/components/metric-card'
import { GlassCard } from '@/components/glass-card'
import { StageBadge, OutcomeBadge } from '@/components/badges'
import { Button } from '@/components/ui/button'
import {
  Lightbulb,
  HelpCircle,
  FlaskConical,
  BarChart3,
  Plus,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { Stage, ResultOutcome } from '@/types'

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/signin')
  }

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

  const allIdeas = userIdeas
  const allAssumptions = userIdeas.flatMap((i) => i.assumptions)
  const allExperiments = allAssumptions.flatMap((a) => a.experiments)
  const allResults = allExperiments.flatMap((e) => e.results)

  const validatedCount = allResults.filter(
    (r) => r.outcome === 'validated',
  ).length
  const invalidatedCount = allResults.filter(
    (r) => r.outcome === 'invalidated',
  ).length
  const activeExperiments = allExperiments.filter(
    (e) => e.status === 'active',
  ).length

  const recentIdeas = [...allIdeas]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3)

  const recentResults = [...allResults]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3)

  const getIdeaForResult = (experimentId: string) => {
    const experiment = allExperiments.find((e) => e.id === experimentId)
    if (!experiment) return null
    const assumption = allAssumptions.find(
      (a) => a.id === experiment.assumptionId,
    )
    if (!assumption) return null
    return allIdeas.find((i) => i.id === assumption.ideaId)
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your validation journey
          </p>
        </div>
        <Link href="/ideas/new">
          <Button size="lg">
            <Plus className="h-5 w-5" />
            New Idea
          </Button>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Ideas"
          value={allIdeas.length}
          icon={Lightbulb}
        />
        <MetricCard
          label="Assumptions"
          value={allAssumptions.length}
          icon={HelpCircle}
          trendValue={`${validatedCount} validated`}
          trend={validatedCount > 0 ? 'up' : 'neutral'}
        />
        <MetricCard
          label="Active Experiments"
          value={activeExperiments}
          icon={FlaskConical}
        />
        <MetricCard
          label="Results"
          value={allResults.length}
          icon={BarChart3}
          trendValue={`${validatedCount}✓ ${invalidatedCount}✗`}
          trend="neutral"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Ideas */}
        <GlassCard>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-foreground text-lg font-semibold">
              Recent Ideas
            </h2>
            <Link href="/ideas">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {recentIdeas.length === 0 ? (
            <div className="py-8 text-center">
              <Lightbulb className="text-muted-foreground/50 mx-auto mb-3 h-12 w-12" />
              <p className="text-muted-foreground">No ideas yet</p>
              <Link href="/ideas/new">
                <Button variant="outline" size="sm" className="mt-3">
                  Add your first idea
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentIdeas.map((idea) => (
                <Link key={idea.id} href={`/ideas/${idea.id}`}>
                  <div className="bg-secondary/50 hover:bg-secondary cursor-pointer rounded-lg p-4 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-foreground truncate font-medium">
                          {idea.title}
                        </h3>
                        <p className="text-muted-foreground mt-1 truncate text-sm">
                          {idea.targetMarket}
                        </p>
                      </div>
                      <StageBadge stage={idea.stage as Stage} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Recent Results */}
        <GlassCard>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-foreground text-lg font-semibold">
              Recent Insights
            </h2>
            <Link href="/results">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {recentResults.length === 0 ? (
            <div className="py-8 text-center">
              <BarChart3 className="text-muted-foreground/50 mx-auto mb-3 h-12 w-12" />
              <p className="text-muted-foreground">No results yet</p>
              <p className="text-muted-foreground/70 mt-1 text-sm">
                Run experiments to capture insights
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentResults.map((result) => {
                const idea = getIdeaForResult(result.experimentId)
                return (
                  <Link key={result.id} href={`/results/${result.id}`}>
                    <div className="bg-secondary/50 hover:bg-secondary cursor-pointer rounded-lg p-4 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-muted-foreground text-sm">
                            {idea?.title || 'Unknown idea'}
                          </p>
                          <p className="text-foreground mt-1 line-clamp-2 font-medium">
                            {result.keyInsight}
                          </p>
                        </div>
                        <OutcomeBadge
                          outcome={result.outcome as ResultOutcome}
                        />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Quick Actions */}
      {allIdeas.length === 0 && (
        <GlassCard className="py-12 text-center">
          <div className="mx-auto max-w-md">
            <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
              <FlaskConical className="text-primary h-8 w-8" />
            </div>
            <h2 className="text-foreground mb-2 text-xl font-bold">
              Start Validating
            </h2>
            <p className="text-muted-foreground mb-6">
              Turn your startup idea into validated decisions through structured
              assumptions, experiments, and results.
            </p>
            <Link href="/ideas/new">
              <Button size="lg" className="glow-primary">
                <Plus className="h-5 w-5" />
                Add Your First Idea
              </Button>
            </Link>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
