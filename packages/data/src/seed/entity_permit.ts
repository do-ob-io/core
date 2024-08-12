import { Ambit, Rate, uuidv4 } from '@do-ob/core';
import { records as roles } from './entity_role';
import type { Schema } from '@do-ob/data/schema';
import { records as actions } from './action';

export const records: Array<Schema['entity_permit']['$inferInsert']> = [
  {
    $id: uuidv4(),
    $action: actions.find((actions) => actions.$id === 'register')!.$id,
    $entity: roles.find((role) => role.name === 'anonymous')!.$id,
    ambit: Ambit.None,
    rate: Rate.Slow,
  },
  {
    $id: uuidv4(),
    $action: actions.find((actions) => actions.$id === 'get_text')!.$id,
    $entity: roles.find((role) => role.name === 'anonymous')!.$id,
    ambit: Ambit.None,
    rate: Rate.Slow,
  }
];
