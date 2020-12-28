import { Document } from 'mongoose';

import { Entry } from '../../../db/schemata';
import { EntrySchema } from '../../../db/schemata/entry';
import MongooseDataSource from '../base';

class EntryDataSource extends MongooseDataSource<EntrySchema> {
  constructor() {
    super('Entry', Entry, [{ path: 'station' }]);
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
    const filter = []
      .concat(
        station ? [{ station }] : null,
        from ? [{ timestamp: { $gt: new Date(from) } }] : null,
        to ? [{ timestamp: { $lte: new Date(to) } }] : null
      )
      .filter(f => !!f);

    try {
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
      const [entry] = (await this.model
        .find({ station })
        .sort({ timestamp: 'desc' })
        .limit(1)
        .then(this.populateModel.bind(this))) as Document[];
      if (!entry) {
        throw new Error(
          `Failed to fetch latest ${this.name} entry from station ID: ${station}.`
        );
      }
      return entry.toJSON();
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
      const results = (await this.model
        .find({
          $and: [
            { station },
            { timestamp: { $gt: new Date(from) } },
            { timestamp: { $lte: new Date(to) } },
          ],
        })
        .sort({ timestamp: 'desc' })
        .then(this.populateModel.bind(this))) as Document[];

      return results.map(r => r.toJSON());
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
    const filter = []
      .concat(
        station && { station },
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
