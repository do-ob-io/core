/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Ambit } from './ambit';
import type { Rate } from './rate';

export interface Action<Type extends string, Payload, Reduction = unknown> {
  type: Type;
  payload: Payload;
  _reduction?: Reduction;
}

export type ActionFunction<Type extends string, Payload = unknown, Arguments extends Array<any> = any[]> = (...args: Arguments) => Action<Type, Payload>;

export type ActionResult<T> = T extends Action<string, unknown, infer R> ? R : never;

export type ActionModule<
  Type extends string = string,
  Action extends ActionFunction<string, unknown> = ActionFunction<string, unknown>,
> = {
  type: Type;
  action: Action;
  ambit: Ambit;
  rate: Rate;
};
