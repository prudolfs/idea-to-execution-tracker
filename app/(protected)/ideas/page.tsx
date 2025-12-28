import { getIdeas } from '@/app/actions/ideas'
import { GlassCard } from '@/components/glass-card'
import { StageBadge } from '@/components/badges'
import { Button } from '@/components/ui/button'
import { Plus, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import { Stage } from '@/types'

export default async function IdeasPage() {
  const ideas = await getIdeas()

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold">Ideas</h1>
          <p className="text-muted-foreground mt-1">
            What are you trying to build?
          </p>
        </div>
        <Link href="/ideas/new">
          <Button>
            <Plus className="h-5 w-5" />
            New Idea
          </Button>
        </Link>
      </div>

      {ideas.length === 0 ? (
        <GlassCard className="py-12 text-center">
          <Lightbulb className="text-muted-foreground/50 mx-auto mb-4 h-16 w-16" />
          <h2 className="text-foreground mb-2 text-xl font-semibold">
            No ideas yet
          </h2>
          <p className="text-muted-foreground mx-auto mb-6 max-w-md">
            Start by adding your first startup idea. This prevents "idea drift"
            and gives all assumptions a shared anchor.
          </p>
          <Link href="/ideas/new">
            <Button>
              <Plus className="h-5 w-5" />
              Add Your First Idea
            </Button>
          </Link>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <Link key={idea.id} href={`/ideas/${idea.id}`}>
              <GlassCard hoverable>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <h3 className="text-foreground line-clamp-2 text-lg font-semibold">
                    {idea.title}
                  </h3>
                  <StageBadge stage={idea.stage as Stage} />
                </div>
                <p className="text-muted-foreground mb-3 text-sm">
                  {idea.targetMarket}
                </p>
                <p className="text-foreground/80 line-clamp-3 text-sm">
                  {idea.coreConcept}
                </p>
                <div className="border-border mt-4 border-t pt-4">
                  <p className="text-muted-foreground text-xs">Next step:</p>
                  <p className="text-primary truncate text-sm font-medium">
                    {idea.primaryNextStep}
                  </p>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
