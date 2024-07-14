export interface Database {
  /**
   * Performs a mutation on the database.
   */
  mutate: () => Promise<void>;
}
