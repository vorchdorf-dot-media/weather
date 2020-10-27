export interface RandomObject {
  [key: string]: any;
}

export interface StringObject {
  [key: string]: string;
}

export enum AUTH_SCOPE {
  UNAUTHENTICATED,
  STATION,
  ADMIN,
}

export const BASE_58 =
  '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';

export const ID_SHORT = 8;
