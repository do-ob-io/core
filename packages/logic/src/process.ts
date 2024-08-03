 
import type { Action, Context, ActionModule, Input, Output } from '@do-ob/core';
import { outputify } from '@do-ob/core';
// import { OutputStatus, OutputFailureType } from '@do-ob/core/io';
// export type Process<C extends Context, A extends Action<string, unknown> = Action<string, unknown>> = (context: C, input: Input<A>) => Promise<Output>;

// export type ProcessHandlers = Record<string, Process<Context>>;

export type ProcessHandler<
  C extends Context = Context,
  M extends ActionModule = ActionModule,
  R = unknown
> = (input: Input<ReturnType<M['act']>>, adapter: C['adapter']) => Promise<R>;

export interface Process<
  L extends [ActionModule, any][] = [ActionModule, any][],
> {
  _: {
    output: { [ K in L[number][0]['type']]: Output<Awaited<
      ReturnType<Extract<L[number], [{ type: K }, ProcessHandler ]>[1]>
    >> };
  }
  execute: <A extends Action<string, unknown>>(input: Input<A>) => Promise<A['type'] extends L[number][0]['type'] ?
    Output<Awaited<ReturnType<Extract<L[number], [{ type: A['type'] }, ProcessHandler ]>[1]>>> :
    undefined
  >;
}

/**
 * Creates a new logic processing function to handle actions and return results.
 */
export function processify<
  C extends Context,
  H extends ProcessHandler<C>,
  L extends [ActionModule, H][],
>(
  context: C,
  ...handler: L
): Process<L> {
  const handlers: Record<string, ProcessHandler<C>> = handler.reduce((acc, [ module, handle ]) => {
    acc[module.type] = handle;
    return acc;
  }, {} as Record<string, ProcessHandler<C>>);
  
  const process: Process<L> = {
    execute: async (input) => {
      const handler = handlers[input.action.type];
      if (!handler) {
        return undefined as any;
      }

      const payload = await handler(input, context.adapter);

      return outputify({
        status: 1,
        payload,
      }) as any;
    },
  } as Process<L>;

  return process;

}
