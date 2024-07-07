import {
  pgEnum,
  pgTable,
  text,
  varchar,
} from 'drizzle-orm/pg-core';

/**
 * The possible data types for a system settings.
 */
export const systemType = pgEnum('system_type', [ 'boolean', 'number', 'string' ]);

/**
 * The system table serves as a flat registry for global configuration settings.
 */
export const system = pgTable('system', {
  $id: varchar('id').primaryKey(), // Name of the system setting.
  type: systemType('type').notNull(), // Type of the system setting (boolean, number, string).
  value: text('value').notNull(), // Value of the system setting. The string value will be converted to the type.
  description: text('description'), // Optional description of the system setting.
});

export type System = typeof system.$inferSelect;
export type SystemInsert = typeof system.$inferInsert;
