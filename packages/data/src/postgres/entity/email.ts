import {
  pgTable, varchar, uuid, check, boolean, index
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

import { entity } from './entity.ts';
import { user } from './user.ts';

/**
 * Email addresses
 */
export const email = pgTable('email', {
  $id: uuid('id').primaryKey().references(() => entity.$id, { onDelete: 'cascade' }),
  $user: uuid('user_id').references(() => user.$id),
  address: varchar('address', { length: 255 }).unique().notNull(),
  verified: boolean('verified').notNull().default(false),
}, (table) => ({
  addressIdx: index('email_address_idx').on(table.address),
  addressChk: check('email_address_chk', sql`${table.address} ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_\`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'`),
}));

export type Email = typeof email.$inferSelect;
export type EmailInsert = typeof email.$inferInsert;

export const emailRelations = relations(email, ({ one }) => ({
  entity: one(entity, {
    fields: [ email.$id ],
    references: [ entity.$id ],
    relationName: 'entity',
  }),

  user: one(user, {
    fields: [ email.$user ],
    references: [ user.$id ],
    relationName: 'user',
  }),
}));
