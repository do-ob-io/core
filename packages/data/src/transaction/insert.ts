import type { Transaction } from './transaction.types';
import { getTableName, type TableConfig } from 'drizzle-orm';
import type { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { schema } from '@do-ob/data/schema';

export function insert<
  C extends TableConfig,
> (
  table: PgTableWithColumns<C>,
  value: Omit<PgTableWithColumns<C>['$inferInsert'], '$id'>,
  meta: {
    $owner?: string,
    $creator?: string,
  } = {},
  audit?: {
    $dispatch: string,
  },
) {
  return async (tx: Transaction): Promise<[PgTableWithColumns<C>['$inferSelect'], typeof schema.entity.$inferSelect]> => {
    const tableName = getTableName(table);

    /**
         * Create an entity record.
         */
    const [ entityRecord ] = await tx.insert(schema.entity).values({
      type: tableName.replace('entity_', ''),
      ...meta
    }).returning();

    /**
     * Create the entity type record.
     */
    const [ typeRecord ] = await tx.insert(table).values({
      ...value as PgTableWithColumns<C>['$inferInsert'],
      $id: entityRecord.$id,
    }).returning();

    if (!typeRecord) {
      tx.rollback();
    }

    if (audit) {
      tx.insert(schema.mutate).values([
        {
          $dispatch: audit.$dispatch,
          $entity: entityRecord.$id,
          table: tableName,
          operation: 'create',
          mutation: typeRecord,
        },
        {
          $dispatch: audit.$dispatch,
          $entity: entityRecord.$id,
          table: tableName,
          operation: 'create',
          mutation: entityRecord,
        }
      ]);
    }

    return [
      typeRecord as PgTableWithColumns<C>['$inferSelect'],
      entityRecord,
    ];
  };
}
