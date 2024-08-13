import {
  pgTable, varchar, uuid, index, boolean, timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { table as entity } from './entity.ts';
import { table as email } from './entity_email.ts';
import { table as phone } from './entity_phone.ts';
import { table as image } from './entity_file_image.ts';
import { table as dispatch } from './dispatch.ts';
import { table as profile } from './entity_profile.ts';

/**
 * A user that can be authenticated and authorized using the name.
 */
export const table = pgTable('entity_user', {
  $id: uuid('id').primaryKey().references(() => entity.$id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 32 }).unique().notNull(), // Unique handle for the user.
  locked: boolean('locked').notNull().default(false), // Flag indicating if the user account is locked. Locked accounts cannot establish a session (login).
  lastLogin: timestamp('last_login'),  // Last time the user logged in.
  $avatar: uuid('avatar_id').references(() => image.$id), // Avatar image for the user account.
}, (table) => ({
  userNameIdx: index('user_name_idx').on(table.name),
}));

export type User = typeof table.$inferSelect;
export type UserInsert = typeof table.$inferInsert;

export const relates = relations(table, ({ one, many }) => ({
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

  profile: one(profile),

  emails: many(email, { relationName: 'user' }),

  phones: many(phone, { relationName: 'user' }),

  dispatches: many(dispatch, { relationName: 'subject' }),

}));
