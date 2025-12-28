import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  json,
} from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'

export const user = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const userRelations = relations(user, ({ many }) => ({
  ideas: many(ideas),
}))

export const session = pgTable('session', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
})

export const account = pgTable('account', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const verification = pgTable('verification', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
})

// Domain Tables

export const ideas = pgTable('ideas', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  targetMarket: text('target_market').notNull(),
  coreConcept: text('core_concept').notNull(),
  problemToSolve: text('problem_to_solve').notNull(),
  stage: text('stage').notNull().default('idea'), // 'idea' | 'testing' | 'validation' | 'launch'
  primaryNextStep: text('primary_next_step').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const ideasRelations = relations(ideas, ({ one, many }) => ({
  user: one(user, {
    fields: [ideas.userId],
    references: [user.id],
  }),
  assumptions: many(assumptions),
}))

export const assumptions = pgTable('assumptions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  ideaId: text('idea_id')
    .notNull()
    .references(() => ideas.id, { onDelete: 'cascade' }),
  assumption: text('assumption').notNull(),
  confidenceLevel: integer('confidence_level').notNull().default(0),
  whyItMatters: text('why_it_matters'),
  proposedExperiment: text('proposed_experiment').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const assumptionsRelations = relations(assumptions, ({ one, many }) => ({
  idea: one(ideas, {
    fields: [assumptions.ideaId],
    references: [ideas.id],
  }),
  experiments: many(experiments),
}))

export const experiments = pgTable('experiments', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  assumptionId: text('assumption_id')
    .notNull()
    .references(() => assumptions.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  hypothesis: text('hypothesis').notNull(),
  steps: json('steps').$type<string[]>().notNull().default([]),
  status: text('status').notNull().default('planned'), // 'planned' | 'active' | 'completed'
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const experimentsRelations = relations(experiments, ({ one, many }) => ({
  assumption: one(assumptions, {
    fields: [experiments.assumptionId],
    references: [assumptions.id],
  }),
  results: many(results),
}))

export const results = pgTable('results', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  experimentId: text('experiment_id')
    .notNull()
    .references(() => experiments.id, { onDelete: 'cascade' }),
  outcome: text('outcome').notNull(), // 'validated' | 'invalidated' | 'inconclusive'
  keyInsight: text('key_insight').notNull(),
  whatWorked: text('what_worked').notNull(),
  whatDidnt: text('what_didnt').notNull(),
  evidence: text('evidence'),
  nextAction: text('next_action').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const resultsRelations = relations(results, ({ one }) => ({
  experiment: one(experiments, {
    fields: [results.experimentId],
    references: [experiments.id],
  }),
}))
