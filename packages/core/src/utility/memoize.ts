/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * The cache object.
 */
type MemoizedCache<T extends (...args: any[]) => any> = {
  value: ReturnType<T>;
  set: number;
};

/**
 * Options for the memoize function.
 */
interface MemoizeOptions {
  /**
   * The amount of time the cache has to live in milliseconds.
   */
  ttl?: number;
}

/**
 * Memoize a function.
 */
export function memoize<
  T extends (...args: any[]) => any
>(
  fn: T,
  {
    // Default time to live is 5 minutes.
    ttl = 5 * 60 * 1000,
  }: MemoizeOptions = {},
) {
  const cache = new Map<string, MemoizedCache<T>>();

  const memoizedFn = (...args: Parameters<T>): ReturnType<T> => {

    const key = JSON.stringify(args);

    if (cache.has(key)) {
      const goods = cache.get(key) ?? {} as MemoizedCache<T>;
      const set = goods?.set;
      const value = goods?.value;
      if (set && set < Date.now()) {
        cache.delete(key);
      } else {
        return value as ReturnType<T>;
      }
    }

    const value = fn(...args) as ReturnType<T>;
    cache.set(key, { value, set: Date.now() + ttl });
    
    return value;
  };

  return memoizedFn;
}

export default memoize;
