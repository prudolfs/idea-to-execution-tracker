import { cn } from '@/lib/utils'

interface ConfidenceSliderProps {
  value: number
  onChange?: (value: number) => void
  readonly?: boolean
  className?: string
}

export function ConfidenceSlider({
  value,
  onChange,
  readonly = false,
  className,
}: ConfidenceSliderProps) {
  const getColor = (val: number) => {
    if (val < 33) return 'bg-destructive'
    if (val < 66) return 'bg-warning'
    return 'bg-success'
  }

  const getLabel = (val: number) => {
    if (val < 33) return 'Low'
    if (val < 66) return 'Medium'
    return 'High'
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">Confidence</span>
        <span
          className={cn(
            'rounded px-2 py-0.5 text-sm font-semibold',
            value < 33 && 'text-destructive',
            value >= 33 && value < 66 && 'text-warning',
            value >= 66 && 'text-success',
          )}
        >
          {getLabel(value)}
        </span>
      </div>
      <div className="relative">
        <div className="bg-secondary h-2 overflow-hidden rounded-full">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              getColor(value),
            )}
            style={{ width: `${value}%` }}
          />
        </div>
        {!readonly && (
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => onChange?.(Number(e.target.value))}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        )}
      </div>
    </div>
  )
}
