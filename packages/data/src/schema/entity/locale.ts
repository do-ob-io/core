import {
  pgTable, varchar, index, text, uuid, unique
} from 'drizzle-orm/pg-core';

import { entity } from './entity.ts';

/**
 * Translations for text based on a locale code and a name as key.
 */
export const locale = pgTable('locale', {
  $id: uuid('id').primaryKey().references(() => entity.$id, { onDelete: 'cascade' }),
  code: varchar('code', { length: 8 }).notNull(),
  name: varchar('name', { length: 1024 }).notNull(),
  content: text('content'),
}, (table) => ({
  pk: unique().on(table.code, table.name),
  codeIdx: index('locale_code_idx').on(table.code),
  nameIdx: index('locale_name_idx').on(table.name),
}));

export type Locale = typeof locale.$inferSelect;
export type LocaleInsert = typeof locale.$inferInsert;
