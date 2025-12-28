import { getAssumptions } from '@/app/actions/assumptions'
import { ExperimentForm } from './experiment-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function NewExperimentPage() {
  const assumptions = await getAssumptions()

  return (
    <div className="animate-fade-in mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/experiments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-foreground text-2xl font-bold">New Experiment</h1>
          <p className="text-muted-foreground">
            Turn assumptions into action, fast
          </p>
        </div>
      </div>

      <ExperimentForm assumptions={assumptions} />
    </div>
  )
}
