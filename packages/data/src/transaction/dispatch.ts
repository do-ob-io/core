import type { Transaction } from './transaction.types';

/**
 * Dispatch options.
 */
export interface DispatchStartOptions {
  /**
   * The date and time to initiate the dispatch. The default is immediately.
   */
  initiate?: Date;

  /**
   * The message to describe the dispatch.
   */
  message?: string;
}

/**
 * Performs the database transaction associated with action dispatching.
 */
export function dispatchStart(
  /**
   * The id of the action to dispatch.
   */
  type: string,

  /**
   * The desired payload of the action to dispatch.
   */
  payload: Record<string, unknown> = {},

  /**
   * The options for the dispatch.
   */
  options?: DispatchStartOptions = {},
) {
  return async (tx: Transaction) => {
    
  };
}
