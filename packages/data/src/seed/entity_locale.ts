import dictionaryAction from '@do-ob/action/dictionary';
import { uuidv4 } from '@do-ob/core';
import type { Schema } from '@do-ob/data/schema';

export const records: Array<Schema['entity_locale']['$inferInsert']> = Object.keys(dictionaryAction).map((key) => {
  return {
    $id: uuidv4(),
    code: 'en-US',
    name: key,
    content: dictionaryAction[key as keyof typeof dictionaryAction]
  };
});
