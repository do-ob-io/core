import { relations } from 'drizzle-orm';
import { pgTable, uuid, primaryKey, varchar } from 'drizzle-orm/pg-core';

import { entity } from '../entity/entity.ts';
import { action } from '../action.ts';
import { ambit } from '../ambit.ts';

/**
 * Permits grant entities the ability to perform actions.
 *
 * Example: In authorization...
 * If the entity is the auth subject and has a permit to perform the action,
 * then the entity is authorized to perform that action in the logic layer.
 */
export const permit = pgTable('permit', {
  $entity: uuid('entity_id').notNull().references(() => entity.$id, { onDelete: 'cascade' }), // The entity that is granted the permit.
  $action: varchar('action_id', { length: 64 }).notNull().references(() => action.$id, { onDelete: 'cascade' }), // The action that the entity is permitted to perform.
  $ambit: varchar('ambit_id', { length: 64 }).notNull().references(() => ambit.$id, { onDelete: 'cascade' }), // The ambit that the entity is bound to perform the action within.
}, (table) => ({
  pk: primaryKey({ columns: [ table.$entity, table.$action, table.$ambit ] }),
}));

export type Permit = typeof permit.$inferSelect;
export type PermitInsert = typeof permit.$inferInsert;

export const permitRelations = relations(permit, ({ one }) => ({
  entity: one(entity, {
    fields: [ permit.$entity ],
    references: [ entity.$id ],
    relationName: 'entity',
  }),
  action: one(action, {
    fields: [ permit.$action ],
    references: [ action.$id ],
    relationName: 'action',
  }),
  ambit: one(ambit, {
    fields: [ permit.$ambit ],
    references: [ ambit.$id ],
    relationName: 'ambit',
  }),
}));
