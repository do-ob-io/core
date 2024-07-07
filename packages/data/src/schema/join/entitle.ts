import { relations } from 'drizzle-orm';
import { pgTable, uuid, primaryKey, varchar } from 'drizzle-orm/pg-core';

import { entity } from '../entity/entity.ts';
import { action } from '../action.ts';

/**
 * Entitles grant entities the ability to perform actions on specific entities.
 */
export const entitle = pgTable('entitle', {
  $entity: uuid('entity_id').notNull().references(() => entity.$id),
  $target: uuid('target_id').notNull().references(() => entity.$id),
  $action: varchar('action_id', { length: 64 }).notNull().references(() => action.$id),
}, (table) => ({
  pk: primaryKey({ columns: [ table.$entity, table.$target, table.$action ] }),
}));

export type Entitle = typeof entitle.$inferSelect;
export type EntitleInsert = typeof entitle.$inferInsert;

export const entitleRelations = relations(entitle, ({ one }) => ({
  entity: one(entity, {
    fields: [ entitle.$entity ],
    references: [ entity.$id ],
    relationName: 'entity',
  }),
  target: one(entity, {
    fields: [ entitle.$target ],
    references: [ entity.$id ],
    relationName: 'target',
  }),
  action: one(action, {
    fields: [ entitle.$action ],
    references: [ action.$id ],
    relationName: 'action',
  }),
}));
