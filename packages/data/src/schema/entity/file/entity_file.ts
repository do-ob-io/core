import {
  pgTable, varchar, uuid, index, bigint
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { table as entity } from '../entity.ts';

/**
 * Information about files that can be uploaded.
 */
export const table = pgTable('entity_file', {
  $id: uuid('id').primaryKey().references(() => entity.$id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 32 }).unique().notNull(), // A human readable name for the file.
  description: varchar('description', { length: 1024 }), // A description of the file.
  mimeType: varchar('mime_type', { length: 64 }).notNull(), // The MIME type of the file.
  size: bigint('size', { mode: 'number' }).notNull(), // Size in bytes.
  path: varchar('path', { length: 2048 }), // The full path to the file.
}, (table) => ({
  fileNameIdx: index('file_name_idx').on(table.name),
  filePathIdx: index('file_path_idx').on(table.path),
}));

export type File = typeof table.$inferSelect;
export type FileInsert = typeof table.$inferInsert;

export const relates = relations(table, ({ one }) => ({
  entity: one(entity, {
    fields: [ table.$id ],
    references: [ entity.$id ],
    relationName: 'entity',
  }),
}));
