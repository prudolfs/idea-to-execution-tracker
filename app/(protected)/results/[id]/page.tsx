import { getResult } from '@app/actions/results'
import { GlassCard } from '@/components/glass-card'
import { OutcomeBadge } from '@/components/badges'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DeleteResultButton } from './delete-result-button'
import { ResultOutcome } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ResultDetailPage({ params }: PageProps) {
  const { id } = await params
  const result = await getResult(id)

  if (!result) {
    notFound()
  }

  const { experiment } = result
  const { assumption } = experiment
  const { idea } = assumption

  return (
    <div className="animate-fade-in mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/results">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="text-muted-foreground mb-1 flex items-center gap-2 text-sm">
            <span>{idea.title}</span>
            <span>→</span>
            <span>{experiment.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-foreground text-2xl font-bold">
              {result.keyInsight}
            </h1>
            <OutcomeBadge outcome={result.outcome as ResultOutcome} />
          </div>
        </div>
        <DeleteResultButton id={result.id} />
      </div>

      <GlassCard>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                What Worked
              </h3>
              <p className="text-foreground">{result.whatWorked}</p>
            </div>
            <div>
              <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                What Didn't Work
              </h3>
              <p className="text-foreground">{result.whatDidnt}</p>
            </div>
          </div>

          {result.evidence && (
            <div>
              <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                Evidence
              </h3>
              <p className="text-foreground">{result.evidence}</p>
            </div>
          )}

          <div className="border-border border-t pt-4">
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              Next Action
            </h3>
            <p className="text-primary text-lg font-semibold">
              {result.nextAction}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Context Trail */}
      <GlassCard className="bg-secondary/30">
        <h3 className="text-muted-foreground mb-4 text-sm font-medium">
          Context Trail
        </h3>
        <div className="space-y-3">
          <Link
            href={`/ideas/${idea.id}`}
            className="bg-background/50 hover:bg-background block rounded-lg p-3 transition-colors"
          >
            <p className="text-muted-foreground text-xs">Idea</p>
            <p className="text-foreground font-medium">{idea.title}</p>
          </Link>
          <Link
            href={`/assumptions/${assumption.id}`}
            className="bg-background/50 hover:bg-background block rounded-lg p-3 transition-colors"
          >
            <p className="text-muted-foreground text-xs">Assumption</p>
            <p className="text-foreground font-medium">
              {assumption.assumption}
            </p>
          </Link>
          <Link
            href={`/experiments/${experiment.id}`}
            className="bg-background/50 hover:bg-background block rounded-lg p-3 transition-colors"
          >
            <p className="text-muted-foreground text-xs">Experiment</p>
            <p className="text-foreground font-medium">{experiment.name}</p>
          </Link>
        </div>
      </GlassCard>
    </div>
  )
}
