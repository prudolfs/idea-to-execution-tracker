import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type GlassCardProps = {
  children: ReactNode
  className?: string
  hoverable?: boolean
  onClick?: () => void
}

export function GlassCard({
  children,
  className,
  hoverable = false,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card rounded-xl p-6 transition-all duration-300',
        hoverable &&
          'hover:border-primary/30 cursor-pointer hover:scale-[1.01] hover:shadow-lg',
        className,
      )}
    >
      {children}
    </div>
  )
}
