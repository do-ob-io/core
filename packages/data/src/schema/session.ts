import {
  pgTable, timestamp, uuid,
} from 'drizzle-orm/pg-core';

/**
 * Stores a session for a client connection.
 */
export const session = pgTable('session', {
  $id: uuid('id').primaryKey().defaultRandom(), // Unique session identifier.
  $subject: uuid('subject').notNull(), // Reference to a subject record (usually a user).
  $credential: uuid('credential').notNull(), // Reference to a credential record.
  expires: timestamp('expires').notNull(), // Expiration timestamp.
});

export type Session = typeof session.$inferSelect;
export type SessionInsert = typeof session.$inferInsert;
