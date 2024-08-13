import type { Transaction } from './transaction.types';
import { getTableName, type TableConfig } from 'drizzle-orm';
import type { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { schemaCore } from '@do-ob/data/schema';
import { auditMutation, AuditMutationChanges } from './audit';
import { Ambit, Input } from '@do-ob/core';

export function insert<
  C extends TableConfig,
> (
  input: Input,
  table: PgTableWithColumns<C>,
  value: (Omit<PgTableWithColumns<C>['$inferInsert'], '$id'> & { $id?: string }),
) {
  return async (tx: Transaction): Promise<[PgTableWithColumns<C>['$inferSelect']]> => {
    const { $subject, $dispatch, ambit } = input;

    if(!$subject) {
      throw new Error('Unauthorized. No subject provided for the insert operation.');
    }

    if (ambit !== Ambit.Global) {
      throw new Error('Unauthorized. Insert operation is not allowed for the provided ambit.');
    }

    const tableName = getTableName(table);
    const isEntity = tableName.startsWith('entity_');
    const mutationItems: AuditMutationChanges[] = [];
    let entityId: string | undefined = undefined;

    if(isEntity) {
    /**
     * Create an entity record.
     */
      const [ entityRecord ] = await tx.insert(schemaCore.entity).values({
        type: isEntity ? tableName.replace('entity_', '') : null,
        $owner: $subject,
        $creator: $subject,
        $id: value.$id,
      }).returning();

      entityId = entityRecord.$id;

      if (!entityRecord || !entityId) {
        tx.rollback();
      }

      mutationItems.push({
        type: 'insert',
        table: schemaCore.entity,
        value: entityRecord,
      });

    }

    /**
     * Create the entity type record.
     */
    const typeValue = { ...value as PgTableWithColumns<C>['$inferInsert'] & { $id: string } };
    if(isEntity && entityId) {
      typeValue.$id = entityId;
    }
    const [ typeRecord ] = await tx.insert(table).values(typeValue).returning() as (PgTableWithColumns<C>['$inferSelect'] & { $id: string })[];

    if (!typeRecord) {
      tx.rollback();
    }

    mutationItems.push({
      type: 'insert',
      table,
      value: typeRecord,
    });

    /**
     * Create a mutation record of the insert.
     */
    if ($dispatch) {
      await tx.transaction(auditMutation($dispatch, mutationItems));
    }

    return [
      typeRecord,
    ];
  };
}
