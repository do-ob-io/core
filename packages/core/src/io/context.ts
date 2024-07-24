 
import type { Action } from './action';
// import { Ambit } from './ambit';
import type { Input } from './input';
import type { Adapter } from './adapter';

export interface Context<
  Meta extends Record<string, unknown> = Record<string, unknown>,
  A extends Adapter = Adapter,
  AL extends Record<string, A> = Record<string, A>,
  I = Input<Action<string, unknown>>,
> {
  meta: (input: I) => Promise<Meta>;
  adapter: AL;
}

/**
 * Constructs a full context object with placeholder values.
 */
export function contextify<
  M extends Record<string, unknown>,
  A extends Adapter = Adapter,
  AL extends Record<string, A> = Record<string, A>,
>({
  meta = async () => ({} as M),
  adapter = {} as AL,
}: Partial<Context<M, A, AL>>) {
  return {
    meta,
    adapter,
  };
}
