import { test, expect, assert, beforeAll } from 'vitest';
import { insertMany } from './insertMany';
import { schema } from '@do-ob/data/schema';
import { Database, database } from '@do-ob/data/database';
import { seed } from '@do-ob/data/seed';
import { prepareInput } from '@/test/utility';

let db: Database;

beforeAll(async () => {
  db = await seed(database());
});

test('should insert many new locale entities into the database', async () => {
  const input = await prepareInput(db);

  const [ locale1, locale2 ] = await db.transaction(
    insertMany(
      input,
      schema.locale,
      [
        {
          name: 'my_locale_1',
          code: 'en-US'
        },
        {
          name: 'my_locale_2',
          code: 'en-GB'
        },
      ]
    ),
  );

  assert(locale1);
  expect(locale1).toMatchObject({
    name: 'my_locale_1',
    code: 'en-US',
  });

  assert(locale2);
  expect(locale2).toMatchObject({
    name: 'my_locale_2',
    code: 'en-GB',
  });

  // Should read the entity from the database.
  const entityResult1 = await db.query.entity.findFirst({
    where: (table, { eq }) => eq(table.$id, locale1.$id),
  });

  assert(entityResult1);
  expect(entityResult1).toMatchObject({
    type: 'locale',
    $owner: input.$subject,
    $creator: input.$subject,
  });

  // Should read the locale from the database.
  const localeResult1 = await db.query.locale.findFirst({
    where: (table, { eq }) => eq(table.$id, locale1.$id),
  });

  assert(localeResult1);
  expect(localeResult1).toMatchObject({
    $id: entityResult1.$id,
    name: 'my_locale_1',
    code: 'en-US',
  });

  // Should read the entity from the database.
  const entityResult2 = await db.query.entity.findFirst({
    where: (table, { eq }) => eq(table.$id, locale2.$id),
  });

  assert(entityResult2);
  expect(entityResult2).toMatchObject({
    type: 'locale',
    $owner: input.$subject,
    $creator: input.$subject,
  });

  // Should read the locale from the database.
  const localeResult2 = await db.query.locale.findFirst({
    where: (table, { eq }) => eq(table.$id, locale2.$id),
  });

  assert(localeResult2);
  expect(localeResult2).toMatchObject({
    $id: entityResult2.$id,
    name: 'my_locale_2',
    code: 'en-GB',
  });

  // Should see the audit records.
  const auditRecords = await db.query.mutate.findMany({
    where: (table, { eq }) => eq(table.$entity, entityResult1.$id),
  });

  assert(auditRecords);
  expect(auditRecords).toHaveLength(2);
  expect(auditRecords[0]).toMatchObject({
    $dispatch: input.$dispatch,
    table: 'entity',
    operation: 'insert',
    mutation: {
      ...entityResult1,
      created: expect.any(String),
      updated: expect.any(String),
    },
  });
  expect(auditRecords[1]).toMatchObject({
    $dispatch: input.$dispatch,
    table: 'entity_locale',
    operation: 'insert',
    mutation: {
      ...localeResult1
    },
  });
  
});
