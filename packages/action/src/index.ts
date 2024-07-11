import type { Action } from './types';
import type { Register } from './action/register.types';
import * as register from './action/register';

export async function schema($id: string = 'action.json') {
  const definitions = await import('@do-ob/action/schema');

  return {
    $id,
    $schema: 'http://json-schema.org/draft-07/schema',
    definitions: {
      ...definitions
    }
  };
}

export {
  Action,
  Register,
  register
};
