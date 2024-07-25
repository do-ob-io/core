/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Action, ActionResult, Output, Context, ActionModule, Input } from '@do-ob/core/io';
// import { OutputStatus, OutputFailureType } from '@do-ob/core/io';
// export type Process<C extends Context, A extends Action<string, unknown> = Action<string, unknown>> = (context: C, input: Input<A>) => Promise<Output>;

// export type ProcessHandlers = Record<string, Process<Context>>;

export type ProcessHandler<
  M extends ActionModule,
  C extends Context,
  R
> = (input: Input<ReturnType<M['act']>>, context: C) => Promise<Output<R>>;

export interface Process<
  K extends string = string,
  // C extends Context = Context,
  M extends ActionModule = ActionModule,
  R = unknown
> {
  key: K;
  _infer_output: Record<M['type'], Output<R>>;
  execute: <A extends Action<string, unknown>>(input: Input<A>) => Promise<A['type'] extends M['type'] ? Output<ActionResult<A>> : undefined>;
}

/**
 * Creates a new logic processing function to handle actions and return results.
 */
export function processify<
  K extends string,
  C extends Context,
  M extends ActionModule,
  R
>(
  /**
   * The key name of the process.
   * This is used to identify the process in the logic system.
   */
  key: K,
  context: C,
  ...handler: [M, ProcessHandler<M, C, R>][]
): Process<K, M, R> {
  const handlers: Record<M['type'], ProcessHandler<M, C, R>> = handler.reduce((acc, [ module, handler ]) => {
    acc[module.type as M['type']] = handler;
    return acc;
  }, {} as Record<M['type'], ProcessHandler<M, C, R>>);
  
  return {
    key,
    execute: async <
      A extends Action<string, unknown>,
    >(input: Input<A>): Promise<A['type'] extends M['type'] ? Output<ActionResult<A>> : undefined> => {
      const handler = handlers[input.action.type as M['type']];
      if (!handler) {
        return undefined as any;
      }

      return handler(input as Input<ReturnType<M['act']>>, context) as Promise<Output<ActionResult<A>>> as any;
    },
  } as Process<K, M, R>;

}
