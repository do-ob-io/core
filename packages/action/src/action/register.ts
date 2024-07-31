import { type Action, Ambit, Rate } from '@do-ob/core/io';

/**
 * Register an account with the server.
 */
export type Payload = {
  /**
   * The type of registration.
   */
  type: 'webauthn';

  /**
   * A unique name to identify the account.
   * 
   * @format handle
   */
  handle: string;
  
  /**
   * The public key credential to associate with the account.
   * 
   * @format byte
   * @writeOnly
   */
  credential: string;

  /**
   * 
   * Information about the client application including the origin and challenge code.
   * 
   * @format byte
   * @writeOnly
   */
  client: string;
  
  /**
   * Information about the authenticator used to register the account.
   * 
   * @format byte
   * @writeOnly
   */
  authenticator: string;
};


export const type = 'register';

export function act(payload: Payload): Action<typeof type, Payload> {
  return {
    type,
    payload,
  };
};

export const ambit: Ambit = Ambit.Global;

export const rate: Rate = Rate.Slow;
