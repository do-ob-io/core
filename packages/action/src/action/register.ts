import { type Action, Ambit, Rate } from '@do-ob/core/io';
import type { Register } from './register.types';

export function action(register: Register): Action<'register', Register> {
  return {
    type: 'register',
    payload: register
  };
};

export const ambit: Ambit = Ambit.Global;

export const rate: Rate = Rate.Slow;
