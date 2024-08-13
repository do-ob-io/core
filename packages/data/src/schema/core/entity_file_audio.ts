import {
  pgTable, uuid, integer, smallint
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { table as file } from './entity_file.ts';

/**
 * Information about audio files that can be uploaded.
 */
export const table = pgTable('entity_file_audio', {
  $id: uuid('id').primaryKey().references(() => file.$id, { onDelete: 'cascade' }),
  length: integer('length').notNull(), // The length of the audio in milliseconds (Max ~28 days).
  volume: smallint('volume').notNull(), // The original volume of the audio in decibels.
});

export type audio = typeof table.$inferSelect;
export type audioInsert = typeof table.$inferInsert;

export const relates = relations(table, ({ one }) => ({
  file: one(file, {
    fields: [ table.$id ],
    references: [ file.$id ],
    relationName: 'file',
  }),
}));
