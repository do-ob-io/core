import { type Action, Ambit, Rate } from '@do-ob/core/io';
import type { Register } from './register.types';

/**
 * The expected Reduction of the Action
 */
export type RegisterReduction = {
  username: string;
};

export function action(register: Register): Action<'register', Register, RegisterReduction> {
  return {
    type: 'register',
    payload: register
  };
};

export const ambit: Ambit = Ambit.Global;

export const rate: Rate = Rate.Slow;
