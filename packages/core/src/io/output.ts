export enum OutputStatus {
  Success = 1,
  Failure = 0,
}

export enum OutputError {
  Unauthorized,
  Forbidden,
  NotFound,
  Conflict,
  InternalServerError,
}

export type Output<
  Payload = unknown
> = {
  /**
   * Status of the output.
   */
  status: OutputStatus.Success;

  /**
   * Payload of the output.
   */
  payload: Payload;
} | {
  /**
   * Status of the output.
   */
  status: OutputStatus.Failure;

  /**
   * Payload of the output.
   */
  payload: OutputError;
};

/**
 * Constructs a new output object with placeholder values.
 */
export function outputify<
  P = unknown,
>(
  output: Output<P>,
) {
  return output satisfies Output<P>;
}
