import { core, core_entity, CoreInsert, CoreEntityInsert, CoreEntitySelect } from '@do-ob/data/schema';
import { Transaction } from './transaction.types';

export type EntityInsertValue<T extends keyof CoreEntityInsert> = Omit<CoreEntityInsert[T], '$id'>;

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

/**
 * Query for an entity.
 */
// export function entityQuery<T extends keyof CoreEntitySelect>(
//   type: T,
// ) {
//   return async (tx: Transaction) => {
//     const record = await tx.query[type].findMany();

//     return record as CoreEntitySelect[T];
//   };
// }
