'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createResult } from '@/actions/results'
import { GlassCard } from '@/components/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, CheckCircle, XCircle, HelpCircle } from 'lucide-react'
import { ResultOutcome } from '@/types'

const outcomes: {
  value: ResultOutcome
  label: string
  icon: typeof CheckCircle
  className: string
}[] = [
  {
    value: 'validated',
    label: 'Validated',
    icon: CheckCircle,
    className: 'bg-success/20 text-success border-success/30',
  },
  {
    value: 'invalidated',
    label: 'Invalidated',
    icon: XCircle,
    className: 'bg-destructive/20 text-destructive border-destructive/30',
  },
  {
    value: 'inconclusive',
    label: 'Inconclusive',
    icon: HelpCircle,
    className: 'bg-inconclusive/20 text-inconclusive border-inconclusive/30',
  },
]

interface ExperimentOption {
  id: string
  name: string
  assumption: {
    idea: {
      title: string
    }
  }
}

interface ResultFormProps {
  experiments: ExperimentOption[]
  preselectedExperimentId?: string
}

export function ResultForm({
  experiments,
  preselectedExperimentId = '',
}: ResultFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    experimentId: preselectedExperimentId,
    outcome: 'inconclusive' as ResultOutcome,
    keyInsight: '',
    whatWorked: '',
    whatDidnt: '',
    evidence: '',
    nextAction: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createResult(formData)
      // Redirect is handled in the server action
    } catch (error) {
      console.error('Failed to create result:', error)
      setIsSubmitting(false)
    }
  }

  const getContextForExperiment = (experimentId: string) => {
    const experiment = experiments.find((e) => e.id === experimentId)
    if (!experiment) return ''
    return `${experiment.assumption.idea.title}: ${experiment.name}`
  }

  return (
    <div className="animate-fade-in mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-foreground text-2xl font-bold">Record Result</h1>
          <p className="text-muted-foreground">
            Capture learning before memory rewrites history
          </p>
        </div>
      </div>

      <GlassCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="experimentId">Linked Experiment</Label>
            <select
              id="experimentId"
              value={formData.experimentId}
              onChange={(e) =>
                setFormData({ ...formData, experimentId: e.target.value })
              }
              required
              className="bg-input border-border text-foreground focus:ring-ring h-10 w-full rounded-lg border px-3 focus:ring-2"
            >
              <option value="">Select an experiment...</option>
              {experiments.map((experiment) => (
                <option key={experiment.id} value={experiment.id}>
                  {getContextForExperiment(experiment.id)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Outcome</Label>
            <div className="grid grid-cols-3 gap-3">
              {outcomes.map(({ value, label, icon: Icon, className }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, outcome: value })}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                    formData.outcome === value
                      ? className + ' border-current'
                      : 'border-border bg-secondary/50 text-muted-foreground hover:border-primary/30'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keyInsight">Key Insight</Label>
            <Input
              id="keyInsight"
              placeholder="Short, blunt takeaway..."
              value={formData.keyInsight}
              onChange={(e) =>
                setFormData({ ...formData, keyInsight: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatWorked">What Worked</Label>
            <Textarea
              id="whatWorked"
              placeholder="What went well..."
              value={formData.whatWorked}
              onChange={(e) =>
                setFormData({ ...formData, whatWorked: e.target.value })
              }
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatDidnt">What Didn't Work</Label>
            <Textarea
              id="whatDidnt"
              placeholder="What didn't go as planned..."
              value={formData.whatDidnt}
              onChange={(e) =>
                setFormData({ ...formData, whatDidnt: e.target.value })
              }
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="evidence">Evidence (optional)</Label>
            <Textarea
              id="evidence"
              placeholder="Metrics, links, screenshots..."
              value={formData.evidence}
              onChange={(e) =>
                setFormData({ ...formData, evidence: e.target.value })
              }
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextAction">Next Action</Label>
            <Input
              id="nextAction"
              placeholder="Pivot / Iterate / Double down..."
              value={formData.nextAction}
              onChange={(e) =>
                setFormData({ ...formData, nextAction: e.target.value })
              }
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
              {isSubmitting ? 'Recording...' : 'Record Result'}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}
