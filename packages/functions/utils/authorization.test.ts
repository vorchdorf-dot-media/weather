import { Document } from 'mongoose';

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

  beforeAll(async () => {
    await connect();
    station = await Station.create(STATION_DATA);
  });

  it('validates entry hash', () => {
    const user = 'PJPWQSfT';
    const payload: EntryInput = {
      hash: 'b64ad2c3921da922acdb54e13fb59e8cbd2fb48d',
      timestamp: 1604250300,
      temperature: [22.4, 22.51],
      humidity: 60.0,
      feels: 22.71,
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
