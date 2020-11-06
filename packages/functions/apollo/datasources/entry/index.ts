import { Document } from 'mongoose';

import { Entry } from '../../../db/schemata';
import { EntrySchema } from '../../../db/schemata/entry';
import MongooseDataSource from '../base';

class EntryDataSource extends MongooseDataSource<EntrySchema> {
  constructor() {
    super('Entry', Entry, [{ path: 'station' }]);
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
          `Failed to fetch latest ${this.model} entry from station ID: ${station}.`
        );
      }
      return entry.toJSON();
    } catch (e) {
      console.error(e);
      throw new Error(`Failed to fetch latest ${this.model} data entry.`);
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
}

export default EntryDataSource;