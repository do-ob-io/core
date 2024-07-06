import {
  test,
  expect,
  assert,
  beforeAll,
} from 'vitest';
import { database, Database } from '@do-ob/data/database';
import { role, entity } from '@do-ob/data/schema';

let db: Database;

beforeAll(async () => {
  db = await database();
  // Ensure all rows in the role table are deleted.
  await db.delete(role);
});

// Should insert a new role into the database.
test('should insert role', async () => {
  // Insert a new entity into the database.
  // This is necessary to create a role.
  const resultInsertEntity0 = (await db.insert(entity).values({
    type: 'role',
  }).returning())[0];
  expect(resultInsertEntity0.$id).toMatch(/^[0-9a-f-]{36}$/);

  const resultInsert = await db.insert(role).values({
    $id: resultInsertEntity0.$id,
    name: 'Administrator',
  }).returning();

  // The result should be an array with a single object.
  expect(resultInsert).toHaveLength(1);

  // The object should be the role that was inserted.
  const resultInsertRole0 = resultInsert[0];

  // Expect that a proper role was inserted correctly.
  expect(resultInsertRole0).toMatchObject({
    $id: resultInsertEntity0.$id,
    name: 'Administrator',
    description: null,
    color: null,
    icon: null,
  });
});

test('should query for the first role with the entity relation', async () => {
  // Query for all roles with the entity relation.
  const resultSelect = await db.query.role.findFirst({
    with: {
      entity: true,
    }
  });

  // Assert that the result is not falsy.
  assert(resultSelect);

  // Expect that a proper role was inserted correctly.
  expect(resultSelect).toMatchObject({
    $id: resultSelect.$id,
    name: 'Administrator',
    description: null,
    color: null,
    icon: null,
    entity: {
      $id: resultSelect.$id,
      type: 'role',
      created: resultSelect.entity.created,
      updated: resultSelect.entity.updated,
      deleted: false,
      ownerId: null,
      creatorId: null,
    },
  });
});
