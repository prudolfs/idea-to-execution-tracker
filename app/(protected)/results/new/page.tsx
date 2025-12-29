import { getExperiments } from '@app/actions/experiments'
import { ResultForm } from './result-form'

interface PageProps {
  searchParams: Promise<{ experimentId?: string }>
}

export default async function NewResultPage({ searchParams }: PageProps) {
  const experiments = await getExperiments()
  const { experimentId } = await searchParams

  const completedExperiments = experiments.filter(
    (e) => e.status === 'completed',
  )

  return (
    <ResultForm
      experiments={completedExperiments}
      preselectedExperimentId={experimentId}
    />
  )
}
