'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteAssumption } from '@app/actions/assumptions'

export function DeleteAssumptionButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this assumption?')) {
      setIsDeleting(true)
      try {
        await deleteAssumption(id)
        // Redirect handled by server action
      } catch (error) {
        console.error('Failed to delete assumption:', error)
        setIsDeleting(false)
      }
    }
  }

  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="h-5 w-5" />
    </Button>
  )
}
