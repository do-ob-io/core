import {
  pgTable, varchar, uuid, boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { table as entity } from './entity.ts';
import { table as user } from './user.ts';

/**
 * Email addresses
 */
export const table = pgTable('phone', {
  $id: uuid('id').primaryKey().references(() => entity.$id, { onDelete: 'cascade' }),
  $user: uuid('user_id').references(() => user.$id),
  countryCode: varchar('country_code', { length: 3 }).notNull(), // ISO 3166-1 alpha-3
  number: varchar('number', { length: 14 }).notNull(), // Any number up to 14 digits
  verified: boolean('verified').notNull().default(false), // If the phone number has been verified.
});

export type Phone = typeof table.$inferSelect;
export type PhoneInsert = typeof table.$inferInsert;

export const relates = relations(table, ({ one }) => ({
  entity: one(entity, {
    fields: [ table.$id ],
    references: [ entity.$id ],
    relationName: 'entity',
  }),
  
  user: one(user, {
    fields: [ table.$user ],
    references: [ user.$id ],
    relationName: 'user',
  }),
}));
