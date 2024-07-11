import type { Action } from '@do-ob/action/types';
import type { Register } from './register.types';

/**
 * The action function.
 */
export function action(registration: Register): Action<'register', Register> {
  return {
    type: 'register',
    payload: registration
  };
}
