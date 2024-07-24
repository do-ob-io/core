/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from './input';

/**
 * A method used in an adapter.
 */
export type AdapterMethod<A extends any[] = any[], R = unknown> = (...args: A) => R;

/**
 * Provides adapter methods for IO operations.
 */
export type Adapter<
  M extends AdapterMethod = AdapterMethod
> = Record<string, (input: Input) => M>;
    

/**
 * Builds an adapter object.
 */
export function adaptify<
  M extends AdapterMethod,
  A extends Adapter<M>,
>(
  adapter: A
) {
  return adapter as typeof adapter;
}
