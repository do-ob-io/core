import type { Transaction } from './transaction.types';
import { getTableName, type TableConfig } from 'drizzle-orm';
import type { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { schema } from '@do-ob/data/schema';

export interface AuditMutationChanges<C extends TableConfig> {
  type: 'create' | 'update' | 'delete';
  table: PgTableWithColumns<C>,
  value: PgTableWithColumns<C>['$inferSelect'] & { $id: string },
}

export function auditMutation<
  C extends TableConfig,
>(
  $dispatch: string,
  mutations: AuditMutationChanges<C>[],
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
