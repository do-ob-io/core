import { schemaEntity, EntityInserts, EntitySelects } from '@do-ob/data/schema';
import { Transaction } from './transaction.types';

export type EntityInsertValue<T extends keyof EntityInserts> = Omit<EntityInserts[T], '$id'>;

/**
 * Inserts a new role into the database.
 */
export function entityInsert<T extends keyof EntityInserts>(type: T, value: EntityInsertValue<T>) {
  return async (tx: Transaction) => {
    const [ entityRecord ] = await tx.insert(schemaEntity.entity).values({
      type: 'role',
    }).returning({ $id: schemaEntity.entity.$id });

    const [ typeRecord ] = await tx.insert(schemaEntity[type]).values({
      ...value as EntityInserts[T],
      $id: entityRecord.$id,
    }).returning();

    return typeRecord as EntitySelects[T];
  };
}
