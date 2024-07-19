/* eslint-disable @typescript-eslint/no-explicit-any */
 
export interface Action<Type extends string, Payload, Reduction = unknown> {
  type: Type;
  payload: Payload;
  _reduction?: Reduction;
}

export type ActionFunction<Type extends string, Payload, Arguments extends Array<any> = any[]> = (...args: Arguments) => Action<Type, Payload>;
