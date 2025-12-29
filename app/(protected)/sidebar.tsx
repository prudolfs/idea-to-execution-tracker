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
  LogOut,
} from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/ideas', icon: Lightbulb, label: 'Ideas' },
  { to: '/assumptions', icon: HelpCircle, label: 'Assumptions' },
  { to: '/experiments', icon: FlaskConical, label: 'Experiments' },
  { to: '/results', icon: BarChart3, label: 'Results' },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/')
        },
      },
    })
  }

  return (
    <aside
      className={cn(
        'border-border bg-sidebar fixed top-0 left-0 z-40 h-screen w-64 border-r transition-transform duration-300 md:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      )}
    >
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
                onClick={onClose}
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
          <button
            onClick={handleSignOut}
            className="text-muted-foreground hover:bg-secondary hover:text-foreground flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  )
}
