/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action } from './action';
// import { Ambit } from './ambit';
import { Input } from './input';

export interface Contextify<
  Meta extends Record<string, unknown> = Record<string, unknown>,
  Insert extends (...args: any[]) => Promise<unknown> = (...args: any[]) => Promise<unknown>,
  Query extends (...args: any[]) => Promise<unknown> = (...args: any[]) => Promise<unknown>,
  Update extends (...args: any[]) => Promise<unknown> = (...args: any[]) => Promise<unknown>,
  Remove extends (...args: any[]) => Promise<unknown> = (...args: any[]) => Promise<unknown>,
  I = Input<Action<string, unknown>>,
> {
  meta: (input: I) => Promise<Meta>;
  insert: (input: I, meta: Meta) => Insert;
  query: (input: I, meta: Meta) => Query;
  update: (input: I, meta: Meta) => Update;
  remove: (input: I, meta: Meta) => Remove;
}

// const scoperInitial = () => false;

/**
 * Constructs a partial context object.
 */
export function contextlet<
  Meta extends Record<string, unknown>,
  Insert extends (...args: any[]) => Promise<unknown>,
  Query extends (...args: any[]) => Promise<unknown>,
  Update extends (...args: any[]) => Promise<unknown>,
  Remove extends (...args: any[]) => Promise<unknown>,
>(options: Partial<Contextify<Meta, Insert, Query, Update, Remove>>) {
  return options;
}

/**
 * Constructs a full context object with placeholder values.
 */
export function contextify<
  Meta extends Record<string, unknown>,
  Insert extends (...args: any[]) => Promise<unknown>,
  Query extends (...args: any[]) => Promise<unknown>,
  Update extends (...args: any[]) => Promise<unknown>,
  Remove extends (...args: any[]) => Promise<unknown>,
>({
  meta = async () => ({} as Meta),

  insert = () => (async () => []) as Insert,
  query = () => (async () => []) as Query,
  update = () => (async () => []) as Update,
  remove = () => (async () => []) as Remove,
}: Partial<Contextify<Meta, Insert, Query, Update, Remove>>) {
  return {
    meta,
    insert,
    query,
    update,
    remove,
  };
}
