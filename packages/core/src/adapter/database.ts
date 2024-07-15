export interface Database<Schema extends Record<string, object> = Record<string, object>> {
  /**
   * Queries for data in the database.
   */
  query: () => Promise<void>;

  /**
   * Performs a mutation in the database.
   */
  mutate: <K extends keyof Schema>(key: K, values: Schema[K]) => Promise<void>;

  /**
   * Cleanup the database.
   */
  cleanup: () => Promise<void>;
}
