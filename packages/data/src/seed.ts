import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { Ambit, inputify, Rate } from '@do-ob/core';
import { database } from '@do-ob/data/database';
import { schema } from '@do-ob/data/schema';
import { insertMany } from '@do-ob/data/transaction';
import { Database } from './pglite';

import * as system from './seed/system';
import * as action from './seed/action';
import * as entity_role from './seed/entity_role';
import * as entity_locale from './seed/entity_locale';
import * as entity_user from './seed/entity_user';
import * as join_assignment from './seed/join_assignment';


export interface SeedModule {
  records: Array<object>;
}

export const modules = {
  system,
  action,
  entity_role,
  entity_locale,
  entity_user,
  join_assignment,
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

    const moduleKeys = Object.keys(modules);

    /**
     * Insert the core data.
     */
    for (const key of moduleKeys) {
      if(!(key in schema)) {
        console.warn(`No schema found for ${key}`);
        continue;
      }
      const table = schema[key as keyof typeof schema] as PgTableWithColumns<any>;
      const records = modules[key as keyof typeof modules].records;

      if(key.startsWith('entity_')) {
        await tx.transaction(insertMany(input, table, records));
        continue;
      }

      await tx.insert(table).values(records);
    };
  });

  return db;
}
