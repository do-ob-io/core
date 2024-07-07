import {
  pgTable, varchar, uuid, boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { entity } from './entity.ts';
import { user } from './user.ts';

/**
 * Email addresses
 */
export const phone = pgTable('phone', {
  $id: uuid('id').primaryKey().references(() => entity.$id, { onDelete: 'cascade' }),
  $user: uuid('user_id').references(() => user.$id),
  countryCode: varchar('country_code', { length: 3 }).notNull(), // ISO 3166-1 alpha-3
  number: varchar('number', { length: 14 }).notNull(), // Any number up to 14 digits
  verified: boolean('verified').notNull().default(false), // If the phone number has been verified.
});

export type Phone = typeof phone.$inferSelect;
export type PhoneInsert = typeof phone.$inferInsert;

export const phoneRelations = relations(phone, ({ one }) => ({
  entity: one(entity, {
    fields: [ phone.$id ],
    references: [ entity.$id ],
    relationName: 'entity',
  }),
  
  user: one(user, {
    fields: [ phone.$user ],
    references: [ user.$id ],
    relationName: 'user',
  }),
}));
