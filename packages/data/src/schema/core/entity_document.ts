import {
  pgTable, text, uuid,
} from 'drizzle-orm/pg-core';

import { table as entity } from './entity.ts';
import { table as profile } from './entity_profile.ts';

/**
 * Translations for text based on a locale code and a name as key.
 */
export const table = pgTable('entity_document', {
  $id: uuid('id').primaryKey().references(() => entity.$id, { onDelete: 'cascade' }),

  /**
   * The author of the document.
   */
  $author: uuid('author_id').references(() => profile.$id),

  /**
   * The document content.
   */
  content: text('content').notNull(),
});

export type Locale = typeof table.$inferSelect;
export type LocaleInsert = typeof table.$inferInsert;
