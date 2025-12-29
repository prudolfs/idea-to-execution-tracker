import { getExperiment } from '@app/actions/experiments'
import { GlassCard } from '@/components/glass-card'
import { StatusBadge } from '@/components/badges'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { DeleteExperimentButton } from './delete-experiment-button'
import { ExperimentStatusUpdater } from './experiment-status-updater'
import { notFound } from 'next/navigation'
import { ExperimentStatus } from '@/types'

export default async function ExperimentDetailPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const experiment = await getExperiment(params.id)

  if (!experiment) {
    notFound()
  }

  const result = experiment.results?.[0]

  return (
    <div className="animate-fade-in mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/experiments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="text-muted-foreground mb-1 flex items-center gap-2 text-sm">
            <span>{experiment.assumption.idea.title}</span>
            <span>→</span>
            <span className="truncate">{experiment.assumption.assumption}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-foreground text-2xl font-bold">
              {experiment.name}
            </h1>
            <StatusBadge status={experiment.status as ExperimentStatus} />
          </div>
        </div>
        <DeleteExperimentButton id={experiment.id} />
      </div>

      <GlassCard>
        <div className="space-y-6">
          <div>
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              Hypothesis
            </h3>
            <p className="text-foreground">{experiment.hypothesis}</p>
          </div>

          <div>
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              Step-by-Step Plan
            </h3>
            <ol className="space-y-2">
              {experiment.steps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-primary font-semibold">
                    {index + 1}.
                  </span>
                  <span className="text-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="border-border border-t pt-4">
            <h3 className="text-muted-foreground mb-3 text-sm font-medium">
              Update Status
            </h3>
            <ExperimentStatusUpdater
              id={experiment.id}
              currentStatus={experiment.status as ExperimentStatus}
            />
          </div>
        </div>
      </GlassCard>

      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-xl font-semibold">Result</h2>
        {!result && experiment.status === 'completed' && (
          <Link href={`/results/new?experimentId=${experiment.id}`}>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Record Result
            </Button>
          </Link>
        )}
      </div>

      {result ? (
        <Link href={`/results/${result.id}`}>
          <GlassCard hoverable>
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`font-medium ${
                    result.outcome === 'validated'
                      ? 'text-success'
                      : result.outcome === 'invalidated'
                        ? 'text-destructive'
                        : 'text-inconclusive'
                  }`}
                >
                  {result.outcome.charAt(0).toUpperCase() +
                    result.outcome.slice(1)}
                </p>
                <p className="text-foreground mt-1">{result.keyInsight}</p>
              </div>
              <ArrowRight className="text-muted-foreground h-5 w-5" />
            </div>
          </GlassCard>
        </Link>
      ) : experiment.status === 'completed' ? (
        <GlassCard className="py-8 text-center">
          <p className="text-muted-foreground mb-4">
            Experiment completed! Capture what you learned.
          </p>
          <Link href={`/results/new?experimentId=${experiment.id}`}>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Record Result
            </Button>
          </Link>
        </GlassCard>
      ) : (
        <GlassCard className="py-8 text-center">
          <p className="text-muted-foreground">
            Complete the experiment to record results
          </p>
        </GlassCard>
      )}
    </div>
  )
}
