import type { Schema } from '@do-ob/data/schema';
import { records as users } from './entity_user';
import { records as roles } from './entity_role';

export const records: Array<Schema['join_assignment']['$inferInsert']> = [
  {
    $entity: users.find((user) => user.name === 'user')!.$id,
    $role: roles.find((role) => role.name === 'Base')!.$id,
  },
];
