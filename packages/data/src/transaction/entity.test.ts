import {
  test,
  expect,
} from 'vitest';
import { transact, entityInsert } from '@do-ob/data/transaction';


// Should insert a new role into the database.
test('should execute an entity insertion transaction', async () => {
  // Should batch the creation of a new entity and role.å
  const roleRecord = await transact(entityInsert('entity_role', { name: 'Administrator' }));

  // Expect that a proper role was inserted correctly.
  expect(roleRecord).toMatchObject({
    $id: roleRecord.$id,
    name: 'Administrator',
    description: null,
    color: null,
    icon: null,
    entity: {
      $id: roleRecord.entity.$id,
      type: 'entity_role',
      $owner: null,
      $creator: null,
    },
  });
});

// Should insert a new role entity into the database with an owner and creator.
test('should execute an entity insertion transaction with owner and creator', async () => {
  // Should batch the creation of a new entity and role.
  const roleRecord = await transact(entityInsert('entity_role', { name: 'Moderator' }, {
    $owner: '00000000-0000-0000-0000-000000000000',
    $creator: '00000000-0000-0000-0000-000000000000',
  }));

  // Expect that a proper role was inserted correctly.
  expect(roleRecord).toMatchObject({
    $id: roleRecord.$id,
    name: 'Moderator',
    description: null,
    color: null,
    icon: null,
    entity: {
      $id: roleRecord.entity.$id,
      type: 'entity_role',
      $owner: '00000000-0000-0000-0000-000000000000',
      $creator: '00000000-0000-0000-0000-000000000000',
    },
  });
});
