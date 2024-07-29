import { test, expect, assert } from 'vitest';
import { adapter, Database, database, schema } from '@do-ob/data';
import { inputify } from '@do-ob/core';
import { seed } from './seed';

async function prepareInput(db: Database) {
  seed();
  const [ subject ] = await db.insert(schema.entity).values({}).returning({ $id: schema.entity.$id });
  // const [ dispatch ] = await db.insert(schema.dispatch).values({
  //   $subject: subject.$id,
  //   $action: 'register',
  // }).returning({ $id: schema.dispatch.$id });

  return inputify({
    // $dispatch: dispatch.$id,
    $subject: subject.$id,
  });
}

test('should insert a new entity into the database', async () => {
  const db = database();
  const dbAdapter = adapter(db);

  const input = await prepareInput(db);

  const result = await dbAdapter.insert(input)(schema.locale, {
    name: 'my_locale',
    code: 'en-US'
  });

  assert(result);
  expect(result).toMatchObject({
    name: 'my_locale',
    code: 'en-US',
    entity: expect.any(Object),
  });

  // Should read the entity from the database.
  const entityResult = await db.query.entity.findFirst({
    where: (table, { eq }) => eq(table.$id, result.entity.$id),
  });

  assert(entityResult);
  expect(entityResult).toMatchObject({
    type: 'locale',
    $owner: input.$subject,
    $creator: input.$subject,
  });

  // Should read the locale from the database.
  const localeResult = await db.query.locale.findFirst({
    where: (table, { eq }) => eq(table.$id, result.$id),
  });

  assert(localeResult);
  expect(localeResult).toMatchObject({
    $id: entityResult.$id,
    name: 'my_locale',
    code: 'en-US',
  });
  
});

test('should update an entity in the database', async () => {
  const db = database();
  const dbAdapter = adapter(db);

  const input = await prepareInput(db);

  const inserted = await dbAdapter.insert(input)(schema.locale, {
    name: 'my_locale_to_update',
    code: 'en-US',
    content: 'this is the content',
  });

  assert(inserted);

  const result = await dbAdapter.update(input)(schema.locale, {
    $id: inserted.$id,
    content: 'this is the updated content',
  });

  assert(result);
  expect(result).toMatchObject({
    name: 'my_locale_to_update',
    code: 'en-US',
    content: 'this is the updated content'
  });

  const mutations = await db.query.mutate.findMany({
    where: (table, { and, eq }) => and(
      eq(table.$entity, result.$id),
      eq(table.operation, 'update'),
    ),
  });

  expect(mutations).toHaveLength(1);

});
