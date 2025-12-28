export type Stage = 'idea' | 'testing' | 'validation' | 'launch'

export type ExperimentStatus = 'planned' | 'active' | 'completed'

export type ResultOutcome = 'validated' | 'invalidated' | 'inconclusive'

export interface Idea {
  id: string
  title: string
  targetMarket: string
  coreConcept: string
  problemToSolve: string
  stage: Stage
  primaryNextStep: string
  createdAt: Date
  updatedAt: Date
}

export interface Assumption {
  id: string
  ideaId: string
  assumption: string
  confidenceLevel: number // 0-100
  whyItMatters?: string
  proposedExperiment: string
  createdAt: Date
}

export interface Experiment {
  id: string
  assumptionId: string
  name: string
  hypothesis: string
  steps: string[]
  status: ExperimentStatus
  startDate?: Date
  endDate?: Date
  createdAt: Date
}

export interface Result {
  id: string
  experimentId: string
  outcome: ResultOutcome
  keyInsight: string
  whatWorked: string
  whatDidnt: string
  evidence?: string
  nextAction: string
  createdAt: Date
}
