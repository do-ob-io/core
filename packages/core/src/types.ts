/**
 * Extracts the arguments from a function type.
 */
export type Arguments<F extends (...args: any) => any> = F extends (...args: infer A) => any ? A : never;
