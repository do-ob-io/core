/**
 * Register an account with the server.
 */
export type Register = {
  /**
   * The type of registeration.
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
   * @format base64
   */
  credential: string;

  /**
   * Information about the client application including the origin and challenge code.
   * 
   * @format base64
   */
  client: string;
  
  /**
   * Information about the authenticator used to register the account.
   * 
   * @format base64
   */
  authenticator: string;
} | {
  /**
   * The type of registeration.
   */
  type: 'microsoft_entra',

  /**
   * A unique name to identify the account.
   */
  challenge: string;
};
