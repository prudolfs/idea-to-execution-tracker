'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Lightbulb,
  HelpCircle,
  FlaskConical,
  BarChart3,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/ideas', icon: Lightbulb, label: 'Ideas' },
  { to: '/assumptions', icon: HelpCircle, label: 'Assumptions' },
  { to: '/experiments', icon: FlaskConical, label: 'Experiments' },
  { to: '/results', icon: BarChart3, label: 'Results' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="border-border bg-sidebar fixed top-0 left-0 z-40 h-screen w-64 border-r">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="border-border flex h-16 items-center gap-3 border-b px-6">
          <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-lg">
            <FlaskConical className="text-primary-foreground h-5 w-5" />
          </div>
          <div>
            <h1 className="text-foreground text-lg font-bold">Validate</h1>
            <p className="text-muted-foreground text-xs">Idea Tracker</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.to ||
              (item.to !== '/' && pathname.startsWith(item.to))

            return (
              <Link
                key={item.to}
                href={item.to}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-border border-t p-4">
          <div className="glass-card rounded-lg p-4">
            <p className="text-muted-foreground text-xs">
              Evidence beats vibes.
            </p>
            <p className="text-primary mt-1 text-xs font-medium">
              Keep validating →
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
