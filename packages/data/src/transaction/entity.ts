import { core, core_entity } from '@do-ob/data/schema';
import type { CoreEntityInsert, CoreEntitySelect, CoreInsert } from '@do-ob/data/schema';
import type { Transaction } from './transaction.types';

export type EntityInsertValue<T extends keyof CoreEntityInsert> = Omit<CoreEntityInsert[T], '$id'>;

// export type EntityQuery<T extends keyof CoreEntityInsert> = Parameters<Database['query'][T]['findMany']>[0];

export type EntityInsertMeta = Partial<Pick<CoreInsert['entity'], '$owner' | '$creator'>>;

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
