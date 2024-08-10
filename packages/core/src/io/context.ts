import type { Adapter } from './adapter';
import { Input } from './input';
import { Output } from './output';

export interface Context<
  A extends Adapter = Adapter,
  AL extends Record<string, A> = Record<string, A>,
> {
  adapter: AL;
  middleware: ((input: Input, next: (input: Input) => Output) => Output)[];
}

/**
 * Constructs a full context object with placeholder values.
 */
export function contextify<
  A extends Adapter = Adapter,
  AL extends Record<string, A> = Record<string, A>,
>({
  adapter = {} as AL,
  middleware = [],
}: Partial<Context<A, AL>>) {
  return {
    adapter,
    middleware
  };
}
