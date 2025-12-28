'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteExperiment } from '@/app/actions/experiments'

export function DeleteExperimentButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this experiment?')) {
      await deleteExperiment(id)
    }
  }

  return (
    <Button variant="destructive" size="icon" onClick={handleDelete}>
      <Trash2 className="h-5 w-5" />
    </Button>
  )
}
