import { uuidv4 } from '@do-ob/core';
import type { Schema } from '@do-ob/data/schema';

export const records: Array<Schema['entity_role']['$inferInsert']> = [
  {
    $id: uuidv4(),
    name: 'admin',
    description: 'The administrator role.',
    color: '#FF0000',
  },
  {
    $id: uuidv4(),
    name: 'user',
    description: 'The user role.',
    color: '#00FF00',
  },
  {
    $id: uuidv4(),
    name: 'anonymous',
    description: 'The anonymous role.',
    color: '#0000FF',
  },
];
