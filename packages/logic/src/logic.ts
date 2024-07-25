/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { inputify, type Action } from '@do-ob/core/io';
import type { Process } from './process';

export interface LogicDispatchOptions {
  client?: () => number;
  headers?: () => Record<string, string>;
}

export interface Logic<P extends Process> {
  dispatch: <A extends Action<string, unknown>, I extends keyof P['_infer_output']>(
    action: A,
    options?: LogicDispatchOptions,
  ) => Promise<
    { [K in P['key']]: A['type'] extends I ? P['_infer_output'][I] : never }
  >;
}

export type LogicHandlerKeys<
  A extends Action<string, unknown>,
  P extends Process
> = { [K in keyof P['_infer_output']]: K extends A['type'] ? true : never };

/**
 * Configuration for the logic function wrapper generation.
 */
export interface LogicOptions<
  P extends Process,
> {
  /**
   * List processes used to hande action dispatches.
   */
  processes?: P[];
}

/**
 * Generates a logic function wrapper for the given schema.
 */
export function logic<
  P extends Process,
>(options: LogicOptions<P> = {}): Logic<P> {

  const {
    processes = [],
  } = options;

  const processKeys = processes.map((process) => process.key);

  return {
    dispatch: async <
      A extends Action<string, unknown>,
      I extends keyof P['_infer_output']
    >(
      action: A,
      options: LogicDispatchOptions = {},
    ): Promise<
      { [K in P['key']]: A['type'] extends I ? P['_infer_output'][I] : never }
    > => {

      const input = inputify({
        action: action,
        client: options.client?.() ?? 0,
        headers: options.headers?.() ?? {},
      });
      
      const processPromises = processes.map(
        async (process) => process.execute(input)
      );

      const results = await Promise.all(processPromises);
      return results.reduce((acc, result, index) => {
        if (!result) {
          return acc;
        }
        acc[processKeys[index] as P['key']] = result;
        return acc;
      }, {} as Record<P['key'], any>);
    }
  };

}
