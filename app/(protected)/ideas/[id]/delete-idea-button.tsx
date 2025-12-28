'use client'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { deleteIdea } from '@/app/actions/ideas'
import { useState } from 'react'

export function DeleteIdeaButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (
      confirm(
        'Are you sure you want to delete this idea and all its assumptions?',
      )
    ) {
      setIsDeleting(true)
      try {
        await deleteIdea(id)
      } catch (error) {
        console.error('Failed to delete idea:', error)
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
