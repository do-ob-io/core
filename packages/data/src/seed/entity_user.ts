import { uuidv4 } from '@do-ob/core';
import type { SchemaCore } from '@do-ob/data/schema';

export const records: Array<SchemaCore['entity_user']['$inferInsert']> = [
  {
    $id: uuidv4(),
    name: 'admin',
  },
  {
    $id: uuidv4(),
    name: 'alice',
  },
  {
    $id: uuidv4(),
    name: 'bob',
  },
  {
    $id: uuidv4(),
    name: 'carol',
  },
];
