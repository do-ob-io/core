 
/**
 * The cache object.
 */
type MemoizedCache<T extends (...args: any[]) => any> = {
  value: ReturnType<T>;
  set?: number;
};

/**
 * Options for the memoize function.
 */
interface MemoizeOptions {
  /**
   * Set the dependencies for the memoized function instead of the arguments.
   */
  deps?: any[];

  /**
   * The amount of time the cache has to live in milliseconds.
   * 
   * @default undefined
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
    deps,
    ttl,
  }: MemoizeOptions = {},
) {
  const cache = new Map<string, MemoizedCache<T>>();

  const memoizedFn = (...args: Parameters<T>): ReturnType<T> => {

    const key = JSON.stringify(deps ?? args);

    if (cache.has(key)) {
      const goods = cache.get(key) ?? {} as MemoizedCache<T>;
      const set = goods?.set;
      const value = goods?.value;
      if (!!set && set < Date.now()) {
        cache.delete(key);
      } else {
        return value as ReturnType<T>;
      }
    }

    const value = fn(...args) as ReturnType<T>;
    cache.set(key, { value, set: ttl && Date.now() + ttl });
    
    return value;
  };

  return memoizedFn;
}

export default memoize;
