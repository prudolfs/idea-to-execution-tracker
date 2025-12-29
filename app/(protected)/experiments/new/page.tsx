import { getAssumptions } from '@app/actions/assumptions'
import { ExperimentForm } from './experiment-form'

export default async function NewExperimentPage() {
  const assumptions = await getAssumptions()

  return <ExperimentForm assumptions={assumptions} />
}
