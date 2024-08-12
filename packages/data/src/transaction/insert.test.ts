import { test, expect, assert, beforeAll } from 'vitest';
import { insert } from './insert';
import { schema } from '@do-ob/data/schema';
import { Database, database } from '@do-ob/data/database';
import { seed } from '@do-ob/data/seed';
import { prepareInput } from '@/test/utility';

let db: Database;

beforeAll(async () => {
  db = await seed(database());
});

test('should insert a new entity into the database', async () => {
  const input = await prepareInput(db);

  const [ locale ] = await db.transaction(
    insert(
      input,
      schema.entity_locale,
      {
        name: 'my_locale',
        code: 'en-US'
      }
    ),
  );

  assert(locale);
  expect(locale).toMatchObject({
    name: 'my_locale',
    code: 'en-US',
  });

  // Should read the entity from the database.
  const entityResult = await db.query.entity.findFirst({
    where: (table, { eq }) => eq(table.$id, locale.$id),
  });

  assert(entityResult);
  expect(entityResult).toMatchObject({
    type: 'locale',
    $owner: input.$subject,
    $creator: input.$subject,
  });

  // Should read the locale from the database.
  const localeResult = await db.query.entity_locale.findFirst({
    where: (table, { eq }) => eq(table.$id, locale.$id),
  });

  assert(localeResult);
  expect(localeResult).toMatchObject({
    $id: entityResult.$id,
    name: 'my_locale',
    code: 'en-US',
  });
  
});
