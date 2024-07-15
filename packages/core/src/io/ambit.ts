/**
 * The scope in which an action is permitted to perform within.
 */
export enum Ambit {
  /**
   * No scope range.
   */
  None = 0,

  /**
   * Action applies to the subject's owned entity/entities.
   */
  Owned = 1 << 0,

  /**
   * The action applies to the subject's created entity/entities.
   */
  Created = 1 << 1,

  /**
   * The action applies to the subject's memerships to an owned entity/entities.
   */
  Member = 1 << 2,

  /**
   * Unlimited scope.
   */
  Global = 1 << 3,
}

/**
 * Returns an ambit value based on the given scope.
 */
export function ambit(scope: Ambit): Ambit {
  return scope;
}
