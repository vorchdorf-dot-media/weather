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
    return stations.createOne(station);
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
    return stations.getOne({ id });
  },

  async stations(
    _parent: unknown,
    { name }: { name?: string },
    {
      connection,
      dataSources: { stations },
    }: { connection: Connection; dataSources: { stations: StationDataSource } }
  ): Promise<StationSchema[]> {
    return stations.getMany(
      Object.assign({}, name ? { name: new RegExp(name, 'i') } : null)
    );
  },

  async stationsCount(
    _parent: unknown,
    _variables: unknown,
    {
      dataSources: { stations },
    }: { dataSources: { stations: StationDataSource } }
  ): Promise<number> {
    return stations.countAll();
  },
};
