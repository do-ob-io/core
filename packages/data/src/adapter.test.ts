import { test, expect, assert, beforeAll } from 'vitest';
import { adapter, Database, database, schemaCore } from '@do-ob/data';
import { seed } from './seed';
import { prepareInput } from '@/test/utility';

let db: Database;

beforeAll(async () => {
  db = await seed(database());
});

test('should insert a new entity into the database', async () => {
  const dbAdapter = adapter(db);

  const input = await prepareInput(db);

  const result = await dbAdapter.insert(input)(schemaCore.entity_locale, {
    name: 'my_locale',
    code: 'en-US'
  });

  assert(result);
  expect(result).toMatchObject({
    name: 'my_locale',
    code: 'en-US',
  });

  // Should read the entity from the database.
  const entityResult = await db.query.entity.findFirst({
    where: (table, { eq }) => eq(table.$id, result.$id),
  });

  assert(entityResult);
  expect(entityResult).toMatchObject({
    type: 'locale',
    $owner: input.$subject,
    $creator: input.$subject,
  });

  // Should read the locale from the database.
  const localeResult = await db.query.entity_locale.findFirst({
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
  const dbAdapter = adapter(db);

  const input = await prepareInput(db);

  const inserted = await dbAdapter.insert(input)(schemaCore.entity_locale, {
    name: 'my_locale_to_update',
    code: 'en-US',
    content: 'this is the content',
  });

  assert(inserted);

  const result = await dbAdapter.update(input)(schemaCore.entity_locale, {
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
