import { Document, Model } from 'mongoose';

import { Entry } from '../../../db/schemata';
import { EntrySchema } from '../../../db/schemata/entry';
import MongooseDataSource from '../base';
import StationDataSource from '../station';

class EntryDataSource extends MongooseDataSource<EntrySchema> {
  private stations: StationDataSource;

  constructor() {
    super('Entry', Entry, [{ path: 'station' }]);
    this.stations = new StationDataSource();
  }

  private async getStationID(station: string): Promise<string> {
    const result = await this.stations.model.findOne({ name: station }, '_id');
    if (!result) {
      throw new Error(
        `Failed to fetch Station entry with name: ${station}! Not found.`
      );
    }
    return result._id;
  }

  async count({
    station,
    from,
    to,
  }: {
    station?: string;
    from?: string;
    to?: string;
  }): Promise<number> {
    let filter: { [key: string]: string }[];
    try {
      const stationID = station && (await this.getStationID(station));

      filter = []
        .concat(
          stationID ? [{ station: stationID }] : null,
          from ? [{ timestamp: { $gt: new Date(from) } }] : null,
          to ? [{ timestamp: { $lte: new Date(to) } }] : null
        )
        .filter(f => !!f);

      const result = await this.model.countDocuments({ $and: filter });
      return result;
    } catch (e) {
      console.error(e);
      throw new Error(
        `Failed to count ${this.name} entries using filter: ${JSON.stringify(
          filter
        )}`
      );
    }
  }

  async getLatest(station: string): Promise<EntrySchema> {
    try {
      const stationID = await this.getStationID(station);
      const [entry] = (await this.model
        .find({ station: stationID })
        .sort({ timestamp: 'desc' })
        .limit(1)
        .then(this.populateModel.bind(this))) as Document<EntrySchema>[];
      if (!entry) {
        throw new Error(
          `Failed to fetch latest ${this.name} entry from station ID: ${station}.`
        );
      }
      return entry.toJSON() as EntrySchema;
    } catch (e) {
      console.error(e);
      throw new Error(`Failed to fetch latest ${this.name} data entry.`);
    }
  }

  async getEntries(
    station: string,
    from: string,
    to: string | number = Date.now()
  ): Promise<EntrySchema[]> {
    try {
      const stationID = await this.getStationID(station);
      const results = (await this.model
        .find({
          $and: [
            { station: stationID },
            { timestamp: { $gt: new Date(from) } },
            { timestamp: { $lte: new Date(to) } },
          ],
        })
        .sort({ timestamp: 'desc' })
        .then(this.populateModel.bind(this))) as Document<EntrySchema>[];

      return results.map(r => r.toJSON()) as EntrySchema[];
    } catch (e) {
      console.error(e);
      throw new Error(`Failed to fetch data from ${this.name} entries.`);
    }
  }

  async getTemperatureExtreme({
    station,
    from,
    to,
    low,
  }: {
    station?: string;
    from?: string;
    to?: string;
    low?: boolean;
  }): Promise<EntrySchema> {
    const stationID = station && (await this.getStationID(station));
    const filter = []
      .concat(
        stationID && { station: stationID },
        from && { timestamp: { $gt: new Date(from) } },
        to && { timestamp: { $lte: new Date(to) } }
      )
      .filter(f => !!f);
    try {
      const results: EntrySchema[] = await this.model.aggregate([
        {
          $match: filter.length ? { $and: filter } : {},
        },
        {
          $lookup: {
            from: 'stations',
            localField: 'station',
            foreignField: '_id',
            as: 'station_data',
          },
        },
        {
          $sort: {
            'station_data.config.temperature': -1,
            'station_data.config.temperature2': -1,
            temperature: low ? 1 : -1,
            temperature2: low ? 1 : -1,
          },
        },
        {
          $limit: 10,
        },
      ]);

      const populated = (await (Entry.populate(
        results,
        this.populate
      ) as unknown)) as EntrySchema[];

      return populated
        .sort((a: EntrySchema, b: EntrySchema): number => {
          const aTemp = low
            ? Math.min(a.temperature, a.temperature2)
            : Math.max(a.temperature, a.temperature2);
          const bTemp = low
            ? Math.min(b.temperature, b.temperature2)
            : Math.max(b.temperature, b.temperature2);
          if (aTemp < bTemp) {
            return low ? -1 : 1;
          }
          return low ? 1 : -1;
        })
        .shift();
    } catch (e) {
      console.error(e);
      throw new Error(`Failed to fetch extreme ${this.name} entry.`);
    }
  }
}

export default EntryDataSource;
