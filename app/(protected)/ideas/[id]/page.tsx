import { getIdea } from '@app/actions/ideas'
import { GlassCard } from '@/components/glass-card'
import { StageBadge } from '@/components/badges'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DeleteIdeaButton } from './delete-idea-button'
import { Stage } from '@/types'

export default async function IdeaDetailPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const idea = await getIdea(params.id)

  if (!idea) {
    notFound()
  }

  const ideaAssumptions = idea.assumptions || []

  return (
    <div className="animate-fade-in mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/ideas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-foreground text-2xl font-bold">{idea.title}</h1>
            <StageBadge stage={idea.stage as Stage} />
          </div>
          <p className="text-muted-foreground">{idea.targetMarket}</p>
        </div>
        <DeleteIdeaButton id={idea.id} />
      </div>

      <GlassCard>
        <div className="space-y-6">
          <div>
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              Core Concept
            </h3>
            <p className="text-foreground">{idea.coreConcept}</p>
          </div>
          <div>
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              Problem to Solve
            </h3>
            <p className="text-foreground">{idea.problemToSolve}</p>
          </div>
          <div className="border-border border-t pt-4">
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              Primary Next Step
            </h3>
            <p className="text-primary font-medium">{idea.primaryNextStep}</p>
          </div>
        </div>
      </GlassCard>

      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-xl font-semibold">Assumptions</h2>
        <Link href={`/assumptions/new?ideaId=${idea.id}`}>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Add Assumption
          </Button>
        </Link>
      </div>

      {ideaAssumptions.length === 0 ? (
        <GlassCard className="py-8 text-center">
          <p className="text-muted-foreground mb-4">
            No assumptions yet. What must be true for this idea to work?
          </p>
          <Link href={`/assumptions/new?ideaId=${idea.id}`}>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
              Add First Assumption
            </Button>
          </Link>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {ideaAssumptions.map((assumption) => (
            <Link key={assumption.id} href={`/assumptions/${assumption.id}`}>
              <GlassCard hoverable className="py-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground font-medium">
                      {assumption.assumption}
                    </p>
                    <p className="text-muted-foreground mt-1 truncate text-sm">
                      {assumption.proposedExperiment}
                    </p>
                  </div>
                  <ArrowRight className="text-muted-foreground h-5 w-5" />
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
