import { test, expect, beforeAll } from 'vitest';
import { Database, database } from '@do-ob/data/database';
import { seed } from '@do-ob/data/seed';
import { schema } from '@do-ob/data/schema';
import { prepareInput } from '@/test/utility';
import { remove } from './remove';

let db: Database;

beforeAll(async () => {
  db = await seed(database());
});

test('remove an entity', async () => {
  const input = await prepareInput(db);
  const result = await db.transaction(
    remove(input, schema.entity, '00000000-0000-0000-0000-000000000000'),
  );

  expect(result).toEqual([
    {
      $id: '00000000-0000-0000-0000-000000000000',
    },
  ]);
});
