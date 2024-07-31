import type { Transaction } from './transaction.types';
import { schema, Schema } from '@do-ob/data/schema';

/**
 * Prepares a a dispatch for an action with the database.
 */
export function dispatch(
  options: Pick<Schema['dispatch']['$inferInsert'], '$subject' | '$action' | 'status' | 'initiate' | 'message' | 'payload'>,
) {
  return async (tx: Transaction): Promise<Schema['dispatch']['$inferSelect']> => {
    /**
     * Initialize the dispatch record.
     */
    const [ dispatch ] = await tx.insert(schema.dispatch).values({
      ...options
    }).returning();

    return dispatch;
  };
}
