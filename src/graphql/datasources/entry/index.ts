import { Entry } from '../../../db/schemata';
import { EntrySchema } from '../../../db/schemata/entry';
import MongooseDataSource from '../base';

class EntryDataSource extends MongooseDataSource<EntrySchema> {
  constructor() {
    super('Entry', Entry, [{ path: 'station' }]);
  }
}

export default EntryDataSource;
