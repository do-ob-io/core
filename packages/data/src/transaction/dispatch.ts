import type { Transaction } from './transaction.types';
import { schemaCore, SchemaCore } from '@do-ob/data/schema';

/**
 * Prepares a a dispatch for an action with the database.
 */
export function dispatch(
  options: Pick<SchemaCore['dispatch']['$inferInsert'], '$subject' | '$action' | 'status' | 'initiate' | 'message' | 'payload'>,
) {
  return async (tx: Transaction): Promise<SchemaCore['dispatch']['$inferSelect']> => {
    /**
     * Initialize the dispatch record.
     */
    const [ dispatch ] = await tx.insert(schemaCore.dispatch).values({
      ...options
    }).returning();

    return dispatch;
  };
}
