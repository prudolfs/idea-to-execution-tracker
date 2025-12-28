import Link from 'next/link'
import { Plus, HelpCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/glass-card'
import { ConfidenceSlider } from '@/components/confidence-slider'
import { getAssumptions } from '@/app/actions/assumptions'
import { getIdeas } from '@/app/actions/ideas'

export const dynamic = 'force-dynamic'

export default async function AssumptionsPage() {
  const [assumptionsList, ideasList] = await Promise.all([
    getAssumptions(),
    getIdeas()
  ])

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assumptions</h1>
          <p className="text-muted-foreground mt-1">What must be true for this to work?</p>
        </div>
        <Link href="/assumptions/new" passHref>
          <Button disabled={ideasList.length === 0}>
            <Plus className="h-5 w-5 mr-2" />
            New Assumption
          </Button>
        </Link>
      </div>

      {assumptionsList.length === 0 ? (
        <GlassCard className="text-center py-12">
          <HelpCircle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No assumptions yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Most founders fail because assumptions stay implicit. Make your hidden beliefs explicit.
          </p>
          {ideasList.length > 0 ? (
            <Link href="/assumptions/new">
              <Button>
                <Plus className="h-5 w-5 mr-2" />
                Add First Assumption
              </Button>
            </Link>
          ) : (
            <Link href="/ideas/new">
              <Button variant="outline">Add an idea first</Button>
            </Link>
          )}
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {assumptionsList.map((assumption) => {
            // assumptionsList items have { idea: { id, title }, experiments: [...] }
            // Logic for finding the "relevant" experiment/result:
            // The original code took the first experiment found for the assumption?
            // "getExperimentForAssumption" was just "find".
            const experiment = assumption.experiments?.[0]
            const result = experiment?.results?.[0] // Assuming one result per experiment for now or taking first

            return (
              <Link key={assumption.id} href={`/assumptions/${assumption.id}`} className="block">
                <GlassCard hoverable>
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground mb-1">{assumption.idea?.title || "Unknown idea"}</p>
                      <p className="font-semibold text-foreground text-lg">{assumption.assumption}</p>
                      <ConfidenceSlider value={assumption.confidenceLevel} readonly className="mt-4 max-w-xs" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {experiment && (
                        <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">Has experiment</span>
                      )}
                      {result && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          result.outcome === "validated" ? "bg-success/10 text-success" :
                          result.outcome === "invalidated" ? "bg-destructive/10 text-destructive" :
                          "bg-inconclusive/10 text-inconclusive"
                        }`}>
                          {result.outcome}
                        </span>
                      )}
                      <ArrowRight className="h-5 w-5 text-muted-foreground mt-2" />
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
