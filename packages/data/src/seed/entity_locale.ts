import dictionaryAction from '@do-ob/action/dictionary';
import type { Schema } from '@do-ob/data/schema';

export const records: Array<Omit<Schema['locale']['$inferInsert'], '$id'>> = Object.keys(dictionaryAction).map((key) => {
  return {
    code: 'en-US',
    name: key,
    content: dictionaryAction[key as keyof typeof dictionaryAction]
  };
});
