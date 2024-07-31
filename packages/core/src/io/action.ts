 
import type { Ambit } from './ambit';
import type { Rate } from './rate';

export interface Action<Type extends string, Payload> {
  type: Type;
  payload: Payload;
}

export type Act<Type extends string, Payload = unknown, Arguments extends Array<any> = any[]> = (...args: Arguments) => Action<Type, Payload>;

export type ActionModule<
  Type extends string = string,
  Action extends Act<string, unknown> = Act<string, unknown>,
> = {
  type: Type;
  act: Action;
  ambit?: Ambit;
  rate?: Rate;
};
