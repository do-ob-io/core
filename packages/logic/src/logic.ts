/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action } from '@do-ob/core/io';
import { Process } from './process';

export interface Logic<P extends Process> {
  dispatch: <A extends Action<string, unknown>>(action: A) => Promise<boolean>;
  _infer: Record<P['key'], P['_infer']>;
}

export type LogicResult<
  A extends Action<string, unknown>,
  P extends Process
> = { [K in P['key']]: keyof P['_infer'] extends A['type'] ? true : undefined };

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
      A extends Action<string, unknown>
    >(
      action: A
    ): Promise<LogicResult<A, P>> => {
      console.log('DISPATCHING', action);
      for (const process of processes) {
        console.log('TO PROCESS', process.key);
      }
      return true as any;
    }
  };

}
