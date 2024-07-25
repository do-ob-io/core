import {
  pgTable, uuid, smallint, integer
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { table as file } from './entity_file.ts';

/**
 * Information about tables that can be uploaded.
 */
export const table = pgTable('entity_file_video', {
  $id: uuid('id').primaryKey().references(() => file.$id, { onDelete: 'cascade' }),
  height: smallint('height').notNull(), // Original height of the video.
  width: smallint('width').notNull(), // Original width of the video.
  length: integer('length').notNull(), // The length of the video in milliseconds (Max ~28 days).
});

export type Video = typeof table.$inferSelect;
export type VideoInsert = typeof table.$inferInsert;

export const relates = relations(table, ({ one }) => ({
  file: one(file, {
    fields: [ table.$id ],
    references: [ file.$id ],
    relationName: 'file',
  }),
}));
