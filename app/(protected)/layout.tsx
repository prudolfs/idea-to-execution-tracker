'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { Menu, FlaskConical } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="bg-background min-h-screen">
      {/* Mobile Header */}
      <div className="border-border bg-sidebar sticky top-0 z-30 flex items-center justify-between border-b p-4 md:hidden">
        <div className="flex items-center gap-3">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <FlaskConical className="text-primary-foreground h-4 w-4" />
          </div>
          <div>
            <h1 className="text-foreground text-lg font-bold">Validate</h1>
            <p className="text-muted-foreground text-xs leading-none">
              Idea Tracker
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="md:pl-64">
        <div className="min-h-screen p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
