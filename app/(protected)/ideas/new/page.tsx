'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GlassCard } from '@/components/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import { Stage } from '@/types'
import { createIdea } from '@app/actions/ideas'

const stages: Stage[] = ['idea', 'testing', 'validation', 'launch']

export default function NewIdeaPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    targetMarket: '',
    coreConcept: '',
    problemToSolve: '',
    stage: 'idea' as Stage,
    primaryNextStep: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createIdea(formData)
      // The action handles redirect
    } catch (error) {
      console.error('Failed to create idea:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/ideas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-foreground text-2xl font-bold">New Idea</h1>
          <p className="text-muted-foreground">Capture it once, clearly</p>
        </div>
      </div>

      <GlassCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Idea Title</Label>
            <Input
              id="title"
              placeholder="e.g., Launch a SaaS for freelancers"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetMarket">Target Market</Label>
            <Input
              id="targetMarket"
              placeholder="e.g., SMEs, solo founders, agencies"
              value={formData.targetMarket}
              onChange={(e) =>
                setFormData({ ...formData, targetMarket: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coreConcept">Core Concept</Label>
            <Textarea
              id="coreConcept"
              placeholder="One short paragraph describing the solution..."
              value={formData.coreConcept}
              onChange={(e) =>
                setFormData({ ...formData, coreConcept: e.target.value })
              }
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="problemToSolve">Problem to Solve</Label>
            <Textarea
              id="problemToSolve"
              placeholder="Explicit pain the user has today..."
              value={formData.problemToSolve}
              onChange={(e) =>
                setFormData({ ...formData, problemToSolve: e.target.value })
              }
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Stage</Label>
            <div className="flex flex-wrap gap-2">
              {stages.map((stage) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setFormData({ ...formData, stage })}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    formData.stage === stage
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  }`}
                >
                  {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryNextStep">Primary Next Step</Label>
            <Input
              id="primaryNextStep"
              placeholder="e.g., Test onboarding flow"
              value={formData.primaryNextStep}
              onChange={(e) =>
                setFormData({ ...formData, primaryNextStep: e.target.value })
              }
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Link href="/ideas" className="w-full sm:w-auto">
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? 'Creating...' : 'Create Idea'}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}
