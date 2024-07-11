/**
 * How many times an action can be performed in a given time period. The actual rates are determined in the logic layer.
 */
export enum Rate {
  /**
   * Can never be performed at all.
   */
  None,

  /**
   * Can only be performed at a slow rate.
   */
  Slow,

  /**
   * Can be performed at the regular system rate.
   */
  Regular,

  /**
   * Can be performed at a higher rate than normal.
   */
  Elevated,

  /**
   * Can be performed at the highest rate.
   */
  Unlimited,
}
