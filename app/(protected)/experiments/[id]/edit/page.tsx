import { getExperiment } from '@app/actions/experiments'
import { getAssumptions } from '@app/actions/assumptions'
import { ExperimentForm } from '../../new/experiment-form'
import { notFound } from 'next/navigation'

export default async function EditExperimentPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const [experiment, assumptions] = await Promise.all([
    getExperiment(params.id),
    getAssumptions(),
  ])

  if (!experiment) {
    notFound()
  }

  return <ExperimentForm assumptions={assumptions} initialData={experiment} />
}
