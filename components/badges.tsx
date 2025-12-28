import { cn } from '@/lib/utils'
import { Stage, ExperimentStatus, ResultOutcome } from '@/types'

interface StageBadgeProps {
  stage: Stage
  className?: string
}

const stageConfig: Record<Stage, { label: string; className: string }> = {
  idea: { label: 'Idea', className: 'bg-secondary text-muted-foreground' },
  testing: { label: 'Testing', className: 'bg-warning/20 text-warning' },
  validation: { label: 'Validation', className: 'bg-primary/20 text-primary' },
  launch: { label: 'Launch', className: 'bg-success/20 text-success' },
}

export function StageBadge({ stage, className }: StageBadgeProps) {
  const config = stageConfig[stage]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}

interface StatusBadgeProps {
  status: ExperimentStatus
  className?: string
}

const statusConfig: Record<
  ExperimentStatus,
  { label: string; className: string }
> = {
  planned: {
    label: 'Planned',
    className: 'bg-secondary text-muted-foreground',
  },
  active: { label: 'Active', className: 'bg-primary/20 text-primary' },
  completed: { label: 'Completed', className: 'bg-success/20 text-success' },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}

interface OutcomeBadgeProps {
  outcome: ResultOutcome
  className?: string
}

const outcomeConfig: Record<
  ResultOutcome,
  { label: string; className: string; icon: string }
> = {
  validated: {
    label: 'Validated',
    className: 'bg-success/20 text-success',
    icon: '✓',
  },
  invalidated: {
    label: 'Invalidated',
    className: 'bg-destructive/20 text-destructive',
    icon: '✗',
  },
  inconclusive: {
    label: 'Inconclusive',
    className: 'bg-inconclusive/20 text-inconclusive',
    icon: '?',
  },
}

export function OutcomeBadge({ outcome, className }: OutcomeBadgeProps) {
  const config = outcomeConfig[outcome]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
        config.className,
        className,
      )}
    >
      <span className="text-sm">{config.icon}</span>
      {config.label}
    </span>
  )
}
