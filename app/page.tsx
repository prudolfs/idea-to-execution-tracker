import Link from 'next/link'
import { FlaskConical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { auth } from '@/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="bg-background relative flex min-h-screen flex-col items-center justify-center">
      {/* Top right navigation */}
      <div className="absolute top-4 right-4 flex gap-4">
        <Button variant="ghost" asChild>
          <Link href="/signin">Sign in</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Sign up</Link>
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="bg-primary flex h-24 w-24 items-center justify-center rounded-2xl shadow-lg">
            <FlaskConical className="text-primary-foreground h-12 w-12" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-foreground text-6xl font-bold tracking-tight">
              Validate
            </h1>
            <p className="text-muted-foreground text-2xl font-medium">
              Idea Tracker
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
