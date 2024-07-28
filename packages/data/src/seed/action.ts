import * as actionSchema from '@do-ob/action/schema';
import { SchemaInsert } from '@do-ob/data/schema';

export const records: Array<SchemaInsert['action']> = Object.keys(actionSchema).map((key) => {
  const definition = actionSchema[key as keyof typeof actionSchema];

  if  (!definition) {
    throw new Error(`No definition found for ${key}`);
  }

  return {
    $id: definition.$id,
    definition: definition,
    description: actionSchema.register.description,
  };
});
