import type { Transaction } from './transaction/transaction.types.ts';
import { database } from '@do-ob/data/database';

export * from './transaction/insert.ts';
export * from './transaction/insertMany.ts';
export * from './transaction/query.ts';
export * from './transaction/update.ts';
export * from './transaction/remove.ts';
export * from './transaction/audit.ts';

export async function transact<R>(transaction: (tx: Transaction) => Promise<R>): Promise<R> {
  const db = await database();
  return await db.transaction(transaction);
}
