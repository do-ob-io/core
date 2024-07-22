import { type Action, Ambit, Rate } from '@do-ob/core/io';
import type { Register } from './register.types';

/**
 * The expected Reduction of the Action
 */
export type RegisterReduction = {
  username: string;
};

export const type = 'register';

export function act(register: Register): Action<typeof type, Register, RegisterReduction> {
  return {
    type,
    payload: register
  };
};

export const ambit: Ambit = Ambit.Global;

export const rate: Rate = Rate.Slow;
