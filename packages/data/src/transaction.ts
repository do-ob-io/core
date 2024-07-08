import type { Transaction } from './transaction/transaction.types.ts';
import { database } from '@do-ob/data/database';

export * from './transaction/entity.ts';

export async function transact<R>(transaction: (tx: Transaction) => Promise<R>): Promise<R> {
  const db = await database();
  return await db.transaction(transaction);
}
