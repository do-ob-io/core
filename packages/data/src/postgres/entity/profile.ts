import {
  pgTable, varchar, uuid, index, text, timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { entity } from './entity.ts';
import { image } from './file/image.ts';
import { user } from './user.ts';

/**
 * Profile about a particular person.
 */
export const profile = pgTable('profile', {
  $id: uuid('id').primaryKey().references(() => entity.$id, { onDelete: 'cascade' }),
  $user: uuid('user_id').references(() => user.$id), // The user ID that owns the profile.
  givenName: varchar('given_name', { length: 128 }), // The first name of the person.
  familyName: varchar('family_name', { length: 128 }), // The last name of the person.
  additionalName: varchar('additional_name', { length: 128 }), // Additional/middle name of the person.
  honorificPrefix: varchar('honorific_prefix', { length: 32 }), // Prefix to the name of the person. (Mr., Mrs., Dr., etc.)
  honorificSuffix: varchar('honorific_suffix', { length: 32 }), // Suffix to the name of the person. (Jr., Sr., III, etc.)
  sex: varchar('sex', { length: 1 }), // M for male or F for female.
  gender: varchar('gender', { length: 128 }), // Flexible gender identity of the person.
  birthDate: timestamp('birth_date'), // Date of birth of the person.
  deathDate: timestamp('death_date'), // Date of death of the person.
  $picture: uuid('picture_id').references(() => image.$id), // Picture of the person.
  $cover: uuid('cover_id').references(() => image.$id), // Cover image for the person.
  biography: text('biography'), // Biography of the person.
}, (table) => ({
  profileGivenNameIdx: index('profile_given_name_idx').on(table.givenName),
  profileFamilyNameIdx: index('profile_family_name_idx').on(table.familyName)
}));

export type Profile = typeof profile.$inferSelect;
export type ProfileInsert = typeof profile.$inferInsert;

export const profileRelations = relations(profile, ({ one }) => ({
  entity: one(entity, {
    fields: [ profile.$id ],
    references: [ entity.$id ],
    relationName: 'entity',
  }),
  user: one(user, {
    fields: [ profile.$user ],
    references: [ user.$id ],
    relationName: 'user',
  }),
  picture: one(image, {
    fields: [ profile.$picture ],
    references: [ image.$id ],
    relationName: 'picture',
  }),
  cover: one(image, {
    fields: [ profile.$cover ],
    references: [ image.$id ],
    relationName: 'cover',
  }),
}));
