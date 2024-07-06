import {
  pgTable, varchar, uuid, index, boolean, timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { entity } from './entity.ts';
import { email } from './email.ts';
import { phone } from './phone.ts';
import { image } from './file/image.ts';
import { dispatch } from '../dispatch.ts';
import { profile } from './profile.ts';

/**
 * A user that can be authenticated and authorized using the name.
 */
export const user = pgTable('user', {
  $id: uuid('id').primaryKey().references(() => entity.$id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 32 }).unique().notNull(), // Unique handle for the user.
  locked: boolean('locked').notNull().default(false), // Flag indicating if the user account is locked. Locked accounts cannot establish a session (login).
  lastLogin: timestamp('last_login'),  // Last time the user logged in.
  $avatar: uuid('avatar_id').references(() => image.$id), // Avatar image for the user account.
}, (table) => ({
  userNameIdx: index('user_name_idx').on(table.name),
}));

export type User = typeof user.$inferSelect;
export type UserInsert = typeof user.$inferInsert;

export const userRelations = relations(user, ({ one, many }) => ({
  entity: one(entity, {
    fields: [ user.$id ],
    references: [ entity.$id ],
    relationName: 'entity',
  }),

  avatar: one(image, {
    fields: [ user.$avatar ],
    references: [ image.$id ],
    relationName: 'avatar',
  }),

  profile: one(profile),

  emails: many(email, { relationName: 'user' }),

  phones: many(phone, { relationName: 'user' }),

  dispatches: many(dispatch, { relationName: 'subject' }),

}));
