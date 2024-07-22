/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ambit } from './ambit';

// type Arguments<F extends (...args: any) => any> = F extends (...args: infer A) => any ? A : never;

// const sample = (first: string, second: number, third: boolean) => [ first, second, third ] as const;
// type SampleArgs = Arguments<typeof sample>;

// type Sample2 = SampleArgs extends [any, ...infer R] ? R : never;

// const sample2: Sample2 = [ 2, true ];
export interface ContextInner<Scope> {
  scope: Scope;
}

export interface Context<
  Scope = boolean,
  Insert extends (...args: any[]) => Promise<unknown> = (...args: any[]) => Promise<unknown>,
  Query extends (...args: any[]) => Promise<unknown> = (...args: any[]) => Promise<unknown>,
  Update extends (...args: any[]) => Promise<unknown> = (...args: any[]) => Promise<unknown>,
  Remove extends (...args: any[]) => Promise<unknown> = (...args: any[]) => Promise<unknown>,
> {
  insert: (context: ContextInner<Scope>) => Insert;
  query: (context: ContextInner<Scope>) => Query;
  update: (context: ContextInner<Scope>) => Update;
  remove: (context: ContextInner<Scope>) => Remove;
  scoper: (ambit: Ambit) => Scope;
}

// const scoperInitial = () => false;

/**
 * Constructs a partial context object.
 */
export function contextlet<
  Scope,
  Insert extends (...args: any[]) => Promise<unknown>,
  Query extends (...args: any[]) => Promise<unknown>,
  Update extends (...args: any[]) => Promise<unknown>,
  Remove extends (...args: any[]) => Promise<unknown>,
>(options: Partial<Context<Scope, Insert, Query, Update, Remove>>) {
  return options;
}

/**
 * Constructs a full context object with placeholder values.
 */
export function contextify<
  Scope,
  Insert extends (...args: any[]) => Promise<unknown>,
  Query extends (...args: any[]) => Promise<unknown>,
  Update extends (...args: any[]) => Promise<unknown>,
  Remove extends (...args: any[]) => Promise<unknown>,
>({
  insert = () => (async () => []) as Insert,
  query = () => (async () => []) as Query,
  update = () => (async () => []) as Update,
  remove = () => (async () => []) as Remove,
  scoper = () => false as Scope,
}: Partial<Context<Scope, Insert, Query, Update, Remove>>) {
  return {
    insert,
    query,
    update,
    remove,
    scoper,
  };
}
