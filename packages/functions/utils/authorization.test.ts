import mongoose, { Document } from 'mongoose';

import connect from '../db';
import { Station } from '../db/schemata';
import { scope, validateHash } from './authorization';
import { AUTH_SCOPE, EntryInput } from './definitions';

const createBasicHeader = (user: string, password: string): string =>
  'Basic ' + Buffer.from(`${user}:${password}`).toString('base64');

describe('utils/authorization', () => {
  let station: Document;

  const STATION_DATA = {
    email: 'authorizationtest@mail.com',
    name: 'AuthorizationTest',
  };

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeAll(async () => {
    await connect();
    station = await Station.create(STATION_DATA);
  });

  it('validates entry hash', () => {
    const user = 'd2Hr633Y';
    const payload: EntryInput = {
      hash: '65c7d057d5825ca278af70624f1f2c0b4270a1c6',
      timestamp: 1607006701,
      temperature: [19.13, 19.2],
      humidity: 48.0,
      feels: 18.43,
    };
    const authorizationHeader = `Basic ${Buffer.from(
      `${user}:${payload.hash}`
    ).toString('base64')}`;

    expect(validateHash(authorizationHeader, payload)).toEqual(user);
  });

  it('returns authorization scope', async () => {
    const adminScopeHeader = createBasicHeader(
      process.env.ADMIN_USER,
      process.env.ADMIN_PASSWORD
    );
    await expect(scope(adminScopeHeader)).resolves.toEqual(AUTH_SCOPE.ADMIN);

    const stationScopeHeader = createBasicHeader(station._id, 'blargh');
    await expect(scope(stationScopeHeader)).resolves.toEqual(
      AUTH_SCOPE.STATION
    );

    const unauthenticatedScopeHeader = createBasicHeader('asdf', 'blargh');
    await expect(scope(unauthenticatedScopeHeader)).resolves.toEqual(
      AUTH_SCOPE.UNAUTHENTICATED
    );

    const noUserHeader = createBasicHeader('', 'blargh');
    await expect(scope(noUserHeader)).resolves.toEqual(
      AUTH_SCOPE.UNAUTHENTICATED
    );

    const noPasswordHeader = createBasicHeader('admin', '');
    await expect(scope(noPasswordHeader)).resolves.toEqual(
      AUTH_SCOPE.UNAUTHENTICATED
    );
  });
});
