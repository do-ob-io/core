import { relations } from 'drizzle-orm';
import { pgTable, uuid, primaryKey, varchar } from 'drizzle-orm/pg-core';

import { table as entity } from './entity.ts';
import { table as action } from './action.ts';

/**
 * Allows permits to customize scopes to include specific entities
 */
export const table = pgTable('join_entitle', {
  $entity: uuid('entity_id').notNull().references(() => entity.$id),
  $target: uuid('target_id').notNull().references(() => entity.$id),
  $action: varchar('action_id', { length: 64 }).notNull().references(() => action.$id),
}, (table) => ({
  pk: primaryKey({ columns: [ table.$entity, table.$target, table.$action ] }),
}));

export type Entitle = typeof table.$inferSelect;
export type EntitleInsert = typeof table.$inferInsert;

export const relates = relations(table, ({ one }) => ({
  entity: one(entity, {
    fields: [ table.$entity ],
    references: [ entity.$id ],
    relationName: 'entity',
  }),
  target: one(entity, {
    fields: [ table.$target ],
    references: [ entity.$id ],
    relationName: 'target',
  }),
  action: one(action, {
    fields: [ table.$action ],
    references: [ action.$id ],
    relationName: 'action',
  }),
}));
