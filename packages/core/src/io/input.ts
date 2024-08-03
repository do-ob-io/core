import { nanoid } from '@do-ob/core/utility';
import type { Action } from './action';
import { Ambit } from './ambit';
import { Rate } from './rate';

export type Input<
  A extends Action<string, unknown> = Action<string, unknown>,
  Session extends object = object,
  Access extends object = object
> = {
  /**
   * Hashed client number for identification.
   */
  client: number;

  /**
   * The identifier of this dispatch. This is unique for every input.
   */
  $dispatch: string;

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
   * Headers
   */
  headers: Record<string, string>;

  /**
   * Pathname. (e.g. /api/v1/users)
   */
  pathname: string;

  /**
   * Language code.
   */
  language?: string;

  /**
   * An access object.
   */
  access?: Access;

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

/**
 * Constructs a new input object with placeholder values.
 */
export function inputify<
  A extends Action<string, unknown>,
>(
  input: Partial<Input<A>>,
) {
  return {
    client: input.client || 0,
    $dispatch: input.$dispatch || nanoid(),
    action: input.action as A,
    ambit: Ambit.None,
    rate: Rate.None,
    query: {},
    headers: {},
    pathname: '/',
    ...input,
  } satisfies Input<A>;
}
