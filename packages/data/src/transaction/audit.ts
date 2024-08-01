import type { Transaction } from './transaction.types';
import { getTableName, Table, type TableConfig } from 'drizzle-orm';
// import type { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { schema } from '@do-ob/data/schema';

export interface AuditMutationChanges<C extends TableConfig = TableConfig> {
  type: 'insert' | 'update' | 'remove';
  table: Table<C>,
  value: { $id: string, [key: string]: unknown },
}

export function auditMutation(
  $dispatch: string,
  mutations: AuditMutationChanges[],
) {
  return async (tx: Transaction) => {
    /**
     * Create a mutation record of the insert.
     */
    await tx.insert(schema.mutate).values(
      mutations.map(mutation => ({
        $dispatch,
        $entity: mutation.value.$id,
        table: getTableName(mutation.table),
        operation: mutation.type,
        mutation: mutation.value
      }))
    );
  };
}
