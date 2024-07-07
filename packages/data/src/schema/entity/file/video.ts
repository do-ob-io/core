import {
  pgTable, uuid, smallint, integer
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { file } from './file.ts';

/**
 * Information about videos that can be uploaded.
 */
export const video = pgTable('video', {
  $id: uuid('id').primaryKey().references(() => file.$id, { onDelete: 'cascade' }),
  height: smallint('height').notNull(), // Original height of the video.
  width: smallint('width').notNull(), // Original width of the video.
  length: integer('length').notNull(), // The length of the video in milliseconds (Max ~28 days).
});

export type Video = typeof video.$inferSelect;
export type VideoInsert = typeof video.$inferInsert;

export const videoRelations = relations(video, ({ one }) => ({
  file: one(file, {
    fields: [ video.$id ],
    references: [ file.$id ],
    relationName: 'file',
  }),
}));
