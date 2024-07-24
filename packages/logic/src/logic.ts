/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action } from '@do-ob/core/io';
import { Process } from './process';

export interface Logic<P extends Process> {
  dispatch: <A extends Action<string, unknown>>(action: A) => Promise<boolean>;
  _infer: Record<P['key'], P['_infer']>;
}

export type LogicHandlerKeys<
  A extends Action<string, unknown>,
  P extends Process
> = { [K in keyof P['_infer']]: K extends A['type'] ? true : never };

/**
 * Configuration for the logic function wrapper generation.
 */
export interface LogicOptions<
  P extends Process,
> {
  processes?: P[];
}

/**
 * Generates a logic function wrapper for the given schema.
 */
export function logic<
  P extends Process,
>(options: LogicOptions<P> = {}) {

  const {
    processes = [],
  } = options;

  return {
    dispatch: async <
      A extends Action<string, unknown>,
      I extends keyof P['_infer']
    >(
      action: A
    ): Promise<
      { [K in P['key']]: A['type'] extends I ? Awaited<ReturnType<P['_infer'][I]>> : never }
    > => {
      console.log('DISPATCHING', action);
      for (const process of processes) {
        console.log('TO PROCESS', process.key);
      }
      return true as any;
    }
  };

}
