import { getExperiments } from '@/app/actions/experiments'
import { getAssumptions } from '@/app/actions/assumptions'
import { GlassCard } from '@/components/glass-card'
import { StatusBadge } from '@/components/badges'
import { Button } from '@/components/ui/button'
import { Plus, FlaskConical, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ExperimentStatus } from '@/types'

export default async function ExperimentsPage() {
  const experiments = await getExperiments()
  const assumptions = await getAssumptions()

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold">Experiments</h1>
          <p className="text-muted-foreground mt-1">
            How do I test this cheaply?
          </p>
        </div>
        <Link href="/experiments/new">
          <Button disabled={assumptions.length === 0}>
            <Plus className="mr-2 h-5 w-5" />
            New Experiment
          </Button>
        </Link>
      </div>

      {experiments.length === 0 ? (
        <GlassCard className="py-12 text-center">
          <FlaskConical className="text-muted-foreground/50 mx-auto mb-4 h-16 w-16" />
          <h2 className="text-foreground mb-2 text-xl font-semibold">
            No experiments yet
          </h2>
          <p className="text-muted-foreground mx-auto mb-6 max-w-md">
            Turn assumptions into action. Keep experiments small and focused.
          </p>
          {assumptions.length > 0 ? (
            <Link href="/experiments/new">
              <Button>
                <Plus className="mr-2 h-5 w-5" />
                Add First Experiment
              </Button>
            </Link>
          ) : (
            <Link href="/assumptions/new">
              <Button variant="outline">Add an assumption first</Button>
            </Link>
          )}
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {experiments.map((experiment) => {
            // @ts-ignore - The action returns flattened structure but TS might not infer it perfectly without explicit type
            const result = experiment.results?.[0]

            return (
              <Link
                key={experiment.id}
                href={`/experiments/${experiment.id}`}
                className="block transition-transform hover:scale-[1.01]"
              >
                <GlassCard hoverable>
                  <div className="flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        {/* @ts-ignore */}
                        <p className="text-muted-foreground text-sm">
                          {experiment.idea.title}
                        </p>
                        <span className="text-muted-foreground">→</span>
                        {/* @ts-ignore */}
                        <p className="text-muted-foreground truncate text-sm">
                          {experiment.assumption.assumption}
                        </p>
                      </div>
                      <p className="text-foreground text-lg font-semibold">
                        {experiment.name}
                      </p>
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                        {experiment.hypothesis}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge
                        status={experiment.status as ExperimentStatus}
                      />
                      {result && (
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            result.outcome === 'validated'
                              ? 'bg-success/10 text-success'
                              : result.outcome === 'invalidated'
                                ? 'bg-destructive/10 text-destructive'
                                : 'bg-inconclusive/10 text-inconclusive'
                          }`}
                        >
                          {result.outcome}
                        </span>
                      )}
                      <ArrowRight className="text-muted-foreground mt-2 h-5 w-5" />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
