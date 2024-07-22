 
import { Ambit } from './ambit';

export interface Context<
  Database = unknown,
  SchemaInsert extends Record<string, unknown> = Record<string, unknown>,
  Scope = unknown,
> {
  database: Database;
  insert: <K extends keyof SchemaInsert>(table: K, values: SchemaInsert[K][], scope: Scope) => Promise<SchemaInsert[K][]>;
  scoper: Record<Ambit, Scope>;
}

const scoperInitial: Record<Ambit, boolean> = {
  [Ambit.None]: false,
  [Ambit.Owned]: false,
  [Ambit.Created]: false,
  [Ambit.Member]: false,
  [Ambit.Global]: false,
};

export function context<
  Database = unknown,
  SchemaInsert extends Record<string, unknown> = Record<string, unknown>,
  Scope = typeof scoperInitial,
>({
  database = {} as Database,
  insert = async () => [] as SchemaInsert[keyof SchemaInsert][],
  scoper = scoperInitial,
}: Partial<Context>): Context<Database, SchemaInsert, Scope> {
  return {
    database,
    insert: insert as <K extends keyof SchemaInsert>(table: K, values: SchemaInsert[K][], scope: Scope) => Promise<SchemaInsert[K][]>,
    scoper,
  } as Context<Database, SchemaInsert, Scope>;
}
