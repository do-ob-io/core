import type { Action } from './action';
import { Ambit } from './ambit';
import { Rate } from './rate';

export type Input<
  Session extends object = object,
  Access extends object = object
> = {

  /**
   * The action to perform.
   */
  action?: Action<string, unknown>;

  /**
   * Ambits applied to the action processing.
   */
  ambit: Ambit;

  /**
   * The rate at which the action can be performed.
   */
  rate: Rate;

  /**
   * Query parameters.
   */
  query: Record<string, string | undefined>;

  /**
   * Pathname. (e.g. /api/v1/users)
   */
  pathname: string;

  /**
   * Language code.
   */
  language: string;

  /**
   * Session details.
   */
  session?: Session;

  /**
   * Access token.
   */
  access?: Access;

  /**
   * The subject identifier.
   */
  $subject?: string;

  /**
   * IP Address.
   */
  ip?: string;

};
