import { Station } from '../../../db/schemata';
import { StationSchema } from '../../../db/schemata/station';
import MongooseDataSource from '../base';

class StationDataSource extends MongooseDataSource<StationSchema> {
  constructor() {
    super('Station', Station);
  }
}

export default StationDataSource;
