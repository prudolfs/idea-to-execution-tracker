'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { GlassCard } from '@/components/glass-card'
import { ConfidenceSlider } from '@/components/confidence-slider'
import { createAssumption } from '@/app/actions/assumptions'

interface Idea {
  id: string
  title: string
}

interface AssumptionFormProps {
  ideas: Idea[]
}

export function AssumptionForm({ ideas }: AssumptionFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedIdeaId = searchParams.get('ideaId') || ''
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    ideaId: preselectedIdeaId,
    assumption: '',
    confidenceLevel: 50,
    whyItMatters: '',
    proposedExperiment: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createAssumption({
        ideaId: formData.ideaId,
        assumption: formData.assumption,
        confidenceLevel: formData.confidenceLevel,
        whyItMatters: formData.whyItMatters,
        proposedExperiment: formData.proposedExperiment,
      })
      // Server action handles redirect
    } catch (error) {
      console.error('Failed to create assumption:', error)
      setIsSubmitting(false)
      // Ideally show a toast or error message here
    }
  }

  return (
    <div className="animate-fade-in mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-foreground text-2xl font-bold">New Assumption</h1>
          <p className="text-muted-foreground">Make hidden beliefs explicit</p>
        </div>
      </div>

      <GlassCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ideaId">Linked Idea</Label>
            <select
              id="ideaId"
              value={formData.ideaId}
              onChange={(e) =>
                setFormData({ ...formData, ideaId: e.target.value })
              }
              required
              className="bg-input border-border text-foreground focus:ring-ring h-10 w-full rounded-lg border px-3 focus:ring-2"
            >
              <option value="">Select an idea...</option>
              {ideas.map((idea) => (
                <option key={idea.id} value={idea.id}>
                  {idea.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assumption">Key Assumption</Label>
            <Input
              id="assumption"
              placeholder='e.g., "SMEs will pay €25–50/month"'
              value={formData.assumption}
              onChange={(e) =>
                setFormData({ ...formData, assumption: e.target.value })
              }
              required
            />
          </div>

          <ConfidenceSlider
            value={formData.confidenceLevel}
            onChange={(value) =>
              setFormData({ ...formData, confidenceLevel: value })
            }
          />

          <div className="space-y-2">
            <Label htmlFor="whyItMatters">Why This Matters (optional)</Label>
            <Textarea
              id="whyItMatters"
              placeholder="Short rationale..."
              value={formData.whyItMatters}
              onChange={(e) =>
                setFormData({ ...formData, whyItMatters: e.target.value })
              }
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposedExperiment">Proposed Experiment</Label>
            <Textarea
              id="proposedExperiment"
              placeholder="Plain-English description of how to test it..."
              value={formData.proposedExperiment}
              onChange={(e) =>
                setFormData({ ...formData, proposedExperiment: e.target.value })
              }
              rows={3}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Assumption'}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}
