import {
  pgTable, varchar, uuid, index, text, smallint
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { table as entity } from './entity.ts';

/**
 * Passkey to be used for authentication and authorization of subjects
 */
export const table = pgTable('entity_credential', {
  $id: uuid('id').primaryKey().references(() => entity.$id, { onDelete: 'cascade' }),
  $client: varchar('client_id', { length: 64 }).notNull(), // The credential identifier provided by the client.
  aaguid: varchar('aaguid', { length: 128 }), // The Authenticator Attestation Globally Unique Identifier https://fidoalliance.org/metadata/
  agentName: varchar('agent_name', { length: 256 }).notNull(), // The name of the agent that generated the credential.
  publicKey: text('public_key').notNull(), // The public key used to verify signatures.
  algorithm: smallint('algorithm').notNull(), // The algorithm used to generate the keys.
  $subject: uuid('subject_id').notNull().references(() => entity.$id), // The entity subject that is registered with this credential.
}, (table) => ({
  credentialClientIdIdx: index('credential_client_id_idx').on(table.$client),
}));

export type Credential = typeof table.$inferSelect;
export type CredentialInsert = typeof table.$inferInsert;

export const relates = relations(table, ({ one }) => ({
  entity: one(entity, {
    fields: [ table.$id ],
    references: [ entity.$id ],
    relationName: 'entity',
  }),
  subject: one(entity, {
    fields: [ table.$subject ],
    references: [ entity.$id ],
    relationName: 'subject',
  }),
}));
