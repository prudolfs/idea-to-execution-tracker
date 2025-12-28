'use client'

import { updateExperiment } from '@/app/actions/experiments'
import { ExperimentStatus } from '@/types'
import { Button } from '@/components/ui/button'

export function ExperimentStatusUpdater({
  id,
  currentStatus,
}: {
  id: string
  currentStatus: ExperimentStatus
}) {
  const statuses: ExperimentStatus[] = ['planned', 'active', 'completed']

  const updateStatus = async (status: ExperimentStatus) => {
    await updateExperiment(id, { status })
  }

  return (
    <div className="flex gap-2">
      {statuses.map((status) => (
        <Button
          key={status}
          variant={currentStatus === status ? 'default' : 'outline'}
          size="sm"
          onClick={() => updateStatus(status)}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Button>
      ))}
    </div>
  )
}
