import {
  pgTable, uuid, smallint, boolean
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { file } from './file.ts';

/**
 * Information about images that can be uploaded.
 */
export const image = pgTable('image', {
  $id: uuid('id').primaryKey().references(() => file.$id, { onDelete: 'cascade' }),
  height: smallint('height').notNull(),
  width: smallint('width').notNull(),
  animated: boolean('animated').notNull().default(false),
  frames: smallint('frames'),
});

export type Image = typeof image.$inferSelect;
export type ImageInsert = typeof image.$inferInsert;

export const imageRelations = relations(image, ({ one }) => ({
  file: one(file, {
    fields: [ image.$id ],
    references: [ file.$id ],
    relationName: 'file',
  }),
}));
