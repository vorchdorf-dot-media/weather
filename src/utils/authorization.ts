import { parse } from 'basic-auth';

import { Station } from '../db/schemata';
import { AUTH_SCOPE } from './definitions';

const adminUser = process.env.ADMIN_USER;
const adminPassword = process.env.ADMIN_PASSWORD;

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
    return station ? AUTH_SCOPE.STATION : AUTH_SCOPE.UNAUTHENTICATED;
  } catch (e) {
    console.error(e);
    return AUTH_SCOPE.UNAUTHENTICATED;
  }
};
