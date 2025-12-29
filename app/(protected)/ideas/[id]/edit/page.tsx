import { getIdea } from '@app/actions/ideas'
import { IdeaForm } from '../../idea-form'
import { notFound } from 'next/navigation'
import { Stage } from '@/types'

export default async function EditIdeaPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const idea = await getIdea(params.id)

  if (!idea) {
    notFound()
  }

  return (
    <IdeaForm
      initialData={{
        id: idea.id,
        title: idea.title,
        targetMarket: idea.targetMarket,
        coreConcept: idea.coreConcept,
        problemToSolve: idea.problemToSolve,
        stage: idea.stage as Stage,
        primaryNextStep: idea.primaryNextStep,
      }}
    />
  )
}
