import type { Transaction } from './transaction.types';
import { getTableName, type Table, type TableConfig } from 'drizzle-orm';
// import type { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { schemaCore } from '@do-ob/data/schema';

export interface AuditMutationChanges {
  type: 'insert' | 'update' | 'remove';
  table: Table<TableConfig>,
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
    await tx.insert(schemaCore.mutate).values(
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
