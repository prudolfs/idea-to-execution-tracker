'use client'

import { deleteResult } from '@app/actions/results'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export function DeleteResultButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this result?')) {
      await deleteResult(id)
    }
  }

  return (
    <Button variant="destructive" size="icon" onClick={handleDelete}>
      <Trash2 className="h-5 w-5" />
    </Button>
  )
}
