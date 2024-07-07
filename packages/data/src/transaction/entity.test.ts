import {
  test,
  expect,
  beforeAll,
} from 'vitest';
import { database, Database } from '@do-ob/data/database';
import { schema } from '@do-ob/data/schema';
import { transact, entityInsert } from '@do-ob/data/transaction';

let db: Database;

beforeAll(async () => {
  db = await database();
  // Ensure all rows in the role table are deleted.
  await db.delete(schema.role);
});

// Should insert a new role into the database.
test('should execute an entity insertion transaction', async () => {
  // Should batch the creation of a new entity and role.å
  const roleRecord = await transact(entityInsert('role', { name: 'Administrator' }));

  // Expect that a proper role was inserted correctly.
  expect(roleRecord).toMatchObject({
    $id: roleRecord.$id,
    name: 'Administrator',
    description: null,
    color: null,
    icon: null,
  });
});
