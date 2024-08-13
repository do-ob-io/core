import { uuidv4 } from '@do-ob/core';
import type { Schema } from '@do-ob/data/schema';

export const records: Array<Schema['entity_user']['$inferInsert']> = [
  {
    $id: uuidv4(),
    name: 'user',
  },
];
