import {
  pgTable,
  varchar,
  jsonb,
} from 'drizzle-orm/pg-core';

/**
 * Records of available actions that can be performed.
 * Subjects that can perform actions are controlled in the authorization layer.
 */
export const table = pgTable('action', {
  /**
   * A unique key for the action.
   * 
   * @example 'user.create'
   */
  $id: varchar('id', { length: 64 }).primaryKey(),

  /**
   * The JSON Schema for the payload data that is expected.
   * 
   * @example { "type": "object", "properties": { "name": { "type": "string" } }, "required": ["name"] }
   */
  definition: jsonb('definition'),

  /**
   * A description of what the actions does.
   */
  description: varchar('description', { length: 1024 }),
});

export type Action = typeof table.$inferSelect;
export type ActionInsert = typeof table.$inferInsert;
