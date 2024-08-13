import { assert } from 'vitest';
import { Database } from '@do-ob/data/database';
import { schemaCore } from '@do-ob/data/schema';
import { Ambit, inputify } from '@do-ob/core';

export async function prepareInput(db: Database) {
  const register = await db.query.system.findFirst({
    where: (table, { eq }) => eq(table.$id, 'SYSTEM_SUBJECT'),
  });
  assert(register);

  const [ dispatch ] = await db.insert(schemaCore.dispatch).values({
    $subject: register.value,
    $action: 'register',
  }).returning({ $id: schemaCore.dispatch.$id });

  return inputify({
    $dispatch: dispatch.$id,
    $subject: register.value,
    ambit: Ambit.Global, 
  });
}
