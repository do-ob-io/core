import { inputify, outputify, type Action } from '@do-ob/core';
import type { Process } from '@do-ob/logic/process';

// type ArrayToRecord<T extends Process[]> = {
//   [K in T[number]['key']]: Extract<T[number], { key: K }>
// };

export interface LogicDispatchOptions {
  client?: () => number;
  headers?: () => Record<string, string>;
}

// export interface Logic<P extends Process> {
//   dispatch: <A extends Action<string, unknown>, I extends keyof P['_']['output']>(
//     action: A,
//     options?: LogicDispatchOptions,
//   ) => Promise<
//     { [K in P['key']]: A['type'] extends I ? P['_']['output'][I] : never }
//   >;
// }

export type LogicHandlerKeys<
  A extends Action<string, unknown>,
  P extends Process
> = { [K in keyof P['_']['output']]: K extends A['type'] ? true : never };

/**
 * Configuration for the logic function wrapper generation.
 */
export interface LogicOptions<
  T extends Record<string, Process>
> {
  /**
   * List processes used to hande action dispatches.
   */
  pool?: T;
}

/**
 * Generates a logic function wrapper for the given schema.
 */
export function logician<
  P extends Process,
  T extends Record<string, P>
>(options: LogicOptions<T> = {}) {

  const {
    pool = {},
  } = options;

  const poolKeys = Object.keys(pool) as Array<keyof T>;
  const processes = Object.values(pool) as Array<P>;
  
  return {
    dispatch: async <
      A extends Action<string, unknown>,
    >(
      action: A,
      options: LogicDispatchOptions = {},
    ): Promise<
      { [K in keyof T]: A['type'] extends keyof T[K]['_']['output'] ? T[K]['_']['output'][A['type']] : never }
    > => {

      const input = inputify({
        action: action,
        client: options.client?.() ?? 0,
        headers: options.headers?.() ?? {},
      });
      
      const processPromises = processes.map(
        async (process) => process.execute(input)
      );

      const results = await Promise.allSettled(processPromises);
      return results.reduce((acc, result, index) => {
        if (!result) {
          return acc;
        }
        if(result.status === 'rejected') {
          acc[poolKeys[index] as keyof T] = outputify({
            status: 0,
            payload: result.reason,
          });
          return acc;
        }

        acc[poolKeys[index] as keyof T] = result.value;
        return acc;
      }, {} as Record<keyof T, any>);
    }
  };

}
