import type { Transaction } from './transaction.types';
import { getTableName, type TableConfig } from 'drizzle-orm';
import type { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { schema } from '@do-ob/data/schema';
import { auditMutation } from './audit';
import { Input } from '@do-ob/core';

export function insert<
  C extends TableConfig,
> (
  input: Input,
  table: PgTableWithColumns<C>,
  value: Omit<PgTableWithColumns<C>['$inferInsert'], '$id'>,
) {
  return async (tx: Transaction): Promise<[PgTableWithColumns<C>['$inferSelect'], typeof schema.entity.$inferSelect]> => {
    const { $subject, $dispatch } = input;

    const tableName = getTableName(table);

    /**
         * Create an entity record.
         */
    const [ entityRecord ] = await tx.insert(schema.entity).values({
      type: tableName.replace('entity_', ''),
      $owner: $subject,
      $creator: $subject,
    }).returning();

    /**
     * Create the entity type record.
     */
    const [ typeRecord ] = await tx.insert(table).values({
      ...value as PgTableWithColumns<C>['$inferInsert'],
      $id: entityRecord.$id,
    }).returning() as (PgTableWithColumns<C>['$inferSelect'] & { $id: string })[];

    if (!typeRecord) {
      tx.rollback();
    }

    if ($dispatch) {
      await tx.transaction(auditMutation($dispatch, [
        {
          type: 'insert',
          table,
          value: typeRecord,
        },
        {
          type: 'insert',
          table: schema.entity,
          value: entityRecord,
        }
      ]));
    }

    return [
      typeRecord,
      entityRecord,
    ];
  };
}
