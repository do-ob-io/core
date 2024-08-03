/**
 * Extracts the arguments from a function type.
 */
export type Arguments<F extends (...args: any) => any> = F extends (...args: infer A) => any ? A : never;

/**
 * Converts an array of objects with a key property to a record mapped by that key value.
 */
export type ArrayToRecord<T extends { key: string }[]> = {
  [K in T[number]['key']]: Extract<T[number], { key: K }>
};
