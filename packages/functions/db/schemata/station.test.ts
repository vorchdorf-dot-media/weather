import mongoose, { Document } from 'mongoose';

import connect from '../';
import Station, { StationSchema } from './station';

const STATION_DATA: StationSchema = {
  name: 'StationTest',
  email: 'stationtest@mail.com',
};

describe('Station', () => {
  let station: Document<StationSchema>;

  afterAll(async () => {
    await mongoose.connection.close();
  });

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
    const obj = station;

    expect(typeof obj.get('createdAt')).toEqual('string');
    expect(typeof obj.get('updatedAt')).toEqual('string');
    expect(obj.id).toEqual(station._id);
  });
});
