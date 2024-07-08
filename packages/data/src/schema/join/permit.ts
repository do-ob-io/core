import { relations } from 'drizzle-orm';
import { pgTable, uuid, primaryKey, varchar } from 'drizzle-orm/pg-core';

import { table as entity } from '../entity/entity.ts';
import { table as action } from '../action.ts';
import { table as ambit } from '../ambit.ts';

/**
 * Permits grant entities the ability to perform actions.
 *
 * Example: In authorization...
 * If the entity is the auth subject and has a permit to perform the action,
 * then the entity is authorized to perform that action in the logic layer.
 */
export const table = pgTable('permit', {
  $entity: uuid('entity_id').notNull().references(() => entity.$id, { onDelete: 'cascade' }), // The entity that is granted the permit.
  $action: varchar('action_id', { length: 64 }).notNull().references(() => action.$id, { onDelete: 'cascade' }), // The action that the entity is permitted to perform.
  $ambit: varchar('ambit_id', { length: 64 }).notNull().references(() => ambit.$id, { onDelete: 'cascade' }), // The ambit that the entity is bound to perform the action within.
}, (table) => ({
  pk: primaryKey({ columns: [ table.$entity, table.$action, table.$ambit ] }),
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
  }),
  ambit: one(ambit, {
    fields: [ table.$ambit ],
    references: [ ambit.$id ],
    relationName: 'ambit',
  }),
}));
