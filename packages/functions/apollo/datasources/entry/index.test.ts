import connect from '../../../db';
import { StationSchema } from '../../../db/schemata/station';
import { EntryDataSource, StationDataSource } from '..';

describe('Entry DataSource', () => {
  let entry: EntryDataSource;
  let station: StationDataSource;

  let demoStation: StationSchema;

  const ENTRY_DATA = {
    hash: 'testhash',
    timestamp: new Date(),
    temperature: 22.1,
    temperature2: 22.31,
    humidity: 60.0,
    feels: 22.51,
  };

  const STATION_DATA = {
    email: 'entryDataSourceTest@mail.com',
    name: 'entryDataSourceTest',
  };

  beforeAll(async () => {
    await connect();
    entry = new EntryDataSource();
    station = new StationDataSource();

    demoStation = await station.createOne(STATION_DATA);
  });

  it('creates Entry', async () => {
    const demoEntry = await entry.createOne({
      ...ENTRY_DATA,
      station: demoStation.id,
    });

    expect(demoStation.id).toBeDefined();
    expect(demoEntry.temperature).toEqual(ENTRY_DATA.temperature);

    await expect(entry.getById(demoEntry.id)).resolves.toEqual(demoEntry);
  });

  it('counts Entries', async () => {
    const count = await entry.count({ station: demoStation.id });

    expect(count).toEqual(1);
  });

  it('gets Entries', async () => {
    const entries = await entry.getEntries(
      demoStation.id,
      new Date(ENTRY_DATA.timestamp.valueOf() - 1000).toISOString()
    );

    expect(entries).toHaveLength(1);
  });

  it('gets extreme Entry', async () => {
    const additionalEntry = await entry.createOne({
      ...ENTRY_DATA,
      hash: 'testhash2',
      temperature: ENTRY_DATA.temperature - 2,
      temperature2: ENTRY_DATA.temperature2 - 2,
      station: demoStation.id,
    });

    const extreme = await entry.getTemperatureExtreme({
      station: demoStation.id,
    });

    expect(extreme).toHaveProperty('temperature', ENTRY_DATA.temperature);

    const extremeLow = await entry.getTemperatureExtreme({
      station: demoStation.id,
      low: true,
    });

    expect(extremeLow).toHaveProperty(
      'temperature',
      additionalEntry.temperature
    );

    await entry.deleteOne(additionalEntry.id);
  });

  it('updates Entry', async () => {
    const temperature = 23.71;
    const demoEntry = await entry.getLatest(demoStation.id);
    const updated = await entry.updateOne({
      ...demoEntry,
      temperature,
    });

    expect(updated).toHaveProperty('temperature', temperature);
    expect(updated).toHaveProperty('__v', 1);
  });

  it('deletes Entry', async () => {
    const demoEntry = await entry.getLatest(demoStation.id);
    const deleted = await entry.deleteOne(demoEntry.id);

    expect(deleted).toHaveProperty('id', demoEntry.id);

    await expect(entry.deleteOne(demoEntry.id)).rejects.toThrowError();
  });

  it('fails to fetch Entry from invalid Station', async () => {
    await expect(entry.getLatest('asdf')).rejects.toThrowError();
  });

  it('fails to fetch Entry using invalid query', async () => {
    await expect(entry.getOne({ _id: 'invalid' })).rejects.toThrowError();
    await expect(entry.getById('invalid')).rejects.toThrowError();
  });

  it('fails to fetch Entries with invalid query', async () => {
    await expect(
      entry.getMany({ $and: { id: demoStation.id } })
    ).rejects.toThrowError();
  });

  it('fails to create Entry with invalid data', async () => {
    await expect(
      entry.createOne({
        id: 'qewr',
        hash: 'asdf',
        station: 'asdf',
        ...ENTRY_DATA,
      })
    ).rejects.toThrowError();
  });

  it('fails to update non-existant Entry', async () => {
    await expect(
      entry.updateOne({ id: 'qwert', ...ENTRY_DATA })
    ).rejects.toThrowError();
  });
});
