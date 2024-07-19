import type { Action } from './action';
import { Ambit } from './ambit';
import { Rate } from './rate';

export type Input<
  A extends Action<string, unknown> = Action<string, unknown>,
  Session extends object = object,
  Access extends object = object
> = {

  /**
   * The action to perform.
   */
  action: A;

  /**
   * Ambits applied to the logic processing.
   */
  ambit: Ambit;

  /**
   * The rate at which the processing can be performed.
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
  language?: string;

  /**
   * An encoded access token.
   */
  _access?: Access;

  /**
   * An access object.
   */
  access?: Access;

  /**
   * Session identifier.
   */
  $session?: string;

  /**
   * A session object.
   */
  session?: Session;

  /**
   * The subject identifier.
   */
  $subject?: string;

  /**
   * IP Address.
   */
  ip?: string;

};
