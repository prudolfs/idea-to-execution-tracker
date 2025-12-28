import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Idea, Assumption, Experiment, Result } from '@/types'

interface TrackerState {
  ideas: Idea[]
  assumptions: Assumption[]
  experiments: Experiment[]
  results: Result[]

  // Idea actions
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateIdea: (id: string, updates: Partial<Idea>) => void
  deleteIdea: (id: string) => void

  // Assumption actions
  addAssumption: (assumption: Omit<Assumption, 'id' | 'createdAt'>) => void
  updateAssumption: (id: string, updates: Partial<Assumption>) => void
  deleteAssumption: (id: string) => void

  // Experiment actions
  addExperiment: (experiment: Omit<Experiment, 'id' | 'createdAt'>) => void
  updateExperiment: (id: string, updates: Partial<Experiment>) => void
  deleteExperiment: (id: string) => void

  // Result actions
  addResult: (result: Omit<Result, 'id' | 'createdAt'>) => void
  updateResult: (id: string, updates: Partial<Result>) => void
  deleteResult: (id: string) => void

  // Getters
  getAssumptionsForIdea: (ideaId: string) => Assumption[]
  getExperimentForAssumption: (assumptionId: string) => Experiment | undefined
  getResultForExperiment: (experimentId: string) => Result | undefined
}

const generateId = () => Math.random().toString(36).substring(2, 15)

export const useTrackerStore = create<TrackerState>()(
  persist(
    (set, get) => ({
      ideas: [],
      assumptions: [],
      experiments: [],
      results: [],

      // Idea actions
      addIdea: (idea) => {
        const newIdea: Idea = {
          ...idea,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({ ideas: [...state.ideas, newIdea] }))
      },

      updateIdea: (id, updates) => {
        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea.id === id
              ? { ...idea, ...updates, updatedAt: new Date() }
              : idea,
          ),
        }))
      },

      deleteIdea: (id) => {
        set((state) => ({
          ideas: state.ideas.filter((idea) => idea.id !== id),
          assumptions: state.assumptions.filter((a) => a.ideaId !== id),
        }))
      },

      // Assumption actions
      addAssumption: (assumption) => {
        const newAssumption: Assumption = {
          ...assumption,
          id: generateId(),
          createdAt: new Date(),
        }
        set((state) => ({ assumptions: [...state.assumptions, newAssumption] }))
      },

      updateAssumption: (id, updates) => {
        set((state) => ({
          assumptions: state.assumptions.map((a) =>
            a.id === id ? { ...a, ...updates } : a,
          ),
        }))
      },

      deleteAssumption: (id) => {
        set((state) => ({
          assumptions: state.assumptions.filter((a) => a.id !== id),
        }))
      },

      // Experiment actions
      addExperiment: (experiment) => {
        const newExperiment: Experiment = {
          ...experiment,
          id: generateId(),
          createdAt: new Date(),
        }
        set((state) => ({ experiments: [...state.experiments, newExperiment] }))
      },

      updateExperiment: (id, updates) => {
        set((state) => ({
          experiments: state.experiments.map((e) =>
            e.id === id ? { ...e, ...updates } : e,
          ),
        }))
      },

      deleteExperiment: (id) => {
        set((state) => ({
          experiments: state.experiments.filter((e) => e.id !== id),
        }))
      },

      // Result actions
      addResult: (result) => {
        const newResult: Result = {
          ...result,
          id: generateId(),
          createdAt: new Date(),
        }
        set((state) => ({ results: [...state.results, newResult] }))
      },

      updateResult: (id, updates) => {
        set((state) => ({
          results: state.results.map((r) =>
            r.id === id ? { ...r, ...updates } : r,
          ),
        }))
      },

      deleteResult: (id) => {
        set((state) => ({
          results: state.results.filter((r) => r.id !== id),
        }))
      },

      // Getters
      getAssumptionsForIdea: (ideaId) => {
        return get().assumptions.filter((a) => a.ideaId === ideaId)
      },

      getExperimentForAssumption: (assumptionId) => {
        return get().experiments.find((e) => e.assumptionId === assumptionId)
      },

      getResultForExperiment: (experimentId) => {
        return get().results.find((r) => r.experimentId === experimentId)
      },
    }),
    {
      name: 'tracker-storage',
    },
  ),
)
