import { relations } from 'drizzle-orm';
import { pgTable, uuid, primaryKey } from 'drizzle-orm/pg-core';

import { table as entity } from '../entity/entity.ts';
import { table as role } from '../entity/entity_role.ts';

/**
 * Assignment table for Many-to-Many entity <-> role relationships for authorization.
 * Roles are a collection of permitted actions.
 */
export const table = pgTable('join_assignment', {
  $entity: uuid('entity_id').references(() => entity.$id).notNull(),
  $role: uuid('role_id').references(() => role.$id).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [ table.$entity, table.$role ] }),
}));

export type Assignment = typeof table.$inferSelect;
export type AssignmentInsert = typeof table.$inferInsert;

export const relates = relations(table, ({ one }) => ({
  entity: one(entity, {
    fields: [ table.$entity ],
    references: [ entity.$id ],
    relationName: 'entity',
  }),
  role: one(role, {
    fields: [ table.$role ],
    references: [ role.$id ],
    relationName: 'role',
  }),
}));
