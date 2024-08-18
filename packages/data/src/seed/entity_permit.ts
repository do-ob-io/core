import { Ambit, Rate, uuidv4 } from '@do-ob/core';
import { records as roles } from './entity_role';
import type { SchemaCore } from '@do-ob/data/schema';
import { records as actions } from './action';

/**
 * Anonymous Permits
 */
const permitsAnonymous: Array<SchemaCore['entity_permit']['$inferInsert']> = [
  {
    $id: uuidv4(),
    $action: actions.find((actions) => actions.$id === 'register')!.$id,
    $entity: roles.find((role) => role.name === 'Anonymous')!.$id,
    ambit: Ambit.None,
    rate: Rate.Slow,
  },
  {
    $id: uuidv4(),
    $action: actions.find((actions) => actions.$id === 'get_definition')!.$id,
    $entity: roles.find((role) => role.name === 'Anonymous')!.$id,
    ambit: Ambit.Public,
    rate: Rate.Regular,
  },
];

/**
 * User Permits
 */
const permitsUser: Array<SchemaCore['entity_permit']['$inferInsert']> = [
  {
    $id: uuidv4(),
    $action: actions.find((actions) => actions.$id === 'get_account')!.$id,
    $entity: roles.find((role) => role.name === 'User')!.$id,
    ambit: Ambit.Public | Ambit.Owned,
    rate: Rate.Slow,
  },
  {
    $id: uuidv4(),
    $action: actions.find((actions) => actions.$id === 'get_definition')!.$id,
    $entity: roles.find((role) => role.name === 'User')!.$id,
    ambit: Ambit.Public | Ambit.Owned,
    rate: Rate.Slow,
  },
];

export const records: Array<SchemaCore['entity_permit']['$inferInsert']> = [
  ...permitsAnonymous,
  ...permitsUser,
];
