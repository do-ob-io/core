import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { Ambit, inputify, Rate } from '@do-ob/core';
import { database } from '@do-ob/data/database';
import { schema } from '@do-ob/data/schema';
import { insertMany } from '@do-ob/data/transaction';
import { Database } from './pglite';

import * as system from './seed/system';
import * as action from './seed/action';
import * as entity_locale from './seed/entity_locale';


export interface SeedModule {
  records: Array<object>;
}

export const modules = {
  system,
  action,
  entity_locale,
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

    /**
     * The subject id to use for the seed operation.
     */
    const $subject = '00000000-0000-0000-0000-000000000000';

    /**
     * Create the subject entity.
     */
    await tx.insert(schema.entity).values({
      $id: $subject,
      type: null,
      $owner: $subject,
      $creator: $subject,
    });

    /**
     * Create the initial seed action.
     */
    await tx.insert(schema.action).values({
      $id: 'seed',
      definition: {
        $id: 'seed',
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'null',
      },
      description: 'Seeds the database with initial data.',
    });

    const [ dispatch ] = await tx.insert(schema.dispatch).values({
      $subject,
      $action: 'seed',
      payload: null,
      status: 'success',
      result: true,
    }).returning();

    if (!dispatch) {
      tx.rollback();
      throw new Error('The dispatch record failed to be created.');
    }

    const input = inputify({
      $dispatch: dispatch.$id,
      $subject,
      ambit: Ambit.Global,
      rate: Rate.Unlimited,
    });

    /**
     * Insert the core data.
     */
    const promises = Object.keys(modules).map((key) => {
      if(!(key in schema)) {
        console.warn(`No schema found for ${key}`);
        return Promise.resolve();
      }
      const table = schema[key as keyof typeof schema] as PgTableWithColumns<any>;
      const records = modules[key as keyof typeof modules].records;

      if(key.startsWith('entity_')) {
        return tx.transaction(insertMany(input, table, records));
      }

      return tx.insert(table).values(records);
    });
    await Promise.all(promises);
  });

  return db;
}
