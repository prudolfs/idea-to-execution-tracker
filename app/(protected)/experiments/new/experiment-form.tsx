'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createExperiment } from '@app/actions/experiments'
import { GlassCard } from '@/components/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Plus, ArrowLeft, X } from 'lucide-react'
import { ExperimentStatus } from '@/types'

interface Props {
  assumptions: any[]
}

const statuses: ExperimentStatus[] = ['planned', 'active', 'completed']

export function ExperimentForm({ assumptions }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedAssumptionId = searchParams.get('assumptionId') || ''
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    assumptionId: preselectedAssumptionId,
    name: '',
    hypothesis: '',
    steps: [''],
    status: 'planned' as ExperimentStatus,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createExperiment({
        ...formData,
        steps: formData.steps.filter((s) => s.trim() !== ''),
      })
    } catch (error) {
      console.error('Failed to create experiment:', error)
      setIsSubmitting(false)
    }
  }

  const addStep = () => {
    setFormData({ ...formData, steps: [...formData.steps, ''] })
  }

  const removeStep = (index: number) => {
    setFormData({
      ...formData,
      steps: formData.steps.filter((_, i) => i !== index),
    })
  }

  const updateStep = (index: number, value: string) => {
    const newSteps = [...formData.steps]
    newSteps[index] = value
    setFormData({ ...formData, steps: newSteps })
  }

  return (
    <GlassCard>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="assumptionId">Linked Assumption</Label>
          <select
            id="assumptionId"
            value={formData.assumptionId}
            onChange={(e) =>
              setFormData({ ...formData, assumptionId: e.target.value })
            }
            required
            className="bg-input border-border text-foreground focus:ring-ring h-10 w-full rounded-lg border px-3 focus:ring-2"
          >
            <option value="">Select an assumption...</option>
            {assumptions.map((assumption) => (
              <option key={assumption.id} value={assumption.id}>
                {assumption.idea.title}: {assumption.assumption}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Experiment Name</Label>
          <Input
            id="name"
            placeholder='e.g., "Pricing page A/B test"'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hypothesis">Hypothesis</Label>
          <Textarea
            id="hypothesis"
            placeholder='e.g., "At least 5% of visitors click Buy at €25/month"'
            value={formData.hypothesis}
            onChange={(e) =>
              setFormData({ ...formData, hypothesis: e.target.value })
            }
            rows={2}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Step-by-Step Plan</Label>
          <div className="space-y-2">
            {formData.steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-muted-foreground w-6 text-sm">
                  {index + 1}.
                </span>
                <Input
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  placeholder={`Step ${index + 1}...`}
                />
                {formData.steps.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStep(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addStep}>
              <Plus className="mr-2 h-4 w-4" />
              Add Step
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFormData({ ...formData, status })}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  formData.status === status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Experiment'}
          </Button>
        </div>
      </form>
    </GlassCard>
  )
}
