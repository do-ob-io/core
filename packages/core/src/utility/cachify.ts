export const cachify = () => {
  const mem: Record<string, any> = {};

  return {

    /**
     * memo hook
     */
    memo: <T>(key: string, fn: () => T ) => {
      if (key in mem) {
        return mem[key] as T;
      }
      const value = fn();
      mem[key] = value;
      return value;
    },

    /**
     * Gets a value from the cache.
     */
    get: (key: string) => mem[key],

    /**
     * Sets a value in the cache.
     */
    set: (key: string, value: any) => {
      mem[key] = value;
    },

    /**
     * Deletes a value from the cache.
     */
    delete: (key: string) => {
      delete mem[key];
    },

    /**
     * Clears the cache.
     */
    clear: () => {
      for (const key in mem) {
        delete mem[key];
      }
    }
  };

};
