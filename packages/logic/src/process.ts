import type { Action, ActionResult, Output, Context, ActionModule } from '@do-ob/core/io';

// export type Process<C extends Context, A extends Action<string, unknown> = Action<string, unknown>> = (context: C, input: Input<A>) => Promise<Output>;

// export type ProcessHandlers = Record<string, Process<Context>>;

export type ProcessHandler<C extends Context, M extends ActionModule> = (context: C, payload: ReturnType<M['act']>['payload']) => Promise<Output<ActionResult<ReturnType<M['act']>>>>;

export interface Process<K extends string, C extends Context> {
  key: K;
  handle: <M extends ActionModule>(module: M, handler: ProcessHandler<C, M>) => void;
  execute: <A extends Action<string, unknown>>(action: A) => Promise<Output<ActionResult<A>> | undefined>;
}

/**
 * Creates a new logic processing function to handle actions and return results.
 */
export function setup<
  K extends string,
  C extends Context
>(
  /**
   * The key name of the process.
   * This is used to identify the process in the logic system.
   */
  key: K,
  context: C,
): Process<K, C> {
  const handlers: Record<string, ProcessHandler<C, ActionModule>> = {};

  return {
    key,
    handle: <M extends ActionModule>(module: M, handler: ProcessHandler<C, M>) => {
      handlers[module.type] = handler as ProcessHandler<C, M>;
    },
    execute: async <A extends Action<string, unknown>>(action: A): Promise<Output<ActionResult<A>> | undefined> => {
      const handler = handlers[action.type];
      if (!handler) {
        return;
      }

      return handler(context, action.payload) as Promise<Output<ActionResult<A>>>;
    }
  };

}
