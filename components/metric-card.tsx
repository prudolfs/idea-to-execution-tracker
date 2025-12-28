import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

type MetricCardProps = {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  className?: string
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  trendValue,
  className,
}: MetricCardProps) {
  return (
    <div className={cn('glass-card rounded-xl p-5', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="text-foreground text-3xl font-bold">{value}</p>
          {trendValue && (
            <p
              className={cn(
                'flex items-center gap-1 text-xs font-medium',
                trend === 'up' && 'text-success',
                trend === 'down' && 'text-destructive',
                trend === 'neutral' && 'text-muted-foreground',
              )}
            >
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trendValue}
            </p>
          )}
        </div>
        <div className="bg-primary/10 rounded-lg p-3">
          <Icon className="text-primary h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
