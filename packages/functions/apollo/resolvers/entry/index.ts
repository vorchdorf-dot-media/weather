import { AuthenticationError } from 'apollo-server-micro';
import type { Connection } from 'mongoose';

import { EntrySchema } from '../../../db/schemata/entry';
import { scope, validateHash } from '../../../utils/authorization';
import {
  AUTH_SCOPE,
  EntryInput,
  StringObject,
} from '../../../utils/definitions';
import { EntryDataSource } from '../../datasources';

export const EntryMutation = {
  async createEntry(
    _parent: unknown,
    args: EntryInput,
    {
      connection,
      dataSources: { entries },
      headers: { authorization },
    }: {
      connection: Connection;
      dataSources: { entries: EntryDataSource };
      headers: StringObject;
    }
  ): Promise<EntrySchema> {
    const s = await scope(authorization);
    if (s !== AUTH_SCOPE.STATION) {
      throw new AuthenticationError(
        'Only registered stations are allowed to create entries.'
      );
    }

    const station = validateHash(authorization, args);
    if (!station) {
      throw new Error('Failed to validate hash!');
    }

    const [temperature, temperature2] = args.temperature;
    return entries.createOne({
      ...args,
      station,
      temperature,
      temperature2,
      timestamp: new Date(args.timestamp * 1000),
    });
  },
};

export const EntryQuery = {
  async entry(
    _parent: unknown,
    { station }: { station: string },
    {
      connection,
      dataSources: { entries },
    }: { connection: Connection; dataSources: { entries: EntryDataSource } }
  ): Promise<EntrySchema> {
    return entries.getLatest(station);
  },

  async entries(
    _parent: unknown,
    { station, from, to }: { station: string; from: string; to?: string },
    {
      connection,
      dataSources: { entries },
    }: { connection: Connection; dataSources: { entries: EntryDataSource } }
  ): Promise<EntrySchema[]> {
    return entries.getEntries(station, from, to);
  },
};
