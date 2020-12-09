import { createHash } from 'crypto';
import { Document } from 'mongoose';

import connect from '..';
import { Entry, Station } from '.';
import { EntryInput } from '../../utils/definitions';
import { StationSchema } from './station';

const stationData: StationSchema = {
  email: 'entrytest@mail.com',
  name: 'EntryTest',
};

const payload: EntryInput = {
  feels: 22.22,
  hash: null,
  humidity: 60.0,
  temperature: [22.51, 22.34],
  timestamp: Math.floor(Date.now() * 0.001),
};

describe('Entry', () => {
  let entry: Document;
  let station: Document;

  beforeAll(async () => {
    await connect();
    station = await Station.create(stationData);

    const [temperature, temperature2] = payload.temperature;
    const hash = createHash('sha1');
    hash.update(
      [
        station._id,
        temperature,
        temperature2,
        payload.humidity,
        payload.feels,
        payload.timestamp,
      ].join('')
    );
    entry = await Entry.create({
      ...payload,
      station: station._id,
      temperature,
      temperature2,
      hash: hash.digest('hex'),
    });
  });

  it('creates entry', async () => {
    await entry.populate('station').execPopulate();

    expect(entry._id).toBeDefined();
    expect(entry.get('temperature')).toEqual(payload.temperature[0]);
    expect(entry.get('station').get('id')).toEqual(station._id);
    expect(entry.get('station').get('email')).toEqual(stationData.email);

    expect(typeof entry.get('timestamp')).toEqual('string');
    expect(typeof entry.get('createdAt')).toEqual('string');
    expect(typeof entry.get('updatedAt')).toEqual('string');
  });
});
