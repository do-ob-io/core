import {
  pgTable, varchar, index,
} from 'drizzle-orm/pg-core';

/**
 * A record of bounding ambits that a subject can act within.
 * 
 * Example: In authorization...
 * An abit defines the bounds of an ambit that can be performed by a subject. For instance, 
 * a subject can only edit their own profile, but not another subject's profile.
 */
export const ambit = pgTable('ambit', {
  $id: varchar('id', { length: 64 }).primaryKey(), // A unique key for the ambit.
  name: varchar('name', { length: 256 }).notNull(), // A human readable name for the ambit.
  description: varchar('description', { length: 1024 }), // A description of what the ambits does.
}, (table) => ({
  ambitNameIdx: index('ambit_name_idx').on(table.name),
}));

export type Ambit = typeof ambit.$inferSelect;
export type AmbitInsert = typeof ambit.$inferInsert;
