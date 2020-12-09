import { Document } from 'mongoose';

import connect from '../';
import Station, { StationSchema } from './station';

const STATION_DATA: StationSchema = {
  name: 'StationTest',
  email: 'stationtest@mail.com',
};

describe('Station', () => {
  let station: Document;

  beforeAll(async () => {
    await connect();
    station = await Station.create(STATION_DATA);
  });

  it('creates entry', () => {
    expect(station.get('id')).toBeDefined();
    expect(station.get('name')).toEqual(STATION_DATA.name);
    expect(station.get('email')).toEqual(STATION_DATA.email);
    expect(station.get('coordinates')).toEqual({});
    expect(station.get('address')).toEqual({});
  });

  it('returns JSON object', () => {
    const obj = station.toJSON();

    expect(typeof obj.createdAt).toEqual('string');
    expect(typeof obj.updatedAt).toEqual('string');
    expect(obj.id).toEqual(station._id);
  });
});
