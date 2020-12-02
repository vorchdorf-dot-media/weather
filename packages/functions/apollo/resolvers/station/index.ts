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
      connection,
      dataSources: { stations },
      headers: { authorization },
    }: {
      connection: Connection;
      dataSources: { stations: StationDataSource };
      headers: StringObject;
    }
  ): Promise<StationSchema> {
    const s = await scope(authorization);
    if (s < AUTH_SCOPE.ADMIN) {
      throw new AuthenticationError('Insufficient user privileges.');
    }
    const result = await stations.createOne(station);
    await connection.close(true);
    return result;
  },
};

export const StationQuery = {
  async station(
    _parent: unknown,
    { id }: { id: string },
    {
      connection,
      dataSources: { stations },
    }: { connection: Connection; dataSources: { stations: StationDataSource } }
  ): Promise<StationSchema> {
    const result = await stations.getOne({ id });
    await connection.close(true);
    return result;
  },

  async stations(
    _parent: unknown,
    _args: unknown,
    {
      connection,
      dataSources: { stations },
    }: { connection: Connection; dataSources: { stations: StationDataSource } }
  ): Promise<StationSchema[]> {
    const result = await stations.getMany({});
    await connection.close(true);
    return result;
  },
};
