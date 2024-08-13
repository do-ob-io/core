import dictionaryAction from '@do-ob/action/dictionary';
import { uuidv4 } from '@do-ob/core';
import type { SchemaCore } from '@do-ob/data/schema';

const actionDictionary = Object.keys(dictionaryAction).map((key) => {
  return {
    $id: uuidv4(),
    code: 'en-US',
    name: key,
    content: dictionaryAction[key as keyof typeof dictionaryAction]
  };
});

export const records: Array<SchemaCore['entity_locale']['$inferInsert']> = actionDictionary;
