import { relations } from 'drizzle-orm';
import {
  pgEnum,
  pgTable,
  uuid,
  timestamp,
  jsonb,
  varchar,
} from 'drizzle-orm/pg-core';

import { table as dispatch } from './dispatch.ts';
import { table as entity } from './entity.ts';

/**
 * Possible operations to a historical change.
 */
export const operation = pgEnum('mutate_operation', [ 'insert', 'update', 'remove' ]);

/**
 * Defines a log of CUD changes to records on other tables in the database.
 * This should be very helpful for auditing and debugging as well as reversing.
 */
export const table = pgTable('mutate', {
  $id: uuid('id').primaryKey().defaultRandom(), // Unique mutate identifier.
  $dispatch: uuid('dispatch_id').notNull().references(() => dispatch.$id), // The dispatch ID that was responsible for the mutation.
  $entity: uuid('record_id').notNull().references(() => entity.$id), // The record ID that was changed.
  table: varchar('table').notNull(), // The table that was changed.
  operation: operation('operation').notNull(), // The operation performed on the record.
  occurred: timestamp('occurred').defaultNow().notNull(), // When the operation was performed.
  mutation: jsonb('mutation').notNull(), // The mutation that was performed.
});

export type Mutate = typeof table.$inferSelect;
export type MutateInsert = typeof table.$inferInsert;

export const relates = relations(table, ({ one }) => ({
  dispatch: one(dispatch, {
    fields: [ table.$dispatch ],
    references: [ dispatch.$id ],
    relationName: 'dispatch',
  }),
  
  entity: one(entity, {
    fields: [ table.$entity ],
    references: [ entity.$id ],
    relationName: 'entity',
  }),
}));
