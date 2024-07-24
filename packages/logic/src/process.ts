/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Action, ActionResult, Output, Context, ActionModule, Input } from '@do-ob/core/io';
// import { OutputStatus, OutputFailureType } from '@do-ob/core/io';
// export type Process<C extends Context, A extends Action<string, unknown> = Action<string, unknown>> = (context: C, input: Input<A>) => Promise<Output>;

// export type ProcessHandlers = Record<string, Process<Context>>;

export type ProcessHandler<
  M extends ActionModule,
  C extends Context,
> = (input: Input<ReturnType<M['act']>>, context: C) => Promise<Output<ActionResult<ReturnType<M['act']>>>>;

export interface Process<
  K extends string = string,
  C extends Context = Context,
  M extends ActionModule = ActionModule,
> {
  key: K;
  _infer: Record<M['type'], ProcessHandler<M, C>>;
  execute: <A extends Action<string, unknown>>(input: Input<A>) => Promise<A['type'] extends M['type'] ? Output<ActionResult<A>> : undefined>;
}

/**
 * Creates a new logic processing function to handle actions and return results.
 */
export function processify<
  K extends string,
  C extends Context,
  M extends ActionModule,
>(
  /**
   * The key name of the process.
   * This is used to identify the process in the logic system.
   */
  key: K,
  context: C,
  ...handler: [M, ProcessHandler<M, C>][]
): Process<K, C, M> {
  const handlers: Record<M['type'], ProcessHandler<M, C>> = handler.reduce((acc, [ module, handler ]) => {
    acc[module.type as M['type']] = handler;
    return acc;
  }, {} as Record<M['type'], ProcessHandler<M, C>>);
  
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
    _infer: handlers,
  };

}
