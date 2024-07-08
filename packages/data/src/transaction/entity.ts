import { core, core_entity, CoreInsert, CoreEntityInsert, CoreEntitySelect } from '@do-ob/data/schema';
import { Transaction } from './transaction.types';
import type { Database } from '@do-ob/data/database';

export type EntityInsertValue<T extends keyof CoreEntityInsert> = Omit<CoreEntityInsert[T], '$id'>;

export type EntityQuery<T extends keyof CoreEntityInsert> = Parameters<Database['query'][T]['findMany']>[0];

export type EntityInsertMeta = Pick<CoreInsert['entity'], '$owner' | '$creator'>;

/**
 * Inserts a new role into the database.
 */
export function entityInsert<T extends keyof CoreEntityInsert>(
  type: T,
  value: EntityInsertValue<T>,
  entity: EntityInsertMeta = {},
) {
  return async (tx: Transaction) => {
    const [ entityRecord ] = await tx.insert(core.entity.table).values({
      type: 'role',
      ...entity
    }).returning();

    const [ typeRecord ] = await tx.insert(core_entity[type].table).values({
      ...value as CoreEntityInsert[T],
      $id: entityRecord.$id,
    }).returning();

    return {
      ...(typeRecord as CoreEntitySelect[T]),
      entity: entityRecord,
    };
  };
}
