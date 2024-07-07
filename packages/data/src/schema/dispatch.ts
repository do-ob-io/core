import { relations } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  timestamp,
  jsonb,
  text,
  pgEnum,
  varchar,
} from 'drizzle-orm/pg-core';

import { mutate } from './mutate.ts';
import { entity } from './entity/entity.ts';
import { action } from './action.ts';

/**
 * The possible data types for a dispatch status.
 */
export const dispatchStatus = pgEnum('dispatch_status', [ 'success', 'rejected', 'pending' ]);

/**
 * Whenever a subject performs an action, a dispatch is created to apply the action.
 * Dispatches can happen instantly or be scheduled for a future time.
 */
export const dispatch = pgTable('dispatch', {
  $id: uuid('id').primaryKey().defaultRandom(), // Unique dispatch identifier.
  $subject: uuid('subject_id').notNull().references(() => entity.$id), // The subject ID that is responsible for the dispatch.
  $action: varchar('action_id', { length: 64 }).notNull().references(() => action.$id), // The action that was/will be dispatched.
  created: timestamp('created').defaultNow().notNull(), // When the dispatch was created.
  initiate: timestamp('initiate').defaultNow().notNull(), // When the dispatch was/will be initiated.
  payload: jsonb('payload'), // The payload data to send with the action.
  status: dispatchStatus('status').notNull().default('pending'), // The status of the dispatch.
  result: jsonb('result'), // The result data from the action.
  message: text('message'), // A message to describe the dispatch.
});

export type Dispatch = typeof dispatch.$inferSelect;
export type DispatchInsert = typeof dispatch.$inferInsert;

export const dispatchRelations = relations(dispatch, ({ one, many }) => ({

  subject: one(entity, {
    fields: [ dispatch.$subject ],
    references: [ entity.$id ],
    relationName: 'subject',
  }),
  
  action: one(action, {
    fields: [ dispatch.$action ],
    references: [ action.$id ],
    relationName: 'action',
  }),

  mutations: many(mutate, { relationName: 'dispatch' }),

}));
