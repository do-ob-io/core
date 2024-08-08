import type { Schema } from '@do-ob/data/schema';

export const records: Array<Omit<Schema['role']['$inferInsert'], '$id'>> = [
  {
    name: 'admin',
    description: 'The administrator role.',
    color: '#FF0000',
  },
  {
    name: 'user',
    description: 'The user role.',
    color: '#00FF00',
  },
  {
    name: 'anonymous',
    description: 'The anonymous role.',
    color: '#0000FF',
  },
];
