import {
  pgTable, uuid, smallint, boolean
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { table as file } from './entity_file.ts';

/**
 * Information about images that can be uploaded.
 */
export const table = pgTable('entity_file_image', {
  $id: uuid('id').primaryKey().references(() => file.$id, { onDelete: 'cascade' }),
  height: smallint('height').notNull(),
  width: smallint('width').notNull(),
  animated: boolean('animated').notNull().default(false),
  frames: smallint('frames'),
});

export type Image = typeof table.$inferSelect;
export type ImageInsert = typeof table.$inferInsert;

export const relates = relations(table, ({ one }) => ({
  file: one(file, {
    fields: [ table.$id ],
    references: [ file.$id ],
    relationName: 'file',
  }),
}));
