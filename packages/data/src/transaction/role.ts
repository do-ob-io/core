import { RoleInsert, entity, role } from '@do-ob/data/schema';
import { Transaction } from './transaction.types';

export type RoleInsertValue = Omit<RoleInsert, '$id'>;

/**
 * Inserts a new role into the database.
 */
export function roleInsert(value: RoleInsertValue) {
  return async (tx: Transaction) => {
    const [ entityRecord ] = await tx.insert(entity).values({
      type: 'role',
    }).returning({ $id: entity.$id });

    const [ roleRecord ] = await tx.insert(role).values({
      $id: entityRecord.$id,
      ...value,
    }).returning();

    return roleRecord;
  };
}
