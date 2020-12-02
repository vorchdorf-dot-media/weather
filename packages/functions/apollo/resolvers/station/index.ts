import { AuthenticationError } from 'apollo-server-micro';
import type { Connection } from 'mongoose';
import { StationSchema } from '../../../db/schemata/station';
import { scope } from '../../../utils/authorization';
import { AUTH_SCOPE, StringObject } from '../../../utils/definitions';
import { StationDataSource } from '../../datasources';

export const StationMutation = {
  async createStation(
    _parent: unknown,
    { station }: { station: StationSchema },
    {
      dataSources: { stations },
      headers: { authorization },
    }: { dataSources: { stations: StationDataSource }; headers: StringObject }
  ): Promise<StationSchema> {
    const s = await scope(authorization);
    if (s < AUTH_SCOPE.ADMIN) {
      throw new AuthenticationError('Insufficient user privileges.');
    }

    return stations.createOne(station);
  },
};

export const StationQuery = {
  async station(
    _parent: unknown,
    { id }: { id: string },
    {
      dataSources: { stations },
    }: { dataSources: { stations: StationDataSource } }
  ): Promise<StationSchema> {
    return stations.getOne({ id });
  },

  async stations(
    _parent: unknown,
    _args: unknown,
    {
      connection,
      dataSources: { stations },
    }: { connection: Connection; dataSources: { stations: StationDataSource } }
  ): Promise<StationSchema[]> {
    return stations.getMany({}).then(async results => {
      await connection.close(true);
      return results;
    });
  },
};
