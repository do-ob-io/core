/**
 * A lite implementation of the clsx utility for conditional className joining.
 *
 * This is a simplified version inspired by the clsx library that handles the most
 * common use cases for combining class names conditionally.
 *
 * @example
 * ```typescript
 * clsx('foo', 'bar'); // 'foo bar'
 * clsx('foo', true && 'bar', false && 'baz'); // 'foo bar'
 * clsx({ foo: true, bar: false }); // 'foo'
 * clsx(['foo', { bar: true }]); // 'foo bar'
 * ```
 */

/**
 * A class value that can be a string, number, boolean, null, undefined,
 * an object with string keys and boolean values, or an array of class values.
 */
export type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>;

/**
 * Combines class names conditionally into a single string.
 *
 * This function accepts any number of arguments which can be strings, numbers,
 * booleans, objects, arrays, or null/undefined. It filters out falsy values
 * and combines the remaining values into a space-separated string.
 *
 * @param inputs - The class values to combine
 * @returns A space-separated string of class names, or empty string if no valid classes
 *
 * @example
 * ```typescript
 * clsx('foo', 'bar') // 'foo bar'
 * clsx('foo', true && 'bar') // 'foo bar'
 * clsx('foo', false && 'bar') // 'foo'
 * clsx({ foo: true, bar: false }) // 'foo'
 * clsx(['foo', 'bar']) // 'foo bar'
 * clsx('foo', null, undefined, '', 0) // 'foo'
 * ```
 */
export function clsx(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
    } else if (typeof input === 'object') {
      if (Array.isArray(input)) {
        // Recursively process array items
        const arrayResult = clsx(...input);
        if (arrayResult) {
          classes.push(arrayResult);
        }
      } else {
        // Process object keys where values are truthy
        for (const [ key, value ] of Object.entries(input)) {
          if (value) {
            classes.push(key);
          }
        }
      }
    }
  }

  return classes.join(' ');
}
