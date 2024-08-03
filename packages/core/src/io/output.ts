export enum OutputStatus {
  Success = 1,
  Failure = 0,
}

export enum OutputFailureType {
  Unauthorized,
  Forbidden,
  NotFound,
  Conflict,
  InternalServerError,
}

export type OutputFailure = {
  type: OutputFailureType;
  title: string;
  message: string;
};

export type Output<
  Payload = unknown
> = {
  status: OutputStatus;

  payload: Payload;
};

/**
 * Constructs a new output object with placeholder values.
 */
export function outputify<
  P = unknown,
>(
  output: Partial<Output<P>>,
) {
  return {
    status: OutputStatus.Success,
    payload: undefined as P,
    ...output,
  } satisfies Output<P>;
}
