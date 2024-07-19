import { relations } from 'drizzle-orm';
import { pgTable, uuid, unique, varchar, smallint } from 'drizzle-orm/pg-core';

import { table as entity } from '../entity/entity.ts';
import { table as action } from '../action.ts';

/**
 * Permits grant entities the ability to perform actions.
 *
 * Example: In authorization...
 * If the entity is the auth subject and has a permit to perform the action,
 * then the entity is authorized to perform that action in the logic layer
 * within the ambit and rate constraints.
 */
export const table = pgTable('permit', {
  $id: uuid('id').primaryKey().references(() => entity.$id, { onDelete: 'cascade' }), // Owner of the permit.
  $entity: uuid('entity_id').notNull().references(() => entity.$id, { onDelete: 'cascade' }), // The entity that is granted the permit.
  $action: varchar('action_id', { length: 64 }).notNull().references(() => action.$id, { onDelete: 'cascade' }), // The action that the entity is permitted to perform.
  ambit: smallint('ambit').default(0), // The ambits restricts the action to be performed within certain scopes.
  rate: smallint('rate').default(0), // The rate level at which the permit allows the action to be performed.
}, (table) => ({
  granted: unique().on(table.$entity, table.$action),
}));

export type Permit = typeof table.$inferSelect;
export type PermitInsert = typeof table.$inferInsert;

export const relates = relations(table, ({ one }) => ({
  entity: one(entity, {
    fields: [ table.$entity ],
    references: [ entity.$id ],
    relationName: 'entity',
  }),
  action: one(action, {
    fields: [ table.$action ],
    references: [ action.$id ],
    relationName: 'action',
  })
}));
