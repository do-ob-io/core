import {
  test,
  expect,
  assert,
  beforeAll,
} from 'vitest';
import { database, Database } from '@do-ob/data/database';
import { role } from '@do-ob/data/schema';
import { transact, roleInsert } from '@do-ob/data/transaction';

let db: Database;

beforeAll(async () => {
  db = await database();
  // Ensure all rows in the role table are deleted.
  await db.delete(role);
});

// Should insert a new role into the database.
test('should insert role', async () => {
  // Should batch the creation of a new entity and role.
  const roleRecord = await transact(roleInsert({ name: 'Administrator' }));

  // Expect that a proper role was inserted correctly.
  expect(roleRecord).toMatchObject({
    $id: roleRecord.$id,
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
      $owner: null,
      $creator: null,
    },
  });
});
