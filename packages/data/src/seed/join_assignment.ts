import type { SchemaCore } from '@do-ob/data/schema';
import { records as users } from './entity_user';
import { records as roles } from './entity_role';

export const records: Array<SchemaCore['join_assignment']['$inferInsert']> = [
  {
    $entity: users.find((user) => user.name === 'admin')!.$id,
    $role: roles.find((role) => role.name === 'Administrator')!.$id,
  },
  {
    $entity: users.find((user) => user.name === 'alice')!.$id,
    $role: roles.find((role) => role.name === 'Base')!.$id,
  },
  {
    $entity: users.find((user) => user.name === 'bob')!.$id,
    $role: roles.find((role) => role.name === 'Base')!.$id,
  },
  {
    $entity: users.find((user) => user.name === 'carol')!.$id,
    $role: roles.find((role) => role.name === 'Base')!.$id,
  },
];
