import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Trash2, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/glass-card'
import { ConfidenceSlider } from '@/components/confidence-slider'
import { getAssumption } from '@/app/actions/assumptions'
import { DeleteAssumptionButton } from './delete-assumption-button'

export default async function AssumptionDetailPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const assumption = await getAssumption(params.id)

  if (!assumption) {
    notFound()
  }

  const { idea, experiments } = assumption
  // We can show all experiments or just the first one if we want to mimic the old behavior, 
  // but it's better to show all if the schema supports it.
  
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/assumptions">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <Link href={`/ideas/${idea.id}`} className="hover:underline">
            <p className="text-sm text-muted-foreground">{idea.title}</p>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{assumption.assumption}</h1>
        </div>
        <DeleteAssumptionButton id={assumption.id} />
      </div>

      <GlassCard>
        <div className="space-y-6">
          <ConfidenceSlider value={assumption.confidenceLevel} readonly />
          
          {assumption.whyItMatters && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Why This Matters</h3>
              <p className="text-foreground">{assumption.whyItMatters}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Proposed Experiment</h3>
            <p className="text-foreground">{assumption.proposedExperiment}</p>
          </div>
        </div>
      </GlassCard>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Experiments</h2>
        <Link href={`/experiments/new?assumptionId=${assumption.id}`}>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Create Experiment
          </Button>
        </Link>
      </div>

      {experiments && experiments.length > 0 ? (
        <div className="space-y-4">
          {experiments.map((experiment) => (
            <Link key={experiment.id} href={`/experiments/${experiment.id}`} className="block">
              <GlassCard hoverable>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{experiment.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{experiment.hypothesis}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      ) : (
        <GlassCard className="text-center py-8">
          <p className="text-muted-foreground mb-4">No experiments yet. Turn this assumption into action.</p>
          <Link href={`/experiments/new?assumptionId=${assumption.id}`}>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
              Create Experiment
            </Button>
          </Link>
        </GlassCard>
      )}
    </div>
  )
}

