export interface RandomObject {
  [key: string]: unknown;
}

export interface StringObject {
  [key: string]: string;
}

export interface EntryInput {
  hash: string;
  timestamp: number;
  temperature: number[];
  humidity: number;
  feels: number;
}

export enum AUTH_SCOPE {
  UNAUTHENTICATED,
  STATION,
  ADMIN,
}

export const BASE_58 =
  '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';

export const ID_SHORT = 8;

export const ID_LONG = 24;

export const isTest = (): boolean => process.env.NODE_ENV === 'test';
