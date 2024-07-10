import { PgTable } from 'drizzle-orm/pg-core';
import { database } from '@do-ob/data/database';
import { schema } from '@do-ob/data/schema';
import { records as action } from './seed/action';
import { records as system } from './seed/system';

export const collection = {
  action,
  system,
};

export async function seed() {
  const db = await database();
  const systemValue = await db.query.system.findFirst({
    where: (table, { eq }) => eq(table.$id, 'SEEDED'),
  });

  if (systemValue && systemValue.value === 'true') {
    throw new Error('Database already seeded.');
    return;
  }

  db.transaction(async (tx) => {
    Object.keys(collection).forEach(async (key) => {
      if (!(key in schema)) {
        throw new Error(`No schema found for ${key}`);
      }
      const table = schema[key as keyof typeof schema] as PgTable;
      const records = collection[key as keyof typeof collection];
      await tx.insert(table).values(records);
    });
  });
}

export {
  action,
  system,
};
