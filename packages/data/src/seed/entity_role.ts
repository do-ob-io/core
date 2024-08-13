import { uuidv4 } from '@do-ob/core';
import type { Schema } from '@do-ob/data/schema';

export const records: Array<Schema['entity_role']['$inferInsert']> = [
  {
    $id: uuidv4(),
    name: 'Administrator',
    description: 'The administrator role.',
    color: '#FF0000',
  },
  {
    $id: uuidv4(),
    name: 'Base',
    description: 'Base role of permissions.',
    color: '#00FF00',
  },
  {
    $id: uuidv4(),
    name: 'Anonymous',
    description: 'The anonymous role.',
    color: '#888888',
  },
];
