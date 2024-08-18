import {
  pgTable,
  text,
  varchar,
} from 'drizzle-orm/pg-core';

/**
 * The system table serves as a flat registry for global configuration settings.
 */
export const table = pgTable('system', {
  $id: varchar('id').primaryKey(), // Name of the system setting.
  value: text('value').notNull(), // String value of the system setting.
  pattern: varchar('pattern', { length: 64 }), // Optional pattern to validate the system setting value.
  description: text('description'), // Optional description of the system setting.
});

export type System = typeof table.$inferSelect;
export type SystemInsert = typeof table.$inferInsert;
