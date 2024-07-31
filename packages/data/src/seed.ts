import { PgTable } from 'drizzle-orm/pg-core';
import { database } from '@do-ob/data/database';
import { schema } from '@do-ob/data/schema';
import { Database } from './pglite';

import * as system from './seed/system';
import * as entity from './seed/entity';
import * as action from './seed/action';

export interface SeedModule {
  records: Array<object>;
}

export const modules = {
  system,
  entity,
  action,
};

/**
 * Seeds a database with initial data necessary to run an application.
 */
export async function seed(db?: Database) {
  if(!db) {
    db = await database();
  }
  const systemValue = await db.query.system.findFirst({
    where: (table, { eq }) => eq(table.$id, 'SEEDED'),
  });

  if (systemValue && systemValue.value === 'true') {
    throw new Error('Database already seeded.');
  }

  await db.transaction(async (tx) => {
    const promises = Object.keys(modules).map((key) => {
      if(!(key in schema)) {
        console.warn(`No schema found for ${key}`);
        return Promise.resolve();
      }
      const table = schema[key as keyof typeof schema] as PgTable;
      const records = modules[key as keyof typeof modules].records;
      return tx.insert(table).values(records);
    });
    await Promise.all(promises);
  });

  return db;
}
