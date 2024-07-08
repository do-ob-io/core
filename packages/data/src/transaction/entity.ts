import { core, core_entity, CoreEntityInsert, CoreEntitySelect } from '@do-ob/data/schema';
import { Transaction } from './transaction.types';

export type EntityInsertValue<T extends keyof CoreEntityInsert> = Omit<CoreEntityInsert[T], '$id'>;

/**
 * Inserts a new role into the database.
 */
export function entityInsert<T extends keyof CoreEntityInsert>(type: T, value: EntityInsertValue<T>) {
  return async (tx: Transaction) => {
    const [ entityRecord ] = await tx.insert(core.entity.table).values({
      type: 'role',
    }).returning({ $id: core.entity.table.$id });

    const [ typeRecord ] = await tx.insert(core_entity[type].table).values({
      ...value as CoreEntityInsert[T],
      $id: entityRecord.$id,
    }).returning();

    return typeRecord as CoreEntitySelect[T];
  };
}
