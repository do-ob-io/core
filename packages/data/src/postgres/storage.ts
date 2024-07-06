import {
  pgTable,
  varchar,
} from 'drizzle-orm/pg-core';
import { bytea } from '@do-ob/data/custom';

/**
 * A table for storing byte data that can be referenced by slugs.
 */
export const storage = pgTable('storage', {
  $slug: varchar('slug').primaryKey(), // A readable unique identifier for the storage item.
  data: bytea('data').notNull(), // The binary data.
});

export type Storage = typeof storage.$inferSelect;
export type StorageInsert = typeof storage.$inferInsert;
