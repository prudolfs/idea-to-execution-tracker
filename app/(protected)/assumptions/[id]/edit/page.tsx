import { getAssumption } from '@app/actions/assumptions'
import { getIdeas } from '@app/actions/ideas'
import { AssumptionForm } from '../../assumption-form'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditAssumptionPage({ params }: PageProps) {
  const { id } = await params
  const [assumption, ideas] = await Promise.all([getAssumption(id), getIdeas()])

  if (!assumption) {
    notFound()
  }

  return <AssumptionForm ideas={ideas} initialData={assumption} />
}
