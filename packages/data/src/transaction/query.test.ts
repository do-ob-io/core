import { test, expect, beforeAll } from 'vitest';
import { Database, database } from '@do-ob/data/database';
import { seed } from '@do-ob/data/seed';
import { schema } from '@do-ob/data/schema';
import { prepareInput } from '@/test/utility';
import { query } from './query';
import { Ambit } from '@do-ob/core';

let db: Database;

beforeAll(async () => {
  db = await seed(database());
});

test('should query for the row with the $id "NAME" from the schema.system table', async () => {
  const input = await prepareInput(db);

  const result = await db.transaction(
    query(input, schema.system, {
      filter: ({ table }, { eq }) => eq(table.$id, 'NAME'),
    }),
  );

  expect(result).toEqual([
    {
      $id: 'NAME',
      type: 'string',
      value: 'My Application',
      description: expect.any(String),
    },
  ]);
});

test('should query for all rows from the schema.system table in descending order', async () => {
  const input = await prepareInput(db);

  const result = await db.transaction(
    query(input, schema.system, {
      order: ({ table }, { desc }) => [ desc(table.$id) ],
    }),
  );

  const $idList = result.map((row) => row.$id);

  const sorted = $idList.slice().sort((a, b) => b.localeCompare(a));

  expect($idList).toEqual(sorted);
});

test('should query for all rows from the schema.system table in ascending order', async () => {
  const input = await prepareInput(db);

  const result = await db.transaction(
    query(input, schema.system, {
      order: ({ table }, { asc }) => [ asc(table.$id) ],
    }),
  );

  const $idList = result.map((row) => row.$id);

  const sorted = $idList.slice().sort((a, b) => a.localeCompare(b));

  expect($idList).toEqual(sorted);
});

test('should NOT find the row with the $id "NAME" from the schema.system table without global ambit in the input', async () => {
  const input = await prepareInput(db);

  const result = await db.transaction(
    query({
      ...input,
      ambit: Ambit.Owned,
    }, schema.system, {
      filter: ({ table }, { eq }) => eq(table.$id, 'NAME'),
    }),
  );

  expect(result).toEqual([]);
});
