import { validateHash } from './authorization';
import { EntryInput } from './definitions';

describe('utils/authorization', () => {
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
});
