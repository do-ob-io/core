import type { Transaction } from './transaction.types';
import { getTableName, type TableConfig } from 'drizzle-orm';
import type { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { schema, Schema } from '@do-ob/data/schema';
import { auditMutation, AuditMutationChanges } from './audit';
import { Ambit, Input } from '@do-ob/core';

export function insertMany<
  C extends TableConfig,
> (
  input: Input,
  table: PgTableWithColumns<C>,
  values: Omit<PgTableWithColumns<C>['$inferInsert'], '$id'>[],
) {
  return async (tx: Transaction): Promise<PgTableWithColumns<C>['$inferSelect'][]> => {
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
    const entityId: string[] = [];

    if(isEntity) {
    /**
     * Create an entity record.
     */
      const entities = await tx.insert(schema.entity).values(values.map(() => ({
        type: tableName.replace('entity_', ''),
        $owner: $subject,
        $creator: $subject,
      }))).returning() as (Schema['entity']['$inferSelect'])[];

      entityId.push(...entities.map(entity => entity.$id));

      if (entityId.length !== values.length) {
        tx.rollback();
      }

      mutationItems.push(...entities.map(entity => ({
        type: 'insert', 
        table: schema.entity,
        value: entity,
      })) as AuditMutationChanges[]);

    }

    /**
     * Create the entity type record.
     */
    const typeValues = values.map((value, index) => ({
      ...value,
      $id: isEntity ? entityId[index] : (value as object & { $id?: string })?.$id ?? undefined,
    }));
    const typeRecords = await tx.insert(table).values(typeValues as any).returning() as (PgTableWithColumns<C>['$inferSelect'] & { $id: string })[];

    if (typeRecords.length !== values.length) {
      tx.rollback();
    }

    mutationItems.push(...typeRecords.map(record => ({
      type: 'insert', 
      table,
      value: record,
    })) as AuditMutationChanges[]);

    /**
     * Create a mutation record of the insert.
     */
    if ($dispatch) {
      await tx.transaction(auditMutation($dispatch, mutationItems));
    }

    return typeRecords;
  };
}
