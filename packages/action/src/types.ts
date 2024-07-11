export interface ActionObject<Type extends string, Payload> {
  type: Type;
  payload: Payload;
}

export type Action<Type extends string, Payload> = (payload: Payload) => ActionObject<Type, Payload>;

export type AmbitResult = {
  status: false;
  code: number;
} | {
  status: true;
};

export enum AmbitError {
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  InternalServerError = 500,
}

export type Ambit<Payload> = (payload: Payload) => AmbitResult;
