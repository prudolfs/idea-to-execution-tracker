import { getResults } from '@/app/actions/results'
import { GlassCard } from '@/components/glass-card'
import { OutcomeBadge } from '@/components/badges'
import { Button } from '@/components/ui/button'
import { BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { ResultOutcome } from '@/types'

export default async function ResultsPage() {
  const results = await getResults()

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold">Results</h1>
          <p className="text-muted-foreground mt-1">
            What did I actually learn?
          </p>
        </div>
      </div>

      {results.length === 0 ? (
        <GlassCard className="py-12 text-center">
          <BarChart3 className="text-muted-foreground/50 mx-auto mb-4 h-16 w-16" />
          <h2 className="text-foreground mb-2 text-xl font-semibold">
            No results yet
          </h2>
          <p className="text-muted-foreground mx-auto mb-6 max-w-md">
            Learning is the asset. Complete experiments to capture insights.
          </p>
          <Link href="/experiments">
            <Button variant="outline">View Experiments</Button>
          </Link>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {results.map((result) => {
            const { experiment, assumption, idea } = result

            return (
              <Link key={result.id} href={`/results/${result.id}`}>
                <GlassCard hoverable>
                  <div className="flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="text-muted-foreground mb-2 flex items-center gap-2">
                        <p className="text-sm">{idea.title}</p>
                        <span>→</span>
                        <p className="truncate text-sm">{experiment.name}</p>
                      </div>
                      <p className="text-foreground text-lg font-semibold">
                        {result.keyInsight}
                      </p>
                      <p className="text-muted-foreground mt-2 text-sm">
                        <span className="text-primary font-medium">
                          {result.nextAction}
                        </span>
                      </p>
                    </div>
                    <OutcomeBadge outcome={result.outcome as ResultOutcome} />
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
