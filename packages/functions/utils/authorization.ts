import { createHash } from 'crypto';
import { parse } from 'basic-auth';

import { Station } from '../db/schemata';
import { AUTH_SCOPE, EntryInput } from './definitions';

const adminUser = process.env.ADMIN_USER;
const adminPassword = process.env.ADMIN_PASSWORD;

export const validateHash = (
  authorizationHeader: string,
  payload: EntryInput
): string => {
  const { name: station, pass } = parse(authorizationHeader);

  const {
    hash,
    timestamp,
    temperature: [temperature, temperature2] = [],
    humidity,
    feels,
  } = payload;

  const str = [
    station,
    temperature > -274.0 && temperature,
    temperature2 > -274.0 && temperature2,
    humidity > -1.0 && humidity,
    feels > -274.0 && feels,
    timestamp,
  ]
    .filter(v => !!v)
    .join('');

  const control = createHash('sha1');
  control.update(str);

  return pass === hash && control.digest('hex') === hash && station;
};

export const scope = async (
  authorizationHeader: string
): Promise<AUTH_SCOPE> => {
  const { name, pass } = parse(authorizationHeader) || {};

  if (!name || !pass) {
    return AUTH_SCOPE.UNAUTHENTICATED;
  }

  if (name === adminUser && pass === adminPassword) {
    return AUTH_SCOPE.ADMIN;
  }

  try {
    const station = await Station.findById(name);
    if (!station) {
      throw new Error(`No station found with ID: ${name}`);
    }
    return station._id === name
      ? AUTH_SCOPE.STATION
      : AUTH_SCOPE.UNAUTHENTICATED;
  } catch (e) {
    console.error(e);
    return AUTH_SCOPE.UNAUTHENTICATED;
  }
};
