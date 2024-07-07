import {
  pgTable, varchar, uuid, check,
} from 'drizzle-orm/pg-core';
import { sql, relations } from 'drizzle-orm';

import { entity } from './entity.ts';
import { image } from './file/image.ts';

/**
 * Roles for grouping actions together for authorization.
 */
export const role = pgTable('role', {
  $id: uuid('id').primaryKey().references(() => entity.$id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 32 }).unique().notNull(), // A human readable name for the role.
  description: varchar('description', { length: 1024 }), // A description of the role.
  color: varchar('color', { length: 7 }), // The color of the role in hex format.
  icon: varchar('icon', { length: 256 }), // The icon name of the role.
  $avatar: uuid('avatar_id').references(() => image.$id), // Cover image for the person (takes precedence over the icon).
}, (table) => ({
  colorHexChk: check('color_hex_chk', sql`${table.color} ~* '^#[A-Fa-f0-9]{6}$'`),
}));

export type Role = typeof role.$inferSelect;
export type RoleInsert = typeof role.$inferInsert;

export const roleRelations = relations(role, ({ one }) => ({
  entity: one(entity, {
    fields: [ role.$id ],
    references: [ entity.$id ],
    relationName: 'entity',
  }),

  avatar: one(image, {
    fields: [ role.$avatar ],
    references: [ image.$id ],
    relationName: 'avatar',
  }),
}));
