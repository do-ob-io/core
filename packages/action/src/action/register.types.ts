/**
 * Register an account with the server.
 */
export interface Register {
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
