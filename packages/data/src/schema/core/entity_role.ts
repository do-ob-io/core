import {
  pgTable, varchar, uuid, check,
} from 'drizzle-orm/pg-core';
import { sql, relations } from 'drizzle-orm';

import { table as entity } from './entity.ts';
import { table as image } from './entity_file_image.ts';

/**
 * Roles for grouping actions together for authorization.
 */
export const table = pgTable('entity_role', {
  $id: uuid('id').primaryKey().references(() => entity.$id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 32 }).unique().notNull(), // A human readable name for the role.
  description: varchar('description', { length: 1024 }), // A description of the role.
  color: varchar('color', { length: 7 }), // The color of the role in hex format.
  icon: varchar('icon', { length: 256 }), // The icon name of the role.
  $avatar: uuid('avatar_id').references(() => image.$id), // Cover image for the person (takes precedence over the icon).
}, (table) => ({
  colorHexChk: check('color_hex_chk', sql`${table.color} ~* '^#[A-Fa-f0-9]{6}$'`),
}));

export type Role = typeof table.$inferSelect;
export type RoleInsert = typeof table.$inferInsert;

export const relates = relations(table, ({ one }) => ({
  entity: one(entity, {
    fields: [ table.$id ],
    references: [ entity.$id ],
    relationName: 'entity',
  }),

  avatar: one(image, {
    fields: [ table.$avatar ],
    references: [ image.$id ],
    relationName: 'avatar',
  }),
}));
