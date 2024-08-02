import { test, expect, beforeAll } from 'vitest';
import { Database, database } from '@do-ob/data/database';
import { seed } from '@do-ob/data/seed';
import { schema } from '@do-ob/data/schema';
import { prepareInput } from '@/test/utility';
import { remove } from './remove';
import { insert } from './insert';

let db: Database;

beforeAll(async () => {
  db = await seed(database());
});

test('remove an entity', async () => {
  const input = await prepareInput(db);

  const [ user ] = await db.transaction(
    insert(input, schema.user, { name: 'test' }),
  );

  const result = await db.transaction(
    remove(input, schema.user, user.$id),
  );

  expect(result).toEqual([
    {
      ...user,
      name: 'test',
    },
  ]);
});
