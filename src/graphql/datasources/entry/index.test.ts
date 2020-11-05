import { StationSchema } from 'src/db/schemata/station';
import { EntryDataSource, StationDataSource } from '../';

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