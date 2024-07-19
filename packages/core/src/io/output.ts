export enum OutputStatus {
  Success,
  Failure,
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

  payload: never;
} | {

  status: OutputStatus.Success;

  payload: Payload;

} | {
  status: OutputStatus.Failure;

  payload: OutputFailure;
};
