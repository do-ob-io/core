import { Ambit, nop, Rate } from '@do-ob/core';
import type { Context, Input, Output, Action } from '@do-ob/core/io';
import { database as baseDatabase, Database, Schema } from '@do-ob/data';

export type LogicProcess<C extends Context, A extends Action<string, unknown> = Action<string, unknown>> = (context: C, input: Input<A>) => Promise<Output>;

export type LogicMiddleware<D, C extends Context<D>, P extends LogicProcess<C>> = (next: P) => ReturnType<P>;

export type LogicContext<D = Database> = Context<D>;

type ExtractActionReduction<T> = T extends Action<string, unknown, infer R> ? R : never;

/**
 * Configuration for the logic function wrapper generation.
 */
export interface LogicOptions<
  S extends Record<string, unknown>,
  D extends Database<Schema & S>,
> {
  process?: LogicProcess<LogicContext<D>>;
  database?: () => D;
  log?: (message: string) => void;
}

/**
 * Generates a logic function wrapper for the given schema.
 */
export function logic<
  S extends Record<string, unknown>,
  D extends Database<Schema & S>,
>({
  process = nop as unknown as LogicProcess<LogicContext<D>>,
  database = () => baseDatabase() as D,
  log = console.log,
}: LogicOptions<S, D> = {}) {

  /** Setup context */
  const context: LogicContext<D> = {
    database: database(),
  };

  /**
   * Return the logic dispatch function.
   */
  return async <A extends Action<string, unknown, unknown>>(action: A): Promise<Output<ExtractActionReduction<A>>['payload']> => {
    log(`Dispatching action: ${action.type}`);
    const output = await (process as LogicProcess<LogicContext<D>, A>)(context , {
      action,
      ambit: Ambit.None,
      rate: Rate.None,
      query: {},
      pathname: '/'
    }) as Output<ExtractActionReduction<A>>;

    return output.payload;
  };
}
