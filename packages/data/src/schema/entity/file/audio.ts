import {
  pgTable, uuid, integer, smallint
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { file } from './file.ts';

/**
 * Information about audio files that can be uploaded.
 */
export const audio = pgTable('audio', {
  $id: uuid('id').primaryKey().references(() => file.$id, { onDelete: 'cascade' }),
  length: integer('length').notNull(), // The length of the audio in milliseconds (Max ~28 days).
  volume: smallint('volume').notNull(), // The original volume of the audio in decibels.
});

export type audio = typeof audio.$inferSelect;
export type audioInsert = typeof audio.$inferInsert;

export const audioRelations = relations(audio, ({ one }) => ({
  file: one(file, {
    fields: [ audio.$id ],
    references: [ file.$id ],
    relationName: 'file',
  }),
}));
